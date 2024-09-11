export default function Content({children}) {
  return (
    <div className="bg-gray-300">
      <div className="mx-autobg-gray-300 min-h-screen p-3">
        {children}
      </div>
    </div>
  );
}
