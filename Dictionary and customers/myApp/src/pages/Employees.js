import "../index.css";
import Employee from "../components/Employee"; //component, and invoking with <Employee />
import { useState, useEffect, useCallback } from "react"; //using states
import { v4 as uuidv4 } from "uuid";
import AddEmployee from "../components/AddEmployee";
import useEmployees from "../hooks/useEmployees";

export default function Employees() {
  const [show, setShow] = useState(false); // true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);
  const [loading, setLoading] = useState(true);
  const [employeeList, setEmployeeList] = useState([]);

  const {
    request,
    appendData,
    data: { employees = [] } = {},
    errorStatus,
  } = useEmployees();

  useEffect(() => {
    if (employees.length === 0) {
      request().then(() => {
        setEmployeeList(employees); // Set the employee list once the data is fetched
      });
    } else {
      setEmployeeList(employees); // Use already loaded data if available
    }
  }, [request, employees]);

  async function handleNew(newEmployee) {
    newEmployee.uuid = uuidv4();
    const addedEmployee = await appendData(newEmployee);
    if (!errorStatus) {
      if (addedEmployee && addedEmployee.id) {
        setEmployeeList((prevList) => [...prevList, addedEmployee]);
        toggleShow();
      }
      toggleShow();
    }
  }

  if (employeeList.length === 0 && !loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="flex justify-center items-center mb-4">Employees</h1>
      {errorStatus ? (
        <div className="text-red-500">Error: {errorStatus}</div>
      ) : null}
      <div className="flex flex-wrap justify-center">
        {employeeList.length > 0
          ? employeeList.map((employee) => (
              <Employee
                key={employee.id}
                id={employee.id}
                name={employee.full_name}
                role={employee.role}
                img={employee.picture}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <AddEmployee handleNew={handleNew} show={show} toggleShow={toggleShow} />
    </div>
  );
}
