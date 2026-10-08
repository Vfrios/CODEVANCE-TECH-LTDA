import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-5 text-center">
      <div className="max-w-lg">
        <p className="font-heading text-6xl font-bold text-bio">404</p>
        <h1 className="mt-4 text-3xl font-bold text-white">
          Não encontramos essa página
        </h1>
        <p className="mt-3 leading-relaxed text-muted-soft">
          O endereço pode estar incorreto ou a página não está mais disponível.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#14803C] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#22C55E]"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
