import { RegisterForm } from "@/components/auth/RegisterForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Daftar — SoundWave" };

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/home");

  return (
    <div>
      <RegisterForm />
    </div>
  );
}