import { useContext, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../App";
import Logout from "./Logout";

const navigation = [
  { name: "Employees", href: "/employees" },
  { name: "Customers", href: "/customers" },
  { name: "Dictionary", href: "/dictionary" },
];

export default function Header(props) {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    setIsModalOpen(true); // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-14 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch">
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href} //with navlink update this to to
                          className={({ isActive }) => {
                            return (
                              "rounded-md px-3 py-2 text-sm font-medium no-underline " +
                              (!isActive
                                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                : "bg-gray-900 text-white")
                            );
                          }}
                        >
                          {item.name}
                        </NavLink>
                      ))}
                      {loggedIn ? (
                        <>
                          <NavLink
                            to="#"
                            onClick={handleLogoutClick}
                            className="px-3 py-2 rounded-md text-sm font-medium no-underline text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            Logout
                          </NavLink>
                          {isModalOpen && <Logout onClose={handleCloseModal} />}
                        </>
                      ) : (
                        <>
                          <NavLink
                            to="/login"
                            className="px-3 py-2 rounded-md text-sm font-medium no-underline text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            Login
                          </NavLink>
                          <NavLink
                            to="/api/register/"
                            className="px-3 py-2 rounded-md text-sm font-medium no-underline text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            Register
                          </NavLink>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href} //with navlink update this to to
                    className={({ isActive }) => {
                      return (
                        "block rounded-md px-3 py-2 text-base font-medium no-underline " +
                        (!isActive
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "bg-gray-900 text-white")
                      );
                    }}
                  >
                    {item.name}
                  </NavLink>
                ))}
                {loggedIn ? (
                  <NavLink
                    to={"/login"}
                    onClick={() => {
                      setLoggedIn(false);
                      localStorage.clear();
                    }}
                    className="no-underline block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Logout
                  </NavLink>
                ) : (
                  <NavLink
                    to={"/login"}
                    className="no-underline block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div className="bg-gray-300">
        <div className="mx-autobg-gray-300 min-h-screen p-3">
          {props.children}
        </div>
      </div>
    </>
  );
}
