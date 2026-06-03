import { LoginForm } from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Masuk — SoundWave" };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/home");
  return <LoginForm />;
}