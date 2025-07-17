import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import ProductGrid from '../components/productgrid';

function generateRandomId() {
  return 'user-' + Math.random().toString(36).substr(2, 9);
}

export default function Shopping() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const SESSION_KEY = 'userSession';

  // Initialize user session ID on mount
  useEffect(() => {
    const now = Date.now();
    const storedData = sessionStorage.getItem(SESSION_KEY);

    if (storedData) {
      try {
        const { id, timestamp } = JSON.parse(storedData);
        if (now - timestamp > 24 * 60 * 60 * 1000) {
          const newId = generateRandomId();
          sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({ id: newId, timestamp: now })
          );
        }
      } catch {
        const newId = generateRandomId();
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ id: newId, timestamp: now })
        );
      }
    } else {
      const newId = generateRandomId();
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ id: newId, timestamp: now })
      );
    }
  }, []);

  const userId = JSON.parse(sessionStorage.getItem(SESSION_KEY))?.id;

  // Function to fetch cart items and update state
  const refreshCart = () => {
    if (!userId) return;
    fetch(`http://localhost:8080/api/cart/${userId}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error('Error fetching cart:', err));
  };

  // Fetch cart items once on mount or when userId changes
  useEffect(() => {
    refreshCart();
  }, [userId]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <Header cartItems={cartItems} refreshCart={refreshCart} onSearch={handleSearch} />
      <ProductGrid refreshCart={refreshCart} searchTerm={searchTerm} /> {/* Pass searchTerm down */}
    </>
  );
}