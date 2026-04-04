"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signInSchema } from "@/lib/validators";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos"
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Digite seu e-mail");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/auth/callback` }
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="gradient-text">Quadra</span>
              <span className="text-text">Hub</span>
            </h1>
          </Link>
          <p className="text-text-secondary mt-2">
            {resetMode ? "Recuperar senha" : "Entre na sua conta"}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-8"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          {resetSent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-lg font-semibold mb-2">E-mail enviado!</h2>
              <p className="text-sm text-text-secondary">
                Verifique sua caixa de entrada para redefinir sua senha.
              </p>
              <button
                onClick={() => {
                  setResetMode(false);
                  setResetSent(false);
                }}
                className="mt-4 text-sm font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                Voltar ao login
              </button>
            </div>
          ) : (
            <form
              onSubmit={resetMode ? handleResetPassword : handleLogin}
              className="space-y-5"
            >
              {error && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{
                    background: "var(--color-error-bg)",
                    color: "var(--color-error)",
                    border: "1px solid var(--color-error)",
                  }}
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5 text-text-secondary"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              {!resetMode && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1.5 text-text-secondary"
                  >
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-base transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-bg)",
                }}
              >
                {loading
                  ? resetMode
                    ? "Enviando..."
                    : "Entrando..."
                  : resetMode
                  ? "Enviar link de recuperação"
                  : "Entrar"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setResetMode(!resetMode);
                    setError("");
                  }}
                  className="text-sm transition-colors"
                  style={{ color: "var(--color-primary)" }}
                >
                  {resetMode ? "Voltar ao login" : "Esqueci minha senha"}
                </button>
              </div>
            </form>
          )}

          {!resetMode && !resetSent && (
            <p
              className="text-center text-sm mt-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Não tem conta?{" "}
              <Link
                href="/cadastro"
                className="font-medium transition-colors"
                style={{ color: "var(--color-primary)" }}
              >
                Criar conta grátis
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
