import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RatingBadge from "@/components/RatingBadge";
import ProfileForm from "./ProfileForm";

export const metadata = {
  title: "Perfil | QuadraHub",
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!userData) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">👤 Meu Perfil</h1>

      {/* Avatar & Rating */}
      <div
        className="rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6"
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
          style={{
            background: "var(--color-primary-glow)",
            color: "var(--color-primary)",
            border: "3px solid var(--color-primary)",
          }}
        >
          {userData.avatar_url ? (
            <img
              src={userData.avatar_url}
              alt={userData.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            userData.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold">{userData.name}</h2>
          <p className="text-text-secondary text-sm">{userData.city}, {userData.state}</p>
          {profile && (
            <div className="mt-2">
              <RatingBadge rating={profile.rating} size="lg" />
            </div>
          )}
        </div>
      </div>

      {/* Edit Form */}
      <ProfileForm user={userData} />
    </div>
  );
}
