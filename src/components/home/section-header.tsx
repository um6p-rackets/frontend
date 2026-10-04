

export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 w-full mt-8 mb-5">
      <span className="h-[10px] w-[120px] bg-accent" />
      <h2 className="text-xl  text-secondary-foreground font-semibold">{title}</h2>
    </div>
  );
}