import "../index.css";
import Employee from "../components/Employee"; //component, and invoking with <Employee />
import { useState, useEffect, useCallback } from "react"; //using states
import { v4 as uuidv4 } from "uuid";
import AddEmployee from "../components/AddEmployee";
import useEmployees from "../hooks/useEmployees";

export default function Employees() {
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);
  const [loading, setLoading] = useState(true);

  const {
    request,
    appendData,
    data: { employees = [] } = {},
    errorStatus,
  } = useEmployees();

  useEffect(() => {
    request();
    setLoading(false);
  }, [request]);

  async function newEmployee(full_name, role, picture) {
    const id = uuidv4();
    await appendData({ id, full_name, role, picture });
    if (!errorStatus) {
      toggleShow();
    }
  }

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
                id={employee.id}
                name={employee.full_name}
                role={employee.role}
                img={employee.picture}
              />
            ))
          : null}
      </div>
      <AddEmployee
        newEmployee={newEmployee}
        show={show}
        toggleShow={toggleShow}
      />
    </div>
  );
}
