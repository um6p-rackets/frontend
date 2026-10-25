'use client';

import { useState } from 'react';
import { BookOpenText, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { 
  useClubDocuments, 
  useCreateDocument, 
  useDeleteDocument 
} from '@/hooks/use-documents';
import type { ClubDocument } from '@/types/contracts/club';

function DocumentCard({
  clubSlug,
  document,
  isAdmin,
}: {
  clubSlug: string;
  document: ClubDocument;
  isAdmin: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteMutation = useDeleteDocument(clubSlug);

  const isLongDescription = Boolean(
    document.description && (document.description.length > 140 || document.description.includes('\n'))
  );

  return (
    <div className="p-4 gap-2 flex flex-col justify-between items-start m-0 border border-border/70 bg-card rounded-xl shadow-2xs group relative hover:shadow-md transition-shadow duration-300 w-full overflow-hidden">

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
              <AlertDialogAction 
                onClick={() => deleteMutation.mutate(document.id)} 
                className="bg-destructive text-white hover:text-destructive hover:bg-white hover:border-destructive"
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="w-full pr-10">
        <h3 className="font-bold text-base sm:text-lg text-foreground break-all">{document.title}</h3>
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

      <div className="w-full flex items-center justify-between pt-3 mt-2 border-t border-border/40">
        <Link
          href={document.path || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-brand-orange font-semibold hover:underline text-sm truncate"
        >
          <BookOpenText className="w-4 h-4 shrink-0" /> <span className="truncate">Open Document</span>
        </Link>
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
  const [showAll, setShowAll] = useState(false);

  // Form States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [path, setPath] = useState('');

  const INITIAL_VISIBLE_COUNT = 3;

  const { data: documents = [], isLoading } = useClubDocuments(clubSlug);
  const createMutation = useCreateDocument(clubSlug);

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !path.trim()) return;
    createMutation.mutate(
      { title, description, path },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setPath('');
          setIsAddOpen(false);
        },
      }
    );
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>;

  const visibleDocuments = showAll ? documents : documents.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = documents.length > INITIAL_VISIBLE_COUNT;

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
                  <Button type="submit" disabled={createMutation.isPending || !path.trim()} className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add"}
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
          {visibleDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              clubSlug={clubSlug}
              document={document}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="pt-2 pb-1 flex justify-center mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-brand-orange hover:text-brand-orange/80 hover:bg-transparent p-0 h-auto font-semibold cursor-pointer inline-flex items-center gap-1"
          >
            {showAll ? (
              <><span>Show less</span><ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <><span>Show more ({documents.length - INITIAL_VISIBLE_COUNT} more)</span><ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
