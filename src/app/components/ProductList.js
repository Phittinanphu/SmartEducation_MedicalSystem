// src/components/ProductList.js
import React from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Product A",
    price: 29.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Product B",
    price: 39.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Product C",
    price: 19.99,
    image: "https://via.placeholder.com/150",
  },
];

const ProductList = ({ onAddToCart }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        marginTop: "20px",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductList;