import ProfileView from '@/components/profile/profile-view';
import { getUserProfile, mockUsers } from '@/lib/mock-data';

export async function generateStaticParams() {
  return mockUsers.map((user) => ({
    id: user.id.toString(),
  }));
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = getUserProfile(id);

  return <ProfileView data={data} />;
}
