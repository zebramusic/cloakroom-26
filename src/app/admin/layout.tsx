import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0">
        <div className="lg:pl-0 pl-16">{children}</div>
      </main>
    </div>
  );
}
