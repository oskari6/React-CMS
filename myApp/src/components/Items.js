import useItems from "../hooks/useItems";
import Link, { useEffect, useState } from "react";

export default function Items({ handleItemsSelection }) {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [items, setItems] = useState([]);

  const { request, errorStatus } = useItems();

  useEffect(() => {
    request()
      .then((items) => {
        if (items && items.length > 0) {
          setItems(items); // Set the employee list with the returned data
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [request]);

  const handleCheckboxChange = (itemId) => {
    setSelected(
      (prevSelected) =>
        prevSelected.includes(itemId)
          ? prevSelected.filter((id) => id !== itemId) // Unselect if already selected
          : [...prevSelected, itemId] // Select if not already selected
    );
  };

  useEffect(() => {
    handleItemsSelection(selected); // Pass selected items to the parent component
  }, [selected, handleItemsSelection]);

  if (loading) {
    return <p>Loading items...</p>;
  }
  return (
    <div className="p-3 flex justify-center">
      {errorStatus ? (
        <div className="text-red-500">Error: {errorStatus}</div>
      ) : null}
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="mb-2 text-gray-500 font-bold ">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 form-checkbox h-5 w-5 text-gray-600"
                  checked={selected.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <span>
                  Item {item.item_number}. {item.item_name} -
                  {item.price_in_cents / 100} USD
                </span>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items available.</p>
      )}
    </div>
  );
}
