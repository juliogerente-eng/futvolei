"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createChampionshipSchema } from "@/lib/validators";
import { SUPPORTED_TEAM_COUNTS } from "@/lib/constants";



export default function NovoCampeonatoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    category: "amador",
    format: "grupos_mata_mata",
    max_teams: 8,
    start_date: "",
    end_date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "max_teams" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = createChampionshipSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Você precisa estar logado.");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("championships")
      .insert({
        ...result.data,
        organizer_id: user.id,
        status: "draft",
      })
      .select("id")
      .single();

    if (insertError) {
      setError("Erro ao criar campeonato. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push(`/organizar/${data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">🏆 Novo Campeonato</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl p-6 space-y-5"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        {error && (
          <div className="p-3 rounded-lg text-sm"
            style={{ background: "var(--color-error-bg)", color: "var(--color-error)" }}>
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5 text-text-secondary">Nome do campeonato</label>
          <input name="name" value={formData.name} onChange={handleChange}
            placeholder="Ex: Copa Praia Grande 2025"
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Cidade</label>
            <input name="city" value={formData.city} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Estado</label>
            <input name="state" value={formData.state} onChange={handleChange} maxLength={2}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Categoria</label>
            <select name="category" value={formData.category} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
              <option value="amador">Amador</option>
              <option value="profissional">Profissional</option>
              <option value="misto">Misto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Formato</label>
            <select name="format" value={formData.format} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
              <option value="grupos_mata_mata">Grupos + Mata-mata</option>
              <option value="eliminatoria_direta">Eliminatória Direta</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-text-secondary">Número de duplas</label>
          <select name="max_teams" value={formData.max_teams} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
            {SUPPORTED_TEAM_COUNTS.map((n) => (
              <option key={n} value={n}>{n} duplas</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Data início</label>
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Data término</label>
            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}>
          {loading ? "Criando..." : "Criar Campeonato"}
        </button>
      </form>
    </div>
  );
}
