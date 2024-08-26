import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import NotFound from "../components/NotFound";
import useOrders from "../hooks/useOrders";
import AddOrder from "../components/AddOrder";

export default function Orders() {
  const { id } = useParams();
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const { request, appendData, errorStatus } = useOrders(id);

  useEffect(() => {
    request()
      .then((orders) => {
        if (orders && orders.length > 0) {
          setOrders(orders); // Set the employee list with the returned data
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [request]);

  async function handleNew(newOrder) {
    try {
      const addedOrder = await appendData(newOrder);

      if (addedOrder && addedOrder.id) {
        setOrders((prevList) => [...prevList, addedOrder]);
        toggleShow();
      }
    } catch (error) {
      console.error("Failed to add new order:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading orders data...</p>;
  }

  return (
    <div className="p-3">
      {errorStatus ? (
        <div className="text-red-500">Error: {errorStatus}</div>
      ) : null}
      {orders.length > 0 ? (
        <div>
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="mb-2">
                <span>
                  {order.item_name} - {order.total_in_cents / 100} USD
                </span>
                <Link to={`/customer/${id}/orders/${order.id}`}>
                  <button className="ml-2 no-underline bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                    Order Details
                  </button>
                </Link>
              </li>
            ))}
          </ul>
          <br />
          <Link to={`/customer/${id}`}>
            <button className="no-underline bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              ← Go back
            </button>
          </Link>
        </div>
      ) : (
        <div>
          <p>No orders were found for this customer</p>
          <AddOrder handleNew={handleNew} />
        </div>
      )}
    </div>
  );
}
