import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "../styles/style.css";

function DeleteOrder({ deleteOrder }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    deleteOrder();
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleShow}
        className=" mr-2 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
      >
        Delete
      </button>
      <Modal show={show} onHide={handleClose} dialogClassName="centered-modal">
        <Modal.Header closeButton>
          <Modal.Title>Delete order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this order?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteOrder;
