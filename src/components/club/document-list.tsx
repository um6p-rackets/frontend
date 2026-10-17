'use client';

import { useState, useEffect } from 'react';
import { BookOpenText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api/api';

// 1. Updated interface to match your exact database columns
export interface ClubDocument {
  id: number;
  club_id: number;
  description: string;
  path: string; // Changed from 'url' to 'path'
  title: string;
  created_at?: string; // Made optional just in case it is missing from the DB
}

function DocumentCard({
  document
}: {
  document: ClubDocument;
}) {
  // Only format the date if your backend actually sends it
  const dateStr = document.created_at 
    ? new Date(document.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <div className="p-4 gap-2 flex flex-col justify-between items-start m-0 border border-border/70 bg-card rounded-xl shadow-2xs hover:shadow-md transition-shadow duration-300">
      <h3 className="font-bold text-base sm:text-lg text-foreground">{document.title}</h3>
      {document.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">{document.description}</p>
      )}
      
      <div className="flex items-center justify-between w-full pt-3 mt-2 border-t border-border/40">
        <Link
          href={document.path || "#"} // Using 'path' to open the document
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-brand-orange font-semibold hover:underline text-sm"
        >
          <BookOpenText className="w-4 h-4" /> <span> Open Document </span>
        </Link>
        {dateStr && (
          <span className="text-xs font-semibold text-muted-foreground/80">
            {dateStr}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DocumentList({
  clubSlug
}: {
  clubSlug: string;
}) {
  const [documents, setDocuments] = useState<ClubDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      if (!clubSlug) {
        setIsLoading(false);
        return;
      }
      
      try {
        const res = await api<ClubDocument[] | { data: ClubDocument[] }>(`/clubs/${clubSlug}/documents`);
        const docsArray = Array.isArray(res) ? res : (res.data || []);
        setDocuments(docsArray);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDocuments();
  }, [clubSlug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic p-6 text-center bg-card rounded-xl border border-border/70">
        No documents have been uploaded for this club yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}
