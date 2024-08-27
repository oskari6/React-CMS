import { useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Items from "../components/Items";

function AddOrder(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
    // console.log("selected items: ", selectedItems);
    // console.log("order: ", newOrderData);
    props.handleNew(newOrderData);
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
              <Items handleItemsSelection={handleItemsSelection} />
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
