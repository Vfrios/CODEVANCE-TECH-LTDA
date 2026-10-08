import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authMock } from "@/services/auth-mock";
import { Button, TextInput } from "@mantine/core";
import { IconMail as Mail, IconArrowLeft as ArrowLeft, IconLoader2 as Loader2 } from "@tabler/icons-react";
import AuthLayout from "./AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authMock.resetPasswordRequest(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Não foi possível solicitar a redefinição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Redefinir senha"
      subtitle="Enviaremos um link para você criar uma nova senha."
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          <ArrowLeft className="w-3 h-3 inline mr-1" />Voltar para entrar
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-foreground text-center">
          Se houver uma conta associada a este e-mail, você receberá um link para
          redefinir a senha.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <TextInput
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar link de redefinição"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
