import { redirect } from "next/navigation";

// /tools was a dumping ground. Everything moved to a proper home.
export default function ToolsPage() {
  redirect("/dashboard");
}
