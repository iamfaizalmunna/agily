import { personInitials } from "@/lib/items/assign";

export function AssigneeMarks({
  people,
}: {
  people: { id: string; name: string }[];
}) {
  if (!people.length) {
    return <span className="text-xs text-paper/35">Unassigned</span>;
  }
  return (
    <ul className="flex flex-wrap gap-1">
      {people.map((person) => (
        <li
          key={person.id}
          title={person.name}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-copper/20 text-[0.65rem] text-copper"
        >
          {personInitials(person.name)}
        </li>
      ))}
    </ul>
  );
}
