import { Link } from "react-router-dom";
import { SITE } from "@/config/site";

export default function UserNotRegisteredError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-5">
      <div className="w-full max-w-lg rounded-2xl border border-forest-soft bg-[#111111] p-8 text-center">
        <h1 className="text-2xl font-bold text-white">Acesso não autorizado</h1>
        <p className="mt-3 leading-relaxed text-muted-soft">
          Esta conta ainda não tem acesso a esta área. Se você acredita que isso
          é um engano, fale com a equipe pelo e-mail{" "}
          <a
            className="text-bio underline underline-offset-4"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
          </a>
          .
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl border border-forest-soft px-5 py-3 font-semibold text-white transition-colors hover:border-[#22C55E]/50"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
