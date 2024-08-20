import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import NotFound from "../components/NotFound";
import { baseURL } from "../Shared";
import { LoginContext } from "../App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";

export default function Customer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tempCustomer, setTempCustomer] = useState(null);
  const [changed, setChanged] = useState(false);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const queryClient = useQueryClient();

  const handleInputChange = debounce((field, value) => {
    setTempCustomer((prev) => ({ ...prev, [field]: value }));
    setChanged(true);
  }, 300);

  const {
    data: customer,
    isError,
    error,
  } = useQuery(
    ["customer", id],
    () =>
      fetch(`${baseURL}/api/customers/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (res.status === 401) throw new Error("Not found");
        if (res.status === 401) {
          setLoggedIn(false);
          navigate("/login", { state: { previousUrl: location.pathname } });
        }
        return res.json();
      }),
    {
      onSuccess: (data) => setTempCustomer(data.customer),
    }
  );

  const updateCustomerMutation = useMutation(
    (updatedCustomer) =>
      fetch(`${baseURL}/api/customers/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(updatedCustomer),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update customer");
        }
        return res.json();
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer", id]);
        setChanged(false);
      },
      onError: (error) => {
        console.error("Error updating customer: ", error);
      },
    }
  );

  const deleteCustomerMutation = useMutation(
    () =>
      fetch(`${baseURL}/api/customers/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (res.status === 401) {
          setLoggedIn(false);
          navigate("/login", { state: { previousUrl: location.pathname } });
        }
        if (!res.ok) throw new Error("Something went wrong");
        return res.json();
      }),
    {
      onSuccess: () => navigate("/customers/"),
    }
  );

  if (isError) return <p>{error.message}</p>;

  return (
    <div className="p-3">
      {!customer ? (
        <>
          <NotFound />
          <p>The customer with the id {id} was not found</p>
        </>
      ) : (
        <div>
          <form
            className="w-full max-w-sm"
            id="customer"
            onSubmit={(e) => {
              e.preventDefault();
              updateCustomerMutation.mutate(tempCustomer);
            }}
          >
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/4">
                <label for="name">Name</label>
              </div>
              <div className="md:w-3/4">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="name"
                  type="text"
                  value={tempCustomer.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/4">
                <label for="industry">Industry</label>
              </div>
              <div className="md:w-3/4">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  type="text"
                  value={tempCustomer.industry}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                />
              </div>
            </div>
          </form>
          {changed && (
            <div className="mb-2">
              <button
                className="bg-slate-400 hover:bg-purple-700 text-white font-bold py-2 px-4 mr-2 rounded"
                onClick={() => {
                  setTempCustomer({ ...customer });
                  setChanged(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                form="customer"
              >
                Save
              </button>
            </div>
          )}

          <div>
            <button
              className="bg-slate-800 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => deleteCustomerMutation.mutate()}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {error && <p>{error}</p>}
      <br />
      <Link to="/customers/">
        <button className="no-underline bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          ← Go back
        </button>
      </Link>
    </div>
  );
}
