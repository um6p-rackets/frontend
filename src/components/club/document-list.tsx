'use client';

import { useState, useEffect } from 'react';
import { BookOpenText, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api/api';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export interface ClubDocument {
  id: number;
  club_id: number;
  description: string;
  path: string; 
  title: string;
  created_at?: string;
}

function DocumentCard({
  clubSlug,
  document,
  isAdmin,
  onDelete
}: {
  clubSlug: string;
  document: ClubDocument;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const dateStr = document.created_at 
    ? new Date(document.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api(`/clubs/${clubSlug}/documents/${document.id}`, { method: 'DELETE' });
      onDelete(document.id);
      toast.success("Document deleted", {
        description: "The document has been permanently removed.",
      });
    } catch (error) {
      console.error('Failed to delete', error);
      toast.error("Failed to delete", {
        description: "An error occurred while deleting the document.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isLongDescription = Boolean(
    document.description && (document.description.length > 140 || document.description.includes('\n'))
  );

  return (
    <div className="p-4 gap-2 flex flex-col justify-between items-start m-0 border border-border/70 bg-card rounded-xl shadow-2xs group relative hover:shadow-md transition-shadow duration-300">
      
      {isAdmin && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 transition-opacity text-destructive hover:bg-destructive/10 z-10" 
              />
            }
          >
            <Trash2 className="w-4 h-4" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the document.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="w-full pr-8">
        <h3 className="font-bold text-base sm:text-lg text-foreground">{document.title}</h3>
        {document.description && (
          <div className="mt-1">
            <p className={cn(
              "text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-all",
              !isExpanded && "line-clamp-3"
            )}>
              {document.description}
            </p>
            {isLongDescription && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs text-brand-orange hover:text-brand-orange/80 hover:bg-transparent p-0 h-auto font-semibold cursor-pointer"
              >
                {isExpanded ? "Show less" : "Show more"}
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between w-full pt-3 mt-2 border-t border-border/40">
        <Link
          href={document.path || "#"}
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
  clubSlug,
  isAdmin = false
}: {
  clubSlug: string;
  isAdmin?: boolean;
}) {
  const [documents, setDocuments] = useState<ClubDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [path, setPath] = useState('');

  useEffect(() => {
    async function fetchDocuments() {
      if (!clubSlug) return setIsLoading(false);
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

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !path.trim()) return;

    setIsSubmitting(true);
    
    try {
      const res = await api<ClubDocument>(`/clubs/${clubSlug}/documents`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          path,
        }),
      });
      
      setDocuments([res, ...documents]);
      setTitle('');
      setDescription('');
      setPath('');
      setIsAddOpen(false);
      
      toast.success("Document added", {
        description: "Your new document is now available to members.",
      });
    } catch (error) {
      console.error('Failed to add document', error);
      toast.error("Failed to add document", {
        description: "An error occurred while adding the document.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeDocumentFromState = (id: number) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>;

  return (
    <div className="flex-1 flex flex-col">
      
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger 
              render={
                <Button size="sm" className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-2" />
              }
            >
              <Plus className="w-4 h-4" /> Add Document
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDocument} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Document Title</Label>
                  <Input 
                    placeholder="e.g., Club Rules 2026" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea 
                    placeholder="Briefly describe this document..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>File Link</Label>
                  <Input 
                    type="url"
                    placeholder="https://example.com/document.pdf" 
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting || !path.trim()} className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-sm text-muted-foreground italic p-6 text-center bg-card rounded-xl border border-border/70 mt-2">
          No documents have been added for this club yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-2">
          {documents.map((document) => (
            <DocumentCard 
              key={document.id} 
              clubSlug={clubSlug}
              document={document} 
              isAdmin={isAdmin} 
              onDelete={removeDocumentFromState} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
