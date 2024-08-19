import "../index.css";
import Employee from "../components/Employee"; //component, and invoking with <Employee />
import { useState, useContext } from "react"; //using states
import { v4 as uuidv4 } from "uuid";
import AddEmployee from "../components/AddEmployee";
import EditEmployee from "../components/EditEmployee";
import { LoginContext } from "../App";

function Employees() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);

  function updateEmployee(id, newName, newRole, newImg) {
    //async db patch req
    //return employee;
  }

  function newEmployee(name, role, img) {
    const newEmployee = {
      id: uuidv4(),
      name: name,
      role: role,
      img: img,
    };
    //send to db
  }

  return (
    <div>
      {loggedIn ? (
        <>
          <div className="flex flex-wrap justify-center">
            {employees.map((employee) => {
              const editEmployee = (
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
      ) : (
        <p className="text-center text-lg font-bold pt-2">
          You cannot see the employees. Please log in.{" "}
        </p>
      )}
    </div>
  );
}
//see the newEmployee function is not invoked, just the name
export default Employees;
