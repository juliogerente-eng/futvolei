import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: userData } = await supabase
    .from("users")
    .select("name, role")
    .eq("id", user.id)
    .single();

  const userName = userData?.name || user.email || "Usuário";
  const userRole = userData?.role || "athlete";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={userName} userRole={userRole} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
