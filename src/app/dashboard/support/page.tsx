import { createSessionClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { SupportChat } from '@/components/dashboard/SupportChat';

export default async function SupportPage() {
  try {
    const { account } = await createSessionClient();
    await account.get();
  } catch {
    redirect('/login');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Support Chat</h1>
        <p className="text-muted-foreground text-sm">Talk with the CheckBeforeCommit team.</p>
      </header>

      <SupportChat />
    </div>
  );
}
