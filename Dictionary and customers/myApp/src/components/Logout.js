import { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { LoginContext } from "../App";

export default function Logout({ onClose }) {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const handleLogout = () => {
    setLoggedIn(false); // Log the user out
    localStorage.clear(); // Clear local storage
    onClose(); // Close the modal
  };
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to log out?</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-red-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </Modal.Footer>
    </Modal>
  );
}
