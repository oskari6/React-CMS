import React, { useState, useEffect } from "react";
import EditEmployee from "./EditEmployee";
import DeleteEmployee from "./DeleteEmployee";
import useEmployee from "../hooks/useEmployee";
import { baseURL } from "../Shared.js";

function Employee({ employee, onUpdate, onDelete }) {
  const imageUrl = `${baseURL}${employee.img}`;
  const [employeeData, setEmployeeData] = useState({
    id: employee.id,
    name: employee.name,
    role: employee.role,
    img: employee.img,
  });

  const { updateEmployee, deleteEmployee } = useEmployee(employee.id);

  useEffect(() => {
    setEmployeeData((prevData) => ({
      ...prevData,
      id: employee.id,
      name: employee.name,
      role: employee.role,
      img: employee.img,
    }));
  }, [employee.id, employee.name, employee.role, employee.img]);

  const handleUpdate = (updatedData) => {
    updateEmployee.mutate(updatedData, {
      onSuccess: (data) => {
        setEmployeeData((prevData) => ({
          ...prevData,
          ...data,
          img: data.img,
        }));
        if (onUpdate) onUpdate(data); //parent state change
      },
    });
  };

  const handleDelete = () => {
    deleteEmployee.mutate(null, {
      onSuccess: () => {
        if (onDelete) onDelete(employee.id); //parent state change
      },
    });
  };

  return (
    <div className="min-w-[350px] max-w-[350px] m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
      <img
        className="object-cover rounded-full h-[100px] w-[100px] block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
        src={imageUrl}
        alt="employee"
      />
      <div className="text-center space-y-2 sm:text-left">
        <div className="space-y-0.5">
          <p className="text-lg text-black font-semibold">{employee.name}</p>
          <p className="text-slate-500 font-medium">{employee.role}</p>
        </div>
        <DeleteEmployee deleteEmployee={handleDelete} />
        <EditEmployee
          id={employee.id}
          name={employee.name}
          role={employee.role}
          updateEmployee={handleUpdate}
        />
      </div>
    </div>
  );
}

export default Employee;
