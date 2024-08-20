import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseURL } from "../Shared";
import AddCustomer from "../components/AddCustomer";
import useFetch from "../hooks/UseFetch";

export default function Customers() {
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);

  const url = baseURL + "/api/customers/";
  const {
    request,
    appendData,
    data: { customers } = {},
    errorStatus,
    loading,
  } = useFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
  });

  useEffect(() => {
    request();
  }, [request]);

  function newCustomer(name, industry) {
    appendData({ name, industry }, "customers");
    if (!errorStatus) {
      toggleShow();
    }
  }

  useEffect(() => {
    if (errorStatus) {
      console.error("Failed to add a new customer: ", errorStatus);
    } else if (customers) {
      toggleShow();
    }
  }, [customers, errorStatus, toggleShow]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-[500px] mx-auto">
      <h1 className="flex justify-center items-center mb-4">Customers</h1>
      {errorStatus ? (
        <div className="text-red-500">Error: {errorStatus}</div>
      ) : null}
      {customers
        ? customers.map((customer) => {
            return (
              <div
                className="m-2 flex justify-center items-center"
                key={customer.id}
              >
                <Link to={"/customers/" + customer.id}>
                  <button className="no-underline bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    {customer.name}
                  </button>
                </Link>
              </div>
            );
          })
        : null}
      <AddCustomer
        newCustomer={newCustomer}
        show={show}
        toggleShow={toggleShow}
      />
    </div>
  );
}
