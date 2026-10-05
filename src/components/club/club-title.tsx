export default function ClubTitle({ name }: { name: string }) {
  return (
    <h1 className="text-3xl font-bold mt-8 text-accent capitalize ">
      {name} <span className="text-secondary-foreground "> Club </span>
    </h1>
  );
}
