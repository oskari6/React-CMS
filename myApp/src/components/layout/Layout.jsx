import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Content from "./Content";

export default function Layout({ children }) {
  return (
    <div className="bg-white">
      <div className="flex justify-center bg-gray-50">
        <div className="h-[150px]">
          <a href="/home">
            <img alt="logo" className="w-full h-full" src="./logo.jpg" />
          </a>
        </div>
      </div>
      <nav className="">
        <Header />
      </nav>
      <main>
        <Outlet />
      </main>
      <Content>{children}</Content>
      <Footer />
    </div>
  );
}
