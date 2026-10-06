import { ClubPageData } from '@/types/club';
import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

function DocumentCard({
  document
}: {
  document: ClubPageData['documents'][0];
}) {
  return (
    <div className="p-4 gap-2 flex flex-col justify-between items-start m-0 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 ">
      <h3 className="font-bold text-lg">{document.title}</h3>
      <p className="text-sm text-muted-foreground">{document.description}</p>
      <p className="text-xs text-muted-foreground w-full  text-right">
        {document.date}
      </p>
      <Link
        href={document.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-accent font-semibold hover:underline"
      >
        <BookOpenText /> <span> Open Document </span>
      </Link>
    </div>
  );
}

export default function DocumentList({
  documents
}: {
  documents: ClubPageData['documents'];
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {documents.map((document, index) => (
        <DocumentCard key={index} document={document} />
      ))}
    </div>
  );
}
