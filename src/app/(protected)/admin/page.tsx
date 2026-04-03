import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminPanel from "./AdminPanel";

export const metadata = { title: "Admin | QuadraHub" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userData } = await supabase
    .from("users").select("role").eq("id", user.id).single();

  if (userData?.role !== "admin") redirect("/dashboard");

  const { data: users } = await supabase
    .from("users").select("*").order("created_at", { ascending: false });

  const { data: championships } = await supabase
    .from("championships").select("*").order("created_at", { ascending: false });

  return <AdminPanel users={users || []} championships={championships || []} />;
}
