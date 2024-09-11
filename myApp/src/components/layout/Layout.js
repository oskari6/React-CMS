import Header from "../Header";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="bg-gray-300">
      <Header />
      <main>
        <Outlet />
      </main>
      <div className="mx-autobg-gray-300 min-h-screen p-3">{children}</div>
    </div>
  );
}
