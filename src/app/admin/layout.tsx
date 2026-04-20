import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        userName={session.user.name}
        userEmail={session.user.email}
        userRole={session.user.role}
      />
      <div className="lg:pl-64">
        <Navbar user={session.user} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
