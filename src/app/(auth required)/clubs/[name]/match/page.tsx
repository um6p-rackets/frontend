'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/store/auth';
import MatchRequestForm from '@/components/match/match-request-form';
import MatchAcceptSection from '@/components/match/match-accept-section';

export default function MatchPage() {
    const params = useParams<{ name: string }>();
    const clubSlug = params?.name ?? 'tennis';
    const user = useAuth((state) => state.user);

    const currentUserName = user ? `${user.first_name} ${user.last_name}` : 'Campus Athlete';
    const currentUserDepartment = user?.department && user.department.trim() !== '' 
        ? user.department 
        : 'Sport Department';
    const currentUserAvatar = user?.avatar || null;
    const currentMemberId = user?.id ? Number(user.id) : 1;

    return (
        <div className="space-y-12 pb-16">
            {/* Form to create/request a new match */}
            <MatchRequestForm
                clubSlug={clubSlug}
                currentMemberId={currentMemberId}
                currentUserName={currentUserName}
                currentUserDepartment={currentUserDepartment}
                currentUserAvatar={currentUserAvatar}
            />

            {/* Section to review and accept pending match requests */}
            <MatchAcceptSection clubSlug={clubSlug} />
        </div>
    );
}
