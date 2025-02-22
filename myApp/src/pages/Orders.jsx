import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import useOrders from "../hooks/useOrders";
import AddOrder from "../components/AddOrder";
import Order from "../components/Order";

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

  const handleUpdate = (updatedData) => {
    const updatedOrder = updatedData;
    setOrders((prevList) =>
      prevList.map((order) =>
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      )
    );
  };

  const handleDelete = (id) => {
    setOrders((prevList) => prevList.filter((order) => order.id !== id));
  };

  if (loading) {
    return <p>Loading orders data...</p>;
  }

  return (
    <div className="p-3">
      <h1 className="pb-5 text-gray-700 font-bold">Orders</h1>
      {errorStatus ? (
        <div className="text-red-500">Error: {errorStatus}</div>
      ) : null}
      {orders.length > 0 ? (
        <div>
          <ul>
            {orders.map((order) => (
              <li
                key={order.id}
                className="mb-5 pb-5 border-b border-black-300 text-gray-500 font-bold"
              >
                <span>
                  {order.created_time.split("T")[0]}{" "}
                  <span className="ml-5">Order #{order.id}</span>
                </span>
                <Order
                  key={order.id}
                  order={order}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
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
