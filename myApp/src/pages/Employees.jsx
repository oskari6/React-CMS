import "../index.css";
import { useState, useEffect } from "react";
import {
  AddEmployee,
  EmployeeModal,
} from "../components/modals/EmployeeModals";
import { Button } from "react-bootstrap";
import { useEmployees } from "../hooks/useEmployees";

export default function Employees() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const {
    data,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    error,
    status,
  } = useEmployees();

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="flex justify-center items-center mb-4">Employees</h1>
      {error ? <div className="text-red-500">Error: {error}</div> : null}
      <div className="flex flex-wrap justify-center">
        {employees.length > 0
          ? employees.map((employee) => (
              <EmployeeModal
                key={employee.id}
                employee={employee}
                onUpdate={updateEmployee}
                onDelete={deleteEmployee}
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
          handleNew={createEmployee}
          visible={visible}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
}
