import React, { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import AddCustomer from "../components/AddCustomer";
import useCustomers from "../hooks/useCustomers";

export default function Customers() {
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  const { request, appendData, errorStatus } = useCustomers();

  useEffect(() => {
    request()
      .then((customers) => {
        if (customers && customers.length > 0) {
          setCustomers(customers);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [request]);

  async function newCustomer(name, industry) {
    setLoading(true);
    const addedCustomer = await appendData({ name, industry }, "customers");
    if (!errorStatus) {
      toggleShow();
      setCustomers((prevList) => [...prevList, addedCustomer]);
      setLoading(false);
    }
  }

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
