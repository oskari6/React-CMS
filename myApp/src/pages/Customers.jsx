import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddCustomer from "../components/modals/CustomerModals";
import { useCustomers } from "../hooks/useCustomers";

export default function Customers() {
  const [visible, setVisible] = useState(false);
  const [customers, setCustomers] = useState([]);

  const { data, createCustomer, error, status } = useCustomers();

  useEffect(() => {
    if (data) {
      setCustomers(data);
    }
  }, [data]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-[500px] mx-auto">
      <h1 className="flex justify-center items-center mb-4">Customers</h1>
      {error ? <div className="text-red-500">Error: {error}</div> : null}
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
        createCustomer={createCustomer.mutate}
        visible={visible}
        onClose={() => setVisible(!visible)}
      />
    </div>
  );
}
