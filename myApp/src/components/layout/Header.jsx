import { useContext, useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../../App";
import Logout from "../Logout";
import { FormControl, Button } from "react-bootstrap";

const navigation = [
  { name: "Home", href: "/home" },
  { name: "Employees", href: "/employees" },
  { name: "Customers", href: "/customers" },
  { name: "Orders", href: "/orders" },
  { name: "Items", href: "/items" },
  { name: "Dictionary", href: "/dictionary" },
];

export default function Header() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        // Adjust this value for when navbar should stick
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const panelItems = [
    { name: "item1", href: "/item1" },
    { name: "item2", href: "/item2" },
    { name: "item3", href: "/item3" },
    { name: "item4", href: "/item4" },
    { name: "item5", href: "/item5" },
    { name: "item6", href: "/item6" },
    { name: "item7", href: "/item7" },
    { name: "item8", href: "/item8" },
    { name: "item9", href: "/item9" },
    { name: "item10", href: "/item10" },
    { name: "item11", href: "/item11" },
  ];

  const handleLogoutClick = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    setLoggedIn(false);
    localStorage.clear();
    setIsModalOpen(true); // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`flex w-full justify-center items-center bg-blue-100 py-4 ${
        isSticky ? "fixed top-0 left-0 w-full shadow-lg z-50" : ""
      }`}
    >
      <nav>
        <div className="absolute left-10 text-xl">
          <Button onClick={() => setIsPanelOpen(!isPanelOpen)}>☰</Button>
        </div>
        <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
          {panelItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="block p-3 text-white hover:bg-gray-600"
            >
              {item.name}
            </NavLink>
          ))}
        </SidePanel>
        {loggedIn ? (
          <div className="flex justify-center items-center px-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href} //with navlink update this to to
                className={({ isActive }) => {
                  return (
                    "block rounded-md px-3 text-base font-medium no-underline " +
                    (!isActive
                      ? "text-gray-600 hover:bg-gray-700 hover:text-white"
                      : "bg-blue-300 text-white")
                  );
                }}
              >
                {item.name}
              </NavLink>
            ))}
            <NavLink
              to="/home"
              onClick={handleLogoutClick}
              className="px-3 rounded-md font-medium no-underline text-red-500 hover:bg-red-600 hover:text-white"
            >
              Logout
            </NavLink>
            {isModalOpen && <Logout onClose={handleCloseModal} />}
            <div className="absolute right-20">
              <SearchBarNavigation />
            </div>
          </div>
        ) : (
          <div>
            <NavLink
              to="/login"
              className="px-3 rounded-md font-medium no-underline text-gray-500 hover:bg-gray-400 hover:text-white"
            >
              Login
            </NavLink>
            <NavLink
              to="/api/register/"
              className="px-3 rounded-md font-medium no-underline text-gray-500 hover:bg-gray-400 hover:text-white"
            >
              Register
            </NavLink>
          </div>
        )}
      </nav>
    </div>
  );
}

function SidePanel({ isOpen, onClose, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);
  return (
    <div
      className={`z-10 fixed top-0 left-0 h-full w-64 bg-gray-500 text-white shadow-lg transiton-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      ref={panelRef}
    >
      <button className="absolute top-4 right-4 text-black" onClick={onClose}>
        ✖
      </button>
      <div className="flex justify-center items-center flex-col mt-10">
        <FormControl
          type="text"
          placeholder="Search"
          className="w-[80%] rounded p-1"
        />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function SearchBarNavigation() {
  return (
    <div>
      <FormControl type="text" placeholder="Search" className="rounded p-1" />
    </div>
  );
}
