#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
zipar.py — Compacta uma pasta em .zip

Uso:
    python zipar.py projeto_reconstruido
    python zipar.py projeto_reconstruido -o backup.zip
    python zipar.py projeto_reconstruido --exclude node_modules .git dist
"""

import argparse
import sys
import zipfile
from pathlib import Path


def make_zip(
    src: Path,
    zip_path: Path,
    excludes: list[str],
    include_root: bool = True,
) -> None:
    src = src.resolve()
    if not src.is_dir():
        raise SystemExit(f"❌ Pasta não encontrada: {src}")

    excludes_set = {e.strip("/").replace("\\", "/") for e in excludes}

    def is_excluded(rel: Path) -> bool:
        # rel é o caminho relativo à raiz
        parts = rel.parts
        for ex in excludes_set:
            ex_parts = ex.split("/")
            # casa em qualquer nível
            for i in range(len(parts) - len(ex_parts) + 1):
                if parts[i:i + len(ex_parts)] == tuple(ex_parts):
                    return True
        return False

    total = 0
    total_bytes = 0
    skipped = 0

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for file in sorted(src.rglob("*")):
            if not file.is_file():
                continue
            rel = file.relative_to(src)
            if is_excluded(rel):
                skipped += 1
                continue

            # prefixo dentro do zip
            arcname = (Path(src.name) / rel) if include_root else rel
            zf.write(file, arcname.as_posix())

            total += 1
            total_bytes += file.stat().st_size

    size_kb = zip_path.stat().st_size / 1024
    ratio = (size_kb * 1024 / total_bytes * 100) if total_bytes else 0
    print(f"📦 {zip_path}")
    print(f"   {total} arquivos  |  {total_bytes/1024:.1f} KB → {size_kb:.1f} KB  ({ratio:.1f}%)")
    if skipped:
        print(f"   {skipped} arquivo(s) ignorado(s) por --exclude")


def main():
    ap = argparse.ArgumentParser(description="Compacta uma pasta em .zip")
    ap.add_argument("pasta", type=Path, help="Pasta a compactar")
    ap.add_argument(
        "-o", "--output", type=Path, default=None,
        help="Nome do .zip (default: <pasta>.zip)",
    )
    ap.add_argument(
        "--exclude", nargs="*", default=None,
        help="Nomes/relativos pra excluir (ex.: node_modules .git dist)",
    )
    ap.add_argument(
        "--no-root", action="store_true",
        help="Não coloca a pasta raiz dentro do zip (só o conteúdo)",
    )
    args = ap.parse_args()

    zip_path = args.output or args.pasta.with_suffix(".zip")

    # Defaults sensatos de exclusão se o usuário não passar nada
    excludes = args.exclude if args.exclude is not None else [
        "node_modules", ".git", "dist", "build", ".next", ".vite",
        "__pycache__", ".DS_Store", "*.log",
    ]

    make_zip(args.pasta, zip_path, excludes, include_root=not args.no_root)


if __name__ == "__main__":
    main()
