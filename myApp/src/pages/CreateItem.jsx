import { useState } from "react";
import { useItems } from "../hooks/useItems";
import { Button } from "react-bootstrap";

export default function CreateItem() {
  const [visible, setVisible] = useState(false);

  const categories = [
    "finance",
    "insurance",
    "lifestock",
    "athletics",
    "automotive",
  ];
  const [information, setInformation] = useState({
    item_number: 0,
    name: "",
    description: "",
    category: categories[0],
    price: 0,
    quantity_in_stock: 0,
    is_active: false,
  });

  const { createItem, error, status } = useItems();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createItem.mutate(information);
    alert(`success: ${result}`);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInformation((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  if (error) {
    return <div>error: {error.message}</div>;
  }
  if (status === "loading") {
    return <div>loading</div>;
  }
  return (
    <div className="p-2">
      <form id="create-item" className="space-y-4" onSubmit={handleSubmit}>
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
            type="number"
            value={information.item_number}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
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
          <select
            className="w-full border border-gray-300 p-2 rounded"
            id="category"
            name="category"
            value={information.category}
            onChange={handleInputChange}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
            price
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded"
            id="price"
            name="price"
            type="number"
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
          <input
            className="w-full border border-gray-300 p-2 rounded"
            id="quantity_in_stock"
            name="quantity_in_stock"
            type="number"
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
          <input
            className="w-full border border-gray-300 p-2 rounded"
            id="is_active"
            name="is_active"
            type="checkbox"
            rows="4"
            checked={information.is_active}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit">Create Item</Button>
      </form>
    </div>
  );
}
