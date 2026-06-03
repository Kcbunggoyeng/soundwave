import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import AudioPlayer from "@/components/player/AudioPlayer";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex bg-black min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 pb-24 min-h-screen overflow-y-auto">
          {children}
        </main>
        <AudioPlayer />
      </div>
    </SessionProvider>
  );
}