import "../index.css";
import Employee from "../components/Employee"; //component, and invoking with <Employee />
import { useState } from "react"; //using states
import { v4 as uuidv4 } from "uuid";
import AddEmployee from "../components/AddEmployee";
import EditEmployee from "../components/EditEmployee";
import Header from "../components/Header";

function Employees() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Employee1",
      role: "dev",
      img: "https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg",
    },
    {
      id: 2,
      name: "Employee2",
      role: "ceo",
      img: "https://e3.365dm.com/17/03/1600x900/f4ffaee815e1ab68cd8bc65e34a2ff3279492ae302b43175ae947040584cabd3_3920762.jpg?20170331215749",
    },
    {
      id: 3,
      name: "Employee3",
      role: "intern",
      img: "https://media.wired.com/photos/592662d3f3e2356fd800911b/master/pass/TwitterEgg_HP.jpg",
    },
    {
      id: 4,
      name: "Employee4",
      role: "dev",
      img: "https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg",
    },
    {
      id: 5,
      name: "Employee5",
      role: "cfo",
      img: "https://media.wired.com/photos/592662d3f3e2356fd800911b/master/pass/TwitterEgg_HP.jpg",
    },
    {
      id: 6,
      name: "Employee6",
      role: "janitor",
      img: "https://e3.365dm.com/17/03/1600x900/f4ffaee815e1ab68cd8bc65e34a2ff3279492ae302b43175ae947040584cabd3_3920762.jpg?20170331215749",
    },
  ]);

  function updateEmployee(id, newName, newRole) {
    console.log("update");
    const updatedEmployees = employees.map((employee) => {
      if (id == employee.id) {
        //spreading, gets all the attributes of the employee
        return { ...employee, name: newName, role: newRole };
      }
      return employee;
    });
    setEmployees(updatedEmployees);
  }

  function newEmployee(name, role, img) {
    const newEmployee = {
      id: uuidv4(),
      name: name,
      role: role,
      img: img,
    };
    setEmployees([...employees, newEmployee]);
  }

  const showEmployees = true;
  return (
    <div>
      {showEmployees ? (
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
                  //key={uuidv4()}//uuid import
                  key={employee.id}
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
        <p>You cannot see the employees</p>
      )}
    </div>
  );
}
//see the newEmployee function is not invoked, just the name
export default Employees;
