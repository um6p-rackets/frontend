import ProfileView from '@/components/profile/profile-view';
import { getUserProfile } from '@/lib/mock-data';

export default function ProfilePage() {
  const data = getUserProfile(1);
  return <ProfileView data={data} />;
}
