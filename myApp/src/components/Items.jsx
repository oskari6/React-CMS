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

  const handleQuantityChange = (itemId, quantity) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      )
    );
  };

  useEffect(() => {
    const selectedItemsWithQuantity = selected.map((id) => {
      const item = items.find((item) => item.id === id);
      return { item_id: item.id, quantity: item.quantity || 1 }; // Default quantity to 1 if not set
    });
    handleItemsSelection(selectedItemsWithQuantity); // Pass selected items with quantity to the parent component
  }, [selected, items, handleItemsSelection]);

  const calculateTotalCost = () => {
    return selected.reduce((total, id) => {
      const item = items.find((item) => item.id === id);
      const quantity = item.quantity || 1;
      return total + item.price_in_cents * quantity;
    }, 0);
  };

  if (loading) {
    return <p>Loading items...</p>;
  }
  return (
    <div className="p-3 flex flex-col items-center">
      {errorStatus ? (
        <div className="text-red-500">Error: {errorStatus}</div>
      ) : null}
      {items.length > 0 ? (
        <>
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
                {selected.includes(item.id) && (
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="bg-gray-200 px-2 py-1 rounded-l"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          Math.max(1, (item.quantity || 1) - 1)
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      readOnly
                      className="w-12 text-center border-t border-b"
                    />
                    <button
                      type="button"
                      className="bg-gray-200 px-2 py-1 rounded-r"
                      onClick={() =>
                        handleQuantityChange(item.id, (item.quantity || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 text-lg font-bold text-gray-700">
            Total: ${(calculateTotalCost() / 100).toFixed(2)} USD
          </div>
        </>
      ) : (
        <p>No items available.</p>
      )}
    </div>
  );
}
