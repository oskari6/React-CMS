import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Items from "../components/Items";

function AddOrder({ newOrder }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [information, setInformation] = useState({
    billing_address: "",
    street: "",
    city: "",
    country: "",
    region_code: "",
    notes: "",
  });

  const [selectedItems, setSelectedItems] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInformation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleItemsSelection = (selectedItems) => {
    setSelectedItems(selectedItems); // Update selected items state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you will handle the form submission, including selected items
    const newOrderData = {
      ...information,
      items: selectedItems, // Include the selected items in the order data
    };
    newOrder(newOrderData);
  };

  return (
    <>
      <button
        onClick={handleShow}
        className="no-underline bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        New Order
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Creating an order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form for adding an order */}
          <form
            onSubmit={handleSubmit}
            id="newOrderForm"
            className="w-full max-w-sm"
          >
            <div className="md:flex md:items-center mb-6">
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
                  htmlFor="regionCode"
                >
                  Region code
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="regionCode"
                  name="regionCode"
                  type="text"
                  value={information.region_code}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <p className="flex text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Items
              </p>
              <Items handleItemsSelection={handleItemsSelection} />
            </div>
            <div className="md:flex md:items-center mb-6">
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
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="notes"
                  name="notes"
                  rows="4" // Adjust the number of rows for desired height
                  value={information.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit Order
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            onClick={handleClose}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddOrder;
