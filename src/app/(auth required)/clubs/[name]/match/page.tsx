'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/store/auth';
import MatchRequestForm from '@/components/match/match-request-form';

export default function MatchPage() {
    const params = useParams<{ name: string }>();
    const clubSlug = params?.name ?? 'tennis';
    const user = useAuth((state) => state.user);

    const currentUserName = user ? `${user.first_name} ${user.last_name}` : 'Campus Athlete';
    
    // Defaults to "Sport Department" if department is null, undefined, or empty string
    const currentUserDepartment = user?.department && user.department.trim() !== '' 
        ? user.department 
        : 'Sport Department';

    const currentUserAvatar = user?.avatar || null;
    const currentMemberId = user?.id ? Number(user.id) : 1;

    return (
        <MatchRequestForm
        clubSlug={clubSlug}
        currentMemberId={currentMemberId}
        currentUserName={currentUserName}
        currentUserDepartment={currentUserDepartment}
        currentUserAvatar={currentUserAvatar}
        />
    );
}