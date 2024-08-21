import React, { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import AddCustomer from "../components/AddCustomer";
import useCustomers from "../hooks/useCustomers";

export default function Customers() {
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);

  const {
    request,
    appendData,
    data: { customers = [] } = {},
    errorStatus,
    loading,
  } = useCustomers();

  useEffect(() => {
    request();
  }, [request]);

  async function newCustomer(name, industry) {
    await appendData({ name, industry }, "customers");
    if (!errorStatus) {
      toggleShow();
    }
  }

  useEffect(() => {
    if (errorStatus) {
      console.error("Failed to add a new customer: ", errorStatus);
    } else if (customers.length > 0) {
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
      {customers.length > 0
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
