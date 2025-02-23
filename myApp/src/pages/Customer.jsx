import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import NotFound from "../components/NotFound";
import { useCustomer, useCustomers } from "../hooks/useCustomers";

export default function Customer() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [changed, setChanged] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data, error, status } = useCustomer(id);
  const { updateCustomer, deleteCustomer } = useCustomers();

  useEffect(() => {
    if (data) {
      setCustomer(data);
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setCustomer((prev) => {
      const updatedCustomer = { ...prev, [field]: value };
      const hasChanged =
        JSON.stringify(updatedCustomer) !== JSON.stringify(data.customer);
      setChanged(hasChanged);
      return updatedCustomer;
    });
    setSaved(false);
  };

  if (status === "loading") {
    return <p>Loading customer data...</p>;
  }

  return (
    <div className="p-3">
      {error ? <div className="text-red-500">Error: {error}</div> : null}
      {!customer ? (
        <>
          <NotFound />
          <p>The customer with the id {id} was not found</p>
        </>
      ) : (
        <div>
          <div className="h-[50px]">
            <h2 className="font-semibold">Customer: {customer.name}</h2>
          </div>
          <form
            className="w-full max-w-sm"
            id="customer"
            onSubmit={updateCustomer.mutate}
          >
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/4">
                <label htmlFor="name">Name</label>
              </div>
              <div className="md:w-3/4">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="name"
                  type="text"
                  value={customer?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/4">
                <label htmlFor="industry">Industry</label>
              </div>
              <div className="md:w-3/4">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  type="text"
                  value={customer?.industry || ""}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                />
              </div>
            </div>
          </form>
          {!saved && changed && (
            <div className="mb-2">
              <button
                className="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 mr-2 rounded"
                onClick={() => {
                  setCustomer(data.customer);
                  setChanged(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                form="customer"
              >
                Save
              </button>
            </div>
          )}
          <div>
            <button
              className="bg-slate-800 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
              onClick={deleteCustomer}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <br />
      <Link to="/customers/">
        <button className="no-underline bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          ← Go back
        </button>
      </Link>
      <Link to={`/customers/${id}/orders/`}>
        <button className=" ml-2 no-underline bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Orders
        </button>
      </Link>
    </div>
  );
}
