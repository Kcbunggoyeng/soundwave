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
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <Link
          href="/creator-register"
          className="flex items-center gap-2 text-zinc-500 hover:text-green-400 text-sm transition-colors"
        >
          <span>🎙️</span>
          <span className="hover:underline underline-offset-4">
            Daftar sebagai Artist / Creator
          </span>
        </Link>
      </div>
    </div>
  );
}