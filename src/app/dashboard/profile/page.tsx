import { createSessionClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/dashboard/ProfileForm';

export default async function ProfilePage() {
    let user: { $id: string, email: string, name: string } | null = null;

    try {
        const { account } = await createSessionClient();
        const appwriteUser = await account.get();
        user = {
            $id: appwriteUser.$id,
            email: appwriteUser.email,
            name: appwriteUser.name,
        };
    } catch (e) {
        redirect('/login');
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-20 space-y-16">
            <header className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground text-sm">Update your profile information and security preferences.</p>
            </header>

            <ProfileForm user={user} />
        </div>
    );
}
