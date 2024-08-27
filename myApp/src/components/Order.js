import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Items from "../components/Items";
import useOrder from "../hooks/useOrder";
import DeleteEmployee from "./DeleteEmployee";
import DeleteOrder from "./DeleteOrder";
import "../styles/style.css";

function Order({ order, onUpdate, onDelete }) {
  const { id } = useParams();
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [orderData, setOrderData] = useState({
    billing_address: order.billing_address,
    street: order.street,
    city: order.city,
    country: order.country,
    region_code: order.region_code,
    notes: order.notes,
    items: [],
    total: 0,
  });

  const { data, errorStatus, updateOrder, deleteOrder } = useOrder(
    id,
    order.id
  );

  useEffect(() => {
    if (data) {
      const items = data.order.order_items;
      const total = data.order.total_cost_in_cents;
      setOrderData((prevData) => ({
        ...prevData,
        items: items,
        total: total,
      }));
      setLoading(false); // Data has been loaded
    }
  }, [data]);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemsSelection = useCallback((selectedItems) => {
    setSelectedItems(selectedItems);
  }, []);

  const handleEditing = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleSaving = () => {
    updateOrder.mutate(orderData, {
      onSuccess: (data) => {
        setOrderData(data);
        setIsEditing(false);
        if (onUpdate) onUpdate(data); // Notify parent of update
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShow(false);
    setIsEditing(false); // Reset edit mode on close
  };

  const handleDelete = () => {
    deleteOrder.mutate(null, {
      onSuccess: () => {
        if (onDelete) onDelete(id); //parent state change
      },
    });
  };

  return (
    <>
      <button
        onClick={toggleShow}
        className="ml-10 no-underline bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        Order details
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Order #{order.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isEditing ? (
            <div className="space-y-4">
              <p>
                <strong>Billing Address:</strong> {orderData.billing_address}
              </p>
              <p>
                <strong>Street:</strong> {orderData.street}
              </p>
              <p>
                <strong>City:</strong> {orderData.city}
              </p>
              <p>
                <strong>Country:</strong> {orderData.country}
              </p>
              <p>
                <strong>Region Code:</strong> {orderData.region_code}
              </p>
              <p>
                <strong>Notes:</strong> {orderData.notes}
              </p>
              <ul>
                {orderData.length > 0
                  ? orderData.items.map((item, index) => (
                      <li key={index} className="mb-2">
                        {item.quantity} x {item.item_name} @{" "}
                        {(item.price_in_cents / 100).toFixed(2)} USD each
                        (Total: {(item.total_price_in_cents / 100).toFixed(2)}{" "}
                        USD)
                      </li>
                    ))
                  : null}
              </ul>
              <p>
                <strong>Total:</strong> {(orderData.total / 100).toFixed(2)} USD
              </p>
            </div>
          ) : (
            <form className="space-y-4">
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="billing_address"
                >
                  Billing Address
                </label>
                <input
                  className="w-full border border-gray-300 p-2 rounded"
                  id="billing_address"
                  name="billing_address"
                  type="text"
                  value={orderData.billing_address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="street"
                >
                  Street
                </label>
                <input
                  className="w-full border border-gray-300 p-2 rounded"
                  id="street"
                  name="street"
                  type="text"
                  value={orderData.street}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  className="w-full border border-gray-300 p-2 rounded"
                  id="city"
                  name="city"
                  type="text"
                  value={orderData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="country"
                >
                  Country
                </label>
                <input
                  className="w-full border border-gray-300 p-2 rounded"
                  id="country"
                  name="country"
                  type="text"
                  value={orderData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="region_code"
                >
                  Region Code
                </label>
                <input
                  className="w-full border border-gray-300 p-2 rounded"
                  id="region_code"
                  name="region_code"
                  type="text"
                  value={orderData.region_code}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="notes"
                >
                  Notes
                </label>
                <textarea
                  className="w-full border border-gray-300 p-2 rounded"
                  id="notes"
                  name="notes"
                  rows="4"
                  value={orderData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Items handleItemsSelection={handleItemsSelection} />
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <button
              onClick={handleSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          ) : (
            <div>
              <DeleteOrder deleteOrder={deleteOrder} />
              <button
                onClick={handleEditing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
            </div>
          )}
          <button
            onClick={handleClose}
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Order;
