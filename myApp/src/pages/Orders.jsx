import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useOrders } from "../hooks/useOrders";
import { AddOrder, OrderModal } from "../components/modals/OrderModals";

export default function Orders() {
  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const [orders, setOrders] = useState([]);

  const { data, createOrder, updateOrder, deleteOrder, error, status } =
    useOrders();

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

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

  if (status === "loading") {
    return <p>Loading orders data...</p>;
  }

  return (
    <div className="p-3">
      <h1 className="pb-5 text-gray-700 font-bold">Orders</h1>
      {error ? <div className="text-red-500">Error: {error}</div> : null}
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
                <OrderModal
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
          <AddOrder
            visible={visible}
            onClose={() => setVisible(!visible)}
            createOrder={createOrder.mutate}
          />
        </div>
      )}
    </div>
  );
}
