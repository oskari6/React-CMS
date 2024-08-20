import "../index.css";
import Employee from "../components/Employee"; //component, and invoking with <Employee />
import { useState, useEffect, useCallback } from "react"; //using states
import { v4 as uuidv4 } from "uuid";
import AddEmployee from "../components/AddEmployee";
import useEmployees from "../hooks/useEmployees";

export default function Employees() {
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);

  const {
    request,
    appendData,
    data: { employees } = {},
    errorStatus,
    loading,
  } = useEmployees();

  useEffect(() => {
    request();
  }, [request]);

  const newEmployee = (name, role, img) => {
    const id = uuidv4();
    appendData({ id, name, role, img });
    toggleShow();
  };

  useEffect(() => {
    if (errorStatus) {
      console.error("Failed to add a new employee: ", errorStatus);
    } else if (employees) {
      toggleShow();
    }
  }, [employees, errorStatus, toggleShow]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {employees.map((employee) => (
          <Employee
            key={employee.id}
            id={employee.id}
            name={employee.name}
            role={employee.role}
            img={employee.img}
          />
        ))}
      </div>
      <AddEmployee
        newEmployee={newEmployee}
        show={show}
        toggleShow={toggleShow}
      />
    </div>
  );
}
