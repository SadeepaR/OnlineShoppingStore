import React from 'react';
import ProductCard from './productcard';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function ProductGrid({ refreshCart, searchTerm }) { // Add searchTerm prop
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // New state for filtered products

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Effect to filter products whenever products or searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products); // If no search term, show all products
    }
  }, [searchTerm, products]);

  const fetchProducts = () => {
    axios.get('http://localhost:8080/api/products')
      .then((res) => {
        setProducts(res.data);
        // Initially, filtered products are all products
        setFilteredProducts(res.data);
      })
      .catch((err) => console.error('Error fetching products:', err));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-4">
      {filteredProducts.map((product) => ( // Render filteredProducts
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.pricePerUnit}
          imageUrl={product.imageUrl}
          refreshCart={refreshCart}
        />
      ))}
    </div>
  );
}