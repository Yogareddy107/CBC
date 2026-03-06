import { createSessionClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { SupportPanel } from '@/components/admin/SupportPanel';
import { ALLOWED_ADMIN_EMAILS } from '@/lib/admin';
import Link from 'next/link';

export default async function AdminSupportPage() {
  let user;
  try {
    const { account } = await createSessionClient();
    user = await account.get();
  } catch {
    redirect('/login');
  }

  if (!user.email || !ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">
        <header className="flex justify-between items-center border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Support Panel</h1>
            <p className="text-muted-foreground text-sm">Reply to user conversations and mark tickets as resolved.</p>
          </div>
          <Link href="/admin" className="text-sm font-medium hover:underline">
            Back to Admin Dashboard
          </Link>
        </header>

        <SupportPanel />
      </div>
    </div>
  );
}
