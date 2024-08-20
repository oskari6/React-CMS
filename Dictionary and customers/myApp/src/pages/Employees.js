import "../index.css";
import Employee from "../components/Employee"; //component, and invoking with <Employee />
import { useState, useEffect, useCallback } from "react"; //using states
import { v4 as uuidv4 } from "uuid";
import AddEmployee from "../components/AddEmployee";
import EditEmployee from "../components/EditEmployee";
import useFetch from "../hooks/UseFetch";
import { baseURL } from "../Shared";

export default function Employees() {
  const [show, setShow] = useState(false); //true to put it open on refresh
  const toggleShow = useCallback(() => setShow((prevShow) => !prevShow), []);
  const url = baseURL + "/api/employees/";
  const {
    request,
    appendData,
    data: { employees } = {},
    errorStatus,
    loading,
  } = useFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
  });

  useEffect(() => {
    request();
  }, [request]);

  function newEmployee(name, role, img) {
    const id = uuidv4();
    appendData({ id, full_name: name, role: role, picture: img }, "employees");
    if (!errorStatus) {
      toggleShow();
    }
  }

  useEffect(() => {
    if (errorStatus) {
      console.error("Failed to add a new customer: ", errorStatus);
    } else if (employees) {
      toggleShow();
    }
  }, [employees, errorStatus, toggleShow]);

  if (loading) {
    return <div>Loading...</div>;
  }

  function updateEmployee(id, newName, newRole, newImg) {
    //async db patch req
    //return employee;
  }

  return (
    <div>
      <>
        <div className="flex flex-wrap justify-center">
          {employees.map((employee) => {
            const editEmployee = (
              //modal
              <EditEmployee
                id={employee.id}
                name={employee.name}
                role={employee.role}
                updateEmployee={updateEmployee}
              />
            );
            return (
              <Employee
                id={employee.id}
                name={employee.name}
                role={employee.role}
                img={employee.img}
                editEmployee={editEmployee}
              />
            );
          })}
        </div>
        <AddEmployee newEmployee={newEmployee} />
      </>
    </div>
  );
}
