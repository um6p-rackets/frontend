


export default function SectionHeader({ title, id }: { title: string; id: string }) {
  return (
    <div className="flex items-center gap-2 w-full mt-8 mb-5" id={id}>
      <span className="h-2.5 w-30 bg-accent" />
      <h2 className="text-xl  text-secondary-foreground font-semibold">{title}</h2>
    </div>
  );
}