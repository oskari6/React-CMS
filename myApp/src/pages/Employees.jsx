import "../index.css";
import Employee from "../components/Employee"; //component, and invoking with <Employee />
import { useState, useEffect } from "react"; //using states
import AddEmployee from "../components/AddEmployee";
import useEmployees from "../hooks/useEmployees";
import { Button } from "react-bootstrap";

export default function Employees() {
  const [visible, setVisible] = useState(false); // true to put it open on refresh
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const { request, appendData, errorStatus } = useEmployees();

  useEffect(() => {
    request()
      .then((employees) => {
        if (employees && employees.length > 0) {
          setEmployees(employees); // Set the employee list with the returned data
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("error fetching employees: ", error);
        setLoading(false);
      });
  }, [request]);

  async function handleNew(newEmployee) {
    setLoading(true);

    try {
      const addedEmployee = await appendData(newEmployee);

      if (addedEmployee && addedEmployee.id) {
        setEmployees((prevList) => [...prevList, addedEmployee]);
      }
    } catch (error) {
      console.error("Failed to add new employee:", error);
    } finally {
      setLoading(false);
      setVisible(false);
    }
  }

  const handleUpdate = (updatedData) => {
    const updatedEmployee = updatedData;
    setEmployees((prevList) =>
      prevList.map((employee) =>
        employee.id === updatedEmployee.id
          ? { ...employee, ...updatedEmployee }
          : employee
      )
    );
  };

  const handleDelete = (id) => {
    setEmployees((prevList) =>
      prevList.filter((employee) => employee.id !== id)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="flex justify-center items-center mb-4">Employees</h1>
      {errorStatus ? (
        <div className="text-red-500">Error: {errorStatus}</div>
      ) : null}
      <div className="flex flex-wrap justify-center">
        {employees.length > 0
          ? employees.map((employee) => (
              <Employee
                key={employee.id}
                employee={employee}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <div className="flex">
        <Button
          onClick={() => setVisible(!visible)}
          className="block mx-auto m-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + Add Employee
        </Button>
      </div>
      {visible && (
        <AddEmployee
          handleNew={handleNew}
          visible={visible}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
}
