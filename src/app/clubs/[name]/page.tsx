'use client';

import { useParams } from 'next/navigation'

export default function ClubPage() {
  const params = useParams<{ name: string;}>()

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-center mt-8">{params.name} Club</h1>
      <p className="text-center mt-4">Welcome to the {params.name} club page!</p>
    </div>
  );
}