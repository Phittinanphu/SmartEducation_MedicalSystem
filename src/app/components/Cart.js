// src/components/Cart.js
import React from "react";

const Cart = ({ items }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#fff",
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "250px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Shopping Cart</h3>
      <p>Total Items: {items.length}</p>
      {items.length > 0 && (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              {item.name} - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;