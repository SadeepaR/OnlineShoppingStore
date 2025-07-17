import React, { useState } from 'react';
import CheckoutHeader from '../components/checkoutheader';
import CheckoutPage from '../components/checkoutcontent';

export default function checkout() {
    const cartData = [
  { name: 'Bluetooth Speaker', price: 1999, quantity: 1 },
  { name: 'Gaming Mouse', price: 999, quantity: 2 },
];
  return (
    <>
      <CheckoutHeader />
      <CheckoutPage cartItems={cartData} />
    </>
   
  );
}
