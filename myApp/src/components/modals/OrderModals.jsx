import Modal from "react-bootstrap/Modal";
import ItemSelection from "../resources/ItemSelection";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";

export function OrderModal({ order }) {
  const { id } = useParams();
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
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

  const { data, updateOrder, deleteOrder, error, status } = useOrders();

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

  const handleItemsSelection = useCallback((selectedItems) => {
    setSelectedItems(selectedItems);
  }, []);

  const handleSaving = () => {
    updateOrder(id, orderData);
    setOrderData(data);
    setIsEditing(false);
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
                <ItemSelection handleItemsSelection={handleItemsSelection} />
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
                onClick={() => setIsEditing(!isEditing)}
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

export function AddOrder({ visible, onClose, createOrder }) {
  const [error, setError] = useState("");

  //form fields
  const [information, setInformation] = useState({
    billing_address: "",
    street: "",
    city: "",
    country: "",
    region_code: "",
    notes: "",
  });

  const [selectedItems, setSelectedItems] = useState([]);

  //form filling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInformation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //item selection
  const handleItemsSelection = useCallback((selectedItems) => {
    setSelectedItems(selectedItems);
  }, []);

  //form validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !information.billing_address ||
      !information.street ||
      !information.city ||
      !information.country ||
      !information.region_code ||
      !information.notes ||
      selectedItems.length === 0
    ) {
      setError("You must fill every field and select at least one item.");
      return;
    }
    setError("");

    const newOrderData = {
      ...information,
      items: selectedItems,
    };
    createOrder(newOrderData);
  };

  return (
    <>
      <button
        onClick={onClose}
        className="no-underline bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        New Order
      </button>

      <Modal show={visible} onHide={onClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Creating an order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit}
            id="newOrderForm"
            className="w-full max-w-sm"
          >
            <div className="md:flex md:items-center mb-6">
              {error}
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="billing_address"
                >
                  Billing Address
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="billing_address"
                  name="billing_address"
                  type="text"
                  value={information.billing_address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="street"
                >
                  Street
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="street"
                  name="street"
                  type="text"
                  value={information.street}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="city"
                >
                  City
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="city"
                  name="city"
                  type="text"
                  value={information.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="country"
                >
                  Country
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="country"
                  name="country"
                  type="text"
                  value={information.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="region_code"
                >
                  Region code
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="region_code"
                  name="region_code"
                  type="text"
                  value={information.region_code}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="ml-20">
              <p className="flex justify-center text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 ml-20">
                Items
              </p>
              <ItemSelection handleItemsSelection={handleItemsSelection} />
            </div>
            <div className="md:flex justify-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="notes"
                >
                  Notes
                </label>
              </div>
              <div className="md:w-2/3">
                <textarea
                  className=" resize-none bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="notes"
                  name="notes"
                  rows="4" // Adjust the number of rows for desired height
                  value={information.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-center ml-20">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Order
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function DeleteOrder({ deleteOrder }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    deleteOrder();
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleShow}
        className=" mr-2 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
      >
        Delete
      </button>
      <Modal show={show} onHide={handleClose} dialogClassName="centered-modal">
        <Modal.Header closeButton>
          <Modal.Title>Delete order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this order?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
