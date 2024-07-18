import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const AddToCartButton = ({ service }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const addToCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = storedCart.find(item => item.service._id === service._id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      storedCart.push({ service, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(storedCart));
    setShowConfirmModal(true); // Mostrar el modal de confirmación
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <Button variant="primary" onClick={addToCart}>
        Agregar al carrito
      </Button>

      <Modal show={showConfirmModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Added to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{service.name} has been added to your cart.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddToCartButton;
