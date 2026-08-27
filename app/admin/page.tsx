import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getContent } from "@/lib/data";
import AdminApp from "./AdminApp";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const content = await getContent();
  return <AdminApp initial={content} email={data.user.email ?? "admin"} />;
}
