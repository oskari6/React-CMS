import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import NotFound from "../components/NotFound";
import useCustomer from "../hooks/useCustomer";

export default function Orders() {
  const { id } = useParams();
  const [orders, setOrders] = useState(null);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const { data, errorStatus, deleteOrder } = useOrders(id);

  useEffect(() => {
    if (data) {
      setOrders(data.customer);
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return <p>Loading orders data...</p>; // Show loading message until tempCustomer is set
  }

  return (
    <div className="p-3">
      {errorStatus ? (
        <div className="text-red-500">Error: {errorStatus}</div>
      ) : null}
      {!data ? (
        <>
          <NotFound />
          <div className="mt-5">Orders were not found</div>
        </>
      ) : (
        <div>
          <ul>
            {data.map((order) => (
              <li key={order.id} className="mb-2">
                <span>
                  {order.item_name} - {order.total_in_cents / 100} USD
                </span>
                {/* Add more order details here if needed */}
              </li>
            ))}
          </ul>
          <br />
          <Link to={`/customer/${id}`}>
            <button className="no-underline bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              ← Go back
            </button>
          </Link>
          <Link to={`/customer/${id}/orders/${orderId}`}>
            <button className="ml-2 no-underline bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
              Order Details
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
