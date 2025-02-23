import { useState, useEffect } from "react";
import { useItems } from "../hooks/useItems";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import ModalTitle from "react-bootstrap/esm/ModalTitle";
import ModalBody from "react-bootstrap/esm/ModalBody";
import { Button } from "react-bootstrap";

export default function Items() {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);

  const { data, createItem, error, status } = useItems();

  const handleNew = () => {
    console.log("temp");
  };
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  return (
    <div>
      <ul>
        {items ? (
          items.map((item) => (
            <li>
              <span>{item.name}</span>
            </li>
          ))
        ) : (
          <span>No items</span>
        )}
      </ul>
      <CreateItem visible={visible} onClose={() => setVisible(!visible)} />
    </div>
  );
}

export function CreateItem({ visible, onClose }) {
  const categories = [
    "finance",
    "insurance",
    "lifestock",
    "athletics",
    "automotive",
  ];
  const [information, setInformation] = useState({
    item_number: null,
    name: "",
    description: "",
    category: categories[0],
    price: 0,
    quantity_in_stock: 0,
    is_active: false,
    created_at: "",
    updated_at: "",
  });

  const { createItem, error, status } = useItems();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInformation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Button onClick={() => onClose()}>Create Item</Button>
      <Modal show={visible} onHide={onClose} backdrop="static" keyboard={false}>
        <ModalHeader closeButton>
          <ModalTitle>Create Item</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form className="space-y-4">
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="item_number"
              >
                item_number
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                id="item_number"
                name="item_number"
                type="text"
                value={information.item_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="name"
              >
                name
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                id="name"
                name="name"
                type="text"
                value={information.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="description"
              >
                description
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                id="description"
                name="description"
                type="text"
                value={information.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="category"
              >
                category
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                id="category"
                name="category"
                type="text"
                value={information.category}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="price"
              >
                price
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                id="price"
                name="price"
                type="text"
                value={information.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="quantity_in_stock"
              >
                quantity_in_stock
              </label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded"
                id="quantity_in_stock"
                name="quantity_in_stock"
                rows="4"
                value={information.quantity_in_stock}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="is_active"
              >
                is_active
              </label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded"
                id="is_active"
                name="is_active"
                rows="4"
                value={information.is_active}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="created_at"
              >
                created_at
              </label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded"
                id="created_at"
                name="created_at"
                rows="4"
                value={information.created_at}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="updated_at"
              >
                updated_at
              </label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded"
                id="updated_at"
                name="updated_at"
                rows="4"
                value={information.updated_at}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
