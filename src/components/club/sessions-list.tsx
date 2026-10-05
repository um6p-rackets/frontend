function SessionCard() {
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-semibold">Session Title</h3>
      <p className="text-sm text-gray-600">Session description goes here.</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">Date: 2024-06-01</span>
        <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Join
        </button>
      </div>
    </div>
  );
}

export default function SessionsList() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <SessionCard />
      <SessionCard />
      <SessionCard />
      <SessionCard />
      <SessionCard />
      <SessionCard />
    </div>
  );
}