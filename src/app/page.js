// pages/index.js
// pages/index.js (or app/page.js if you're using the App Router)
"use client";

import React, { useState } from "react";
import ProductList from "./components/ProductList.js";
import Cart from "./components/Cart.js";

export default function Home() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header>
        <h1>Simple Shopping Template</h1>
      </header>
      <Cart items={cartItems} />
      <ProductList onAddToCart={handleAddToCart} />
    </div>
  );
}



