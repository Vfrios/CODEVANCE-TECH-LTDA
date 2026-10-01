#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
reconstruir.py — Reconstrói um projeto a partir do base44_backup.txt

Uso:
    python reconstruir.py base44_backup.txt
    python reconstruir.py base44_backup.txt -o ./meu-projeto
    python reconstruir.py base44_backup.txt -o ./meu-projeto --zip
    python reconstruir.py base44_backup.txt --dry-run      # só simula
    python reconstruir.py base44_backup.txt --list         # só lista arquivos
"""

import argparse
import io
import os
import re
import sys
import zipfile
from pathlib import Path

# ---------------------------------------------------------------------------
# Encoding: Base44 devolve UTF-8. Se você salvou como latin-1, ajusta aqui.
# Pode passar mais de um e o script tenta na ordem.
# ---------------------------------------------------------------------------
ENCODINGS = ["utf-8", "utf-8-sig", "latin-1", "cp1252"]

# Marcador exato que separa os arquivos. Aceita variação de espaços.
HEADER_RE = re.compile(
    r"^// FILE:\s*(?P<path>.+?)\s*$",
    re.MULTILINE,
)
SEP = "=" * 80


def read_backup(path: Path) -> str:
    """Lê o arquivo tentando múltiplos encodings."""
    raw = path.read_bytes()
    for enc in ENCODINGS:
        try:
            text = raw.decode(enc)
            print(f"📖 Lido com encoding: {enc}")
            return text
        except UnicodeDecodeError:
            continue
    raise SystemExit(
        "❌ Não consegui decodificar o arquivo. "
        "Tente convertê-lo para UTF-8 antes (ex.: no VS Code)."
    )


def parse_backup(text: str) -> dict[str, str]:
    """
    Retorna {caminho: código}.
    Suporta dois formatos:
      A) === / // FILE: path / === / código   (o que você tem)
      B) // FILE: path / código até o próximo // FILE:
    """
    files: dict[str, str] = {}

    # --- Formato A: usa o separador de '=' como âncora forte ---
    # Split pelo bloco:
    # ================================================================================
    # // FILE: <path>
    # ================================================================================
    pattern_a = re.compile(
        r"^={80}\s*\n"
        r"// FILE:\s*(?P<path>.+?)\s*\n"
        r"={80}\s*\n"
        r"(?P<body>.*?)"
        r"(?=^={80}\s*\n// FILE:|\Z)",
        re.DOTALL | re.MULTILINE,
    )

    for m in pattern_a.finditer(text):
        path = m.group("path").strip()
        body = m.group("body")
        # remove a quebra final extra que veio do join('\n\n')
        body = body.rstrip("\n")
        if body.endswith("\n\n"):
            body = body[:-1]
        files[path] = body

    # --- Fallback: formato B, caso o A não ache nada ---
    if not files:
        matches = list(HEADER_RE.finditer(text))
        for i, m in enumerate(matches):
            path = m.group("path").strip()
            start = m.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            body = text[start:end]
            # limpa separadores de '=' que ficaram grudados
            body = body.lstrip("\n")
            if body.startswith(SEP):
                body = body[len(SEP):].lstrip("\n")
            body = body.rstrip("\n")
            files[path] = body

    if not files:
        raise SystemExit(
            "❌ Nenhum arquivo encontrado. Confirme que o .txt está no formato "
            "esperado (linhas '// FILE: caminho')."
        )

    return files


def sanitize_path(p: str) -> str:
    """Normaliza o caminho e bloqueia tentativas de path traversal."""
    p = p.replace("\\", "/").strip()
    p = p.lstrip("/")
    # Remove componentes perigosos
    parts = []
    for part in p.split("/"):
        if part in ("", ".", ".."):
            continue
        parts.append(part)
    return "/".join(parts)


def write_files(files: dict[str, str], out_dir: Path, dry_run: bool = False) -> None:
    out_dir = out_dir.resolve()
    if not dry_run:
        out_dir.mkdir(parents=True, exist_ok=True)

    total = len(files)
    escritos = 0
    vazios = []

    for path, code in sorted(files.items()):
        safe = sanitize_path(path)
        if not safe:
            print(f"  ⚠️  caminho inválido ignorado: {path!r}")
            continue

        full = out_dir / safe
        if not dry_run:
            full.parent.mkdir(parents=True, exist_ok=True)
            # grava sempre UTF-8 (padrão moderno) com quebra final
            data = code
            if data and not data.endswith("\n"):
                data += "\n"
            full.write_text(data, encoding="utf-8", newline="\n")

        escritos += 1
        if not code.strip():
            vazios.append(safe)

        status = "🧪" if dry_run else "✅"
        print(f"  {status} {safe}  ({len(code)} chars)")

    print(f"\n📊 {escritos}/{total} arquivos " + ("simulados" if dry_run else "escritos"))
    if vazios:
        print(f"⚠️  {len(vazios)} arquivo(s) vazios:")
        for v in vazios:
            print(f"     - {v}")


def make_zip(files: dict[str, str], zip_path: Path) -> None:
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for path, code in sorted(files.items()):
            safe = sanitize_path(path)
            if not safe:
                continue
            zf.writestr(safe, code if code.endswith("\n") or not code else code + "\n")
    size_kb = zip_path.stat().st_size / 1024
    print(f"📦 ZIP criado: {zip_path} ({size_kb:.1f} KB, {len(files)} arquivos)")


def print_tree(out_dir: Path, max_entries: int = 500) -> None:
    """Mostra a árvore gerada (bem simples)."""
    print("\n🌳 Estrutura gerada:")
    count = 0
    for root, dirs, fnames in os.walk(out_dir):
        dirs.sort()
        fnames.sort()
        rel = Path(root).relative_to(out_dir)
        depth = 0 if str(rel) == "." else len(rel.parts)
        if str(rel) != ".":
            print("  " * (depth - 1) + f"📁 {rel.name}/")
        for f in fnames:
            print("  " * depth + f"📄 {f}")
            count += 1
            if count >= max_entries:
                print(f"  ... (truncado em {max_entries} arquivos)")
                return


def main():
    ap = argparse.ArgumentParser(
        description="Reconstrói projeto a partir do base44_backup.txt"
    )
    ap.add_argument("backup", type=Path, help="Caminho do arquivo .txt de backup")
    ap.add_argument(
        "-o", "--output", type=Path, default=Path("./projeto_reconstruido"),
        help="Pasta de saída (default: ./projeto_reconstruido)",
    )
    ap.add_argument("--zip", action="store_true", help="Também gera um .zip")
    ap.add_argument("--dry-run", action="store_true", help="Só simula, não escreve nada")
    ap.add_argument("--list", action="store_true", help="Só lista os arquivos encontrados")
    ap.add_argument("--tree", action="store_true", help="Mostra a árvore ao final")
    args = ap.parse_args()

    if not args.backup.is_file():
        raise SystemExit(f"❌ Arquivo não encontrado: {args.backup}")

    print(f"🔍 Lendo {args.backup} ...")
    text = read_backup(args.backup)

    print("🧩 Parseando arquivos ...")
    files = parse_backup(text)
    print(f"📁 {len(files)} arquivos detectados\n")

    if args.list:
        for p in sorted(files):
            print(f"  {p}  ({len(files[p])} chars)")
        return

    if not args.dry_run:
        # avisa se a pasta destino já existe e tem conteúdo
        if args.output.exists() and any(args.output.iterdir()):
            print(f"⚠️  {args.output} já existe e não está vazia. Sobrescrevendo...")

    print(f"✍️  Escrevendo em {args.output.resolve()} ...\n")
    write_files(files, args.output, dry_run=args.dry_run)

    if args.zip and not args.dry_run:
        zip_path = args.output.with_suffix(".zip")
        make_zip(files, zip_path)

    if args.tree and not args.dry_run:
        print_tree(args.output)

    print("\n🎉 Pronto!")


if __name__ == "__main__":
    main()
