import { getUserProfile } from '@/lib/actions/profile';
import ProfileEditForm from '@/components/profile/profile-edit-form';
import ChangePasswordForm from '@/components/profile/change-password-form';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Profil Saya - Nilam Bordir',
};

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-gray-600">Profile tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
        <p className="text-gray-600">Kelola informasi profil Anda</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-6">Informasi Pribadi</h2>
        <ProfileEditForm profile={profile} />
      </div>

      <Separator />

      {/* Change Password */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-6">Ubah Password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
