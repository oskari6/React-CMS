import React, { useState, useEffect } from "react";
import EditEmployee from "./EditEmployee";
import DeleteEmployee from "./DeleteEmployee";
import useEmployee from "../hooks/useEmployee";
import { baseURL } from "../Shared.js";

function Employee({ id, name, role, img, onUpdate, onDelete }) {
  const [employeeData, setEmployeeData] = useState({
    id,
    name,
    role,
    img: `${baseURL}${img}`, // Construct the image URL
  });

  const { updateEmployee, deleteEmployee } = useEmployee(id);

  useEffect(() => {
    setEmployeeData((prevData) => ({
      ...prevData,
      id,
      name,
      role,
      img: `${baseURL}${img}`,
    }));
  }, [id, name, role, img]);

  const handleUpdate = (updatedData) => {
    updateEmployee.mutate(updatedData, {
      onSuccess: (data) => {
        // Immediately update local state with the new data
        setEmployeeData((prevData) => ({
          ...prevData,
          ...data.employee,
          img: `${baseURL}${data.employee.picture}`, // Update image URL
        }));
        if (onUpdate) onUpdate(data); // Notify parent if needed
      },
    });
  };

  const handleDelete = () => {
    deleteEmployee.mutate(null, {
      onSuccess: () => {
        if (onDelete) onDelete(id); // Notify parent to remove the employee from the list
      },
    });
  };

  return (
    <div className="min-w-[350px] max-w-[350px] m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
      <img
        className="object-cover rounded-full h-[100px] w-[100px] block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
        src={img}
        alt="employee"
      />
      <div className="text-center space-y-2 sm:text-left">
        <div className="space-y-0.5">
          <p className="text-lg text-black font-semibold">{name}</p>
          <p className="text-slate-500 font-medium">{role}</p>
        </div>
        <DeleteEmployee deleteEmployee={handleDelete} />
        <EditEmployee
          id={id}
          name={name}
          role={role}
          updateEmployee={handleUpdate}
        />
      </div>
    </div>
  );
}

export default Employee;
