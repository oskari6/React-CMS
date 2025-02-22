import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../../App";
import Logout from "../Logout";

const navigation = [
  { name: "Home", href: "/home" },
  { name: "Employees", href: "/employees" },
  { name: "Customers", href: "/customers" },
  { name: "Dictionary", href: "/dictionary" },
];

export default function Header() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex w-full justify-center items-center bg-blue-100 py-5">
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
    </div>
  );
}
