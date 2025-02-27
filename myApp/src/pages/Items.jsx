import { useState, useEffect } from "react";
import { useItems } from "../hooks/useItems";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Items() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { data, createItem, error, status } = useItems();

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  return (
    <div>
      <div className="container mt-4">
        {items.length > 0 ? (
          <Table striped bordered hover responsive className="text-center">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Number</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity in Stock</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.item_number}>
                  <td>{index + 1}</td>
                  <td>{item.item_number}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.category}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity_in_stock}</td>
                  <td>
                    {item.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <span>No items</span>
        )}
      </div>
      <Button onClick={() => navigate("/create-item", createItem)}>
        Create Item
      </Button>
    </div>
  );
}
