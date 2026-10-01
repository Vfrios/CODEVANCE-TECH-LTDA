import React, { useState } from "react";
import { motion } from "motion/react";
import { IconMessageCircle as MessageCircle, IconMail as Mail, IconBrandInstagram as Instagram, IconMapPin as MapPin, IconSend as Send, IconCircleCheck as CheckCircle2 } from "@tabler/icons-react";
import { SITE, whatsappLink } from "@/config/site";

export default function Contact() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipo: "Site",
    mensagem: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [erros, setErros] = useState({});

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Informe seu nome";
    if (!form.email.trim()) e.email = "Informe seu e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido";
    if (!form.mensagem.trim()) e.mensagem = "Escreva uma mensagem";
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    // ============================================================
    // PONTO DE INTEGRAÇÃO DO FORMULÁRIO
    // Conecte aqui o envio real (Formspree, EmailJS ou backend).
    // Exemplo com backend: await fetch("/api/contato", { method: "POST", body: JSON.stringify(form) })
    // ============================================================
    setEnviado(true);
    setForm({ nome: "", email: "", telefone: "", tipo: "Site", mensagem: "" });
    setTimeout(() => setEnviado(false), 6000);
  };

  const inputBase =
    "w-full bg-transparent border-b border-white/15 focus:border-bio outline-none py-3 text-white placeholder:text-white/40 transition-colors";

  return (
    <section id="contato" className="relative bg-obsidian py-24 sm:py-32 overflow-hidden">
      <div className="absolute -top-20 right-0 w-[30rem] h-[30rem] rounded-full bg-[#0B3D2E]/30 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="text-bio text-sm font-semibold uppercase tracking-wider">
            Contato
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-white leading-tight">
            Vamos conversar sobre o seu problema?
          </h2>
          <p className="mt-4 text-lg text-muted-soft">
            Para projetos de sites, o primeiro passo é agendar um encontro
            presencial. Conte o que você precisa e nós cuidamos do resto.
          </p>
        </motion.div>

        <div className="mt-14 grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Meios de contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl bg-[#14803C] hover:bg-bio p-5 text-white transition-all duration-200 glow-green-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="font-semibold text-lg">WhatsApp</p>
                <p className="text-white/80 text-sm">Fale com a gente agora</p>
              </div>
            </a>

            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-4 rounded-2xl border border-forest-soft bg-[#111111] hover:border-[#22C55E]/40 p-5 text-white transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/50 border border-forest-soft flex items-center justify-center text-bio">
                <Mail size={24} />
              </div>
              <div>
                <p className="font-semibold text-lg">E-mail</p>
                <p className="text-muted-soft text-sm">{SITE.email}</p>
              </div>
            </a>

            <a
              href={`https://instagram.com/${SITE.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-forest-soft bg-[#111111] hover:border-[#22C55E]/40 p-5 text-white transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/50 border border-forest-soft flex items-center justify-center text-bio">
                <Instagram size={24} />
              </div>
              <div>
                <p className="font-semibold text-lg">Instagram</p>
                <p className="text-muted-soft text-sm">@{SITE.instagram}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-forest-soft bg-[#111111] p-5 text-white">
              <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/50 border border-forest-soft flex items-center justify-center text-bio">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-semibold text-lg">Endereço</p>
                <p className="text-muted-soft text-sm">{SITE.city}</p>
              </div>
            </div>
          </motion.div>

          {/* Formulário */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-forest-soft bg-[#111111] p-7 sm:p-9"
          >
            {enviado ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <CheckCircle2 size={56} className="text-bio" />
                <p className="mt-5 text-xl font-semibold text-white">
                  Mensagem enviada com sucesso!
                </p>
                <p className="mt-2 text-muted-soft">
                  Em breve entraremos em contato com você.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="nome" className="sr-only">Nome</label>
                    <input
                      id="nome"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Nome *"
                      className={inputBase}
                      aria-invalid={!!erros.nome}
                    />
                    {erros.nome && <p className="text-red-400 text-xs mt-1">{erros.nome}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="sr-only">E-mail</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="E-mail *"
                      className={inputBase}
                      aria-invalid={!!erros.email}
                    />
                    {erros.email && <p className="text-red-400 text-xs mt-1">{erros.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="telefone" className="sr-only">Telefone</label>
                    <input
                      id="telefone"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      placeholder="Telefone (opcional)"
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label htmlFor="tipo" className="sr-only">Tipo de interesse</label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/15 focus:border-bio outline-none py-3 text-white transition-colors [&>option]:bg-[#111111]"
                    >
                      <option>Site</option>
                      <option>Software</option>
                      <option>Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="sr-only">Mensagem</label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={form.mensagem}
                      onChange={handleChange}
                      placeholder="Conte o seu problema... *"
                      rows={4}
                      className={`${inputBase} resize-none`}
                      aria-invalid={!!erros.mensagem}
                    />
                    {erros.mensagem && <p className="text-red-400 text-xs mt-1">{erros.mensagem}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-shine mt-7 w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#14803C] hover:bg-bio text-white font-semibold transition-all duration-200 glow-green-sm"
                >
                  <Send size={18} />
                  Enviar mensagem
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
