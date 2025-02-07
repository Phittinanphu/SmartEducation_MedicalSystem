// src/components/ProductCard.js
import React from "react";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px",
        width: "200px",
        textAlign: "center",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", height: "auto", borderRadius: "4px" }}
      />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;