export default function NotFound() {
  return (
    <div className=" h-[600px] flex justify-center items-center flex-col mt-10">
      <div className="font-bold text-3xl">
        Oops! The site you tried to access doesn't exist
      </div>
      <div className="text-7xl mt-5">🚧</div>
      <div className="mt-5">Please try again.</div>
    </div>
  );
}
