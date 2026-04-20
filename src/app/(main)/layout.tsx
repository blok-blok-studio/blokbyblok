import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { ScreenCaptureGuard } from "@/components/protection/screen-capture-guard";
import { DailyLoginTracker } from "@/components/gamification/daily-login-tracker";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <ScreenCaptureGuard
      userEmail={session.user.email || undefined}
      userName={session.user.name || undefined}
    >
      <div className="min-h-screen bg-background">
        <Sidebar
          userName={session.user.name}
          userEmail={session.user.email}
          userRole={session.user.role}
        />
        <div className="lg:pl-64">
          <Navbar user={session.user} />
          <main className="p-4 lg:p-8">{children}</main>
          <DailyLoginTracker />
        </div>
      </div>
    </ScreenCaptureGuard>
  );
}
