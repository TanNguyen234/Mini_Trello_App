export default function Home() {
  return (
    <div>
      <h2 className="text-lg text-gray-300 mb-6">YOUR WORKSPACES</h2>

      <div className="flex gap-6">
        {/* Existing board */}
        <div className="bg-white text-black w-48 h-32 rounded shadow p-3 cursor-pointer hover:shadow-lg">
          My Trello board
        </div>

        {/* Create new board */}
        <div className="bg-transparent border border-gray-500 text-gray-300 w-48 h-32 rounded p-3 flex items-center justify-center cursor-pointer hover:bg-[#334155]">
          + Create a new board
        </div>
      </div>
    </div>
  );
}