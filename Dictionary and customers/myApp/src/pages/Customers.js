//sample
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../Shared";
import AddCustomer from "../components/AddCustomer";
import useFetch from "../hooks/UseFetch";

export default function Customers() {
  const [show, setShow] = useState(false); //true to put it open on refresh

  const toggleShow = () => setShow(!show);

  const url = baseUrl + "/api/customers/";
  const {
    request,
    appendData,
    data: { customers } = {},
    errorStatus,
  } = useFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
  });

  useEffect(() => {
    request();
  });

  function newCustomer(name, industry) {
    appendData({ name: name, industry: industry });

    if (!errorStatus) {
      toggleShow();
    }
  }

  return (
    <div className="max-w-[500px] mx-auto">
      <h1 className="flex justify-center items-center mb-4">
        Here are the customers:
      </h1>
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
