"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfileSchema } from "@/lib/validators";
import type { User } from "@/types/database";

export default function ProfileForm({ user }: { user: User }) {
  const [formData, setFormData] = useState({
    name: user.name,
    city: user.city,
    state: user.state,
    phone: user.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = updateProfileSchema.safeParse(formData);
    if (!result.success) {
      setMessage({ type: "error", text: result.error.errors[0].message });
      setSaving(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update(result.data)
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: "Erro ao salvar. Tente novamente." });
    } else {
      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    }
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 space-y-5"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h3 className="text-lg font-semibold">Editar Dados</h3>

      {message && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{
            background: message.type === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
            color: message.type === "success" ? "var(--color-success)" : "var(--color-error)",
          }}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5 text-text-secondary">Nome</label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1.5 text-text-secondary">Cidade</label>
          <input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-text-secondary">Estado</label>
          <input
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            maxLength={2}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-text-secondary">Telefone</label>
        <input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
        style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
