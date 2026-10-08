import React, { useState } from "react";
import { motion } from "motion/react";
import { IconMessageCircle as MessageCircle, IconMail as Mail, IconBrandInstagram as Instagram, IconMapPin as MapPin, IconSend as Send } from "@tabler/icons-react";
import { SITE, whatsappLink } from "@/config/site";

export default function Contact() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipo: "Site",
    mensagem: "",
  });
  const [linkWhatsApp, setLinkWhatsApp] = useState("");
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
    setErros((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const mensagem = [
      `Olá! Meu nome é ${form.nome.trim()}.`,
      `Quero conversar sobre um projeto de ${form.tipo.toLowerCase()}.`,
      `E-mail: ${form.email.trim()}`,
      form.telefone.trim() && `Telefone: ${form.telefone.trim()}`,
      `Mensagem: ${form.mensagem.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

    setLinkWhatsApp(
      `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(mensagem)}`
    );
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
            Conte o que sua empresa precisa.
          </h2>
          <p className="mt-4 text-lg text-muted-soft">
            Diga um pouco sobre o que você está buscando. A gente lê sua
            mensagem e combina o próximo passo com você.
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
            {linkWhatsApp ? (
              <div
                role="status"
                className="flex flex-col items-center justify-center text-center py-16"
              >
                <MessageCircle size={48} className="text-bio" />
                <p className="mt-5 text-xl font-semibold text-white">
                  Sua mensagem está pronta
                </p>
                <p className="mt-2 max-w-sm text-muted-soft">
                  Vamos abrir o WhatsApp com os dados que você informou. Revise
                  a mensagem e toque em enviar por lá.
                </p>
                <a
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#14803C] px-6 py-3 text-white font-semibold transition-colors hover:bg-bio"
                >
                  <MessageCircle size={18} />
                  Abrir WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setLinkWhatsApp("")}
                  className="mt-4 text-sm text-muted-soft underline underline-offset-4 hover:text-white"
                >
                  Voltar e editar
                </button>
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
                      aria-describedby={erros.nome ? "erro-nome" : undefined}
                      autoComplete="name"
                      required
                    />
                    {erros.nome && <p id="erro-nome" className="text-red-400 text-xs mt-1">{erros.nome}</p>}
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
                      aria-describedby={erros.email ? "erro-email" : undefined}
                      autoComplete="email"
                      required
                    />
                    {erros.email && <p id="erro-email" className="text-red-400 text-xs mt-1">{erros.email}</p>}
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
                      autoComplete="tel"
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
                      placeholder="O que você gostaria de resolver? *"
                      rows={4}
                      className={`${inputBase} resize-none`}
                      aria-invalid={!!erros.mensagem}
                      aria-describedby={erros.mensagem ? "erro-mensagem" : undefined}
                      required
                    />
                    {erros.mensagem && <p id="erro-mensagem" className="text-red-400 text-xs mt-1">{erros.mensagem}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-shine mt-7 w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#14803C] hover:bg-bio text-white font-semibold transition-all duration-200 glow-green-sm"
                >
                  <Send size={18} />
                  Continuar pelo WhatsApp
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
