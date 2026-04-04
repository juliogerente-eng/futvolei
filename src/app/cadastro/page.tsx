"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUpSchema, type SignUpInput } from "@/lib/validators";

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<SignUpInput>>({
    role: "athlete",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");
    setErrors({});

    // Validate
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    const validated = result.data;
    const supabase = createClient();

    // Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          name: validated.name,
          role: validated.role,
        },
      },
    });

    if (authError) {
      setGeneralError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Insert user record
      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: validated.email,
        name: validated.name,
        phone: validated.phone || null,
        city: validated.city,
        state: validated.state.toUpperCase(),
        role: validated.role,
      });

      if (insertError) {
        setGeneralError("Erro ao criar perfil. Tente novamente.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
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
          <p className="text-text-secondary mt-2">Crie sua conta gratuitamente</p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-xl p-8"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {generalError && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  background: "var(--color-error-bg)",
                  color: "var(--color-error)",
                  border: "1px solid var(--color-error)",
                }}
              >
                {generalError}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                Eu sou:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "athlete", label: "🏐 Atleta", desc: "Jogo e quero meu ranking" },
                  { value: "organizer", label: "📋 Organizador", desc: "Crio campeonatos" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: option.value as "athlete" | "organizer" }))}
                    className="p-4 rounded-lg text-left transition-all duration-200"
                    style={{
                      background:
                        formData.role === option.value
                          ? "var(--color-primary-glow)"
                          : "var(--color-bg)",
                      border: `2px solid ${
                        formData.role === option.value
                          ? "var(--color-primary)"
                          : "var(--color-border)"
                      }`,
                    }}
                  >
                    <div className="text-lg font-semibold">{option.label}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
                  {errors.role}
                </p>
              )}
            </div>

            {/* Name */}
            <InputField
              label="Nome completo"
              name="name"
              type="text"
              placeholder="Seu nome"
              value={formData.name || ""}
              onChange={handleChange}
              error={errors.name}
            />

            {/* Email */}
            <InputField
              label="E-mail"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email || ""}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Password */}
            <InputField
              label="Senha"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password || ""}
              onChange={handleChange}
              error={errors.password}
            />

            {/* City & State */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <InputField
                  label="Cidade"
                  name="city"
                  type="text"
                  placeholder="Sua cidade"
                  value={formData.city || ""}
                  onChange={handleChange}
                  error={errors.city}
                />
              </div>
              <div>
                <InputField
                  label="Estado"
                  name="state"
                  type="text"
                  placeholder="SP"
                  value={formData.state || ""}
                  onChange={handleChange}
                  error={errors.state}
                  maxLength={2}
                />
              </div>
            </div>

            {/* Phone */}
            <InputField
              label="Telefone (opcional)"
              name="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone || ""}
              onChange={handleChange}
              error={errors.phone}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-base transition-all duration-200 disabled:opacity-50"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-bg)",
              }}
            >
              {loading ? "Criando conta..." : "Criar conta grátis"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-secondary)" }}>
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-medium transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  maxLength,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1.5 text-text-secondary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 rounded-lg text-sm transition-colors outline-none"
        style={{
          background: "var(--color-bg)",
          border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
          color: "var(--color-text)",
        }}
      />
      {error && (
        <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
