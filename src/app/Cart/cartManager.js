'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { handleIncrement, handleDecrement } from '../utils/eventHandlers';
import { handleCheckout } from './checkoutHandler';

const CartManager = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedTimestamp = localStorage.getItem('cartTimestamp');

    if (storedCart && storedTimestamp) {
      const currentTime = new Date().getTime();
      const storedTime = parseInt(storedTimestamp);

      if (currentTime - storedTime < 3600000) {
        const parsedCart = JSON.parse(storedCart);
        const validItems = parsedCart.filter(item => item.id);
        setCartItems(validItems);
        if (validItems.length !== parsedCart.length) {
          updateLocalStorage(validItems);
        }
      } else {
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTimestamp');
      }
    }
  }, []);

  const updateLocalStorage = (updatedItems) => {
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    localStorage.setItem('cartTimestamp', new Date().getTime().toString());
  };

  const handleCartIncrement = (index) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = {
        ...newItems[index],
        quantity: handleIncrement(newItems[index].quantity)
      };
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const handleCartDecrement = (index) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems];
      const newQuantity = handleDecrement(newItems[index].quantity);
      if (newQuantity === 0) {
        newItems.splice(index, 1);
      } else {
        newItems[index] = {
          ...newItems[index],
          quantity: newQuantity
        };
      }
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const removeCartItem = (index) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter((_, i) => i !== index);
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartTimestamp');
  };

  const onCheckout = async () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    // 총 금액 계산
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    
    console.log('체크아웃 시도:', { cartItems, totalAmount });

    const result = await handleCheckout(cartItems, totalAmount);
    
    if (result.success) {
      alert(result.message);
      clearCart();  // 장바구니 비우기
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6 pb-2 border-b">장바구니</h1>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center border-b py-4">
              <Image src={item.img} alt={item.name} width={100} height={100} className="w-24 h-24 object-cover rounded mr-0 sm:mr-4 mb-4 sm:mb-0" />
              <div className="flex-grow flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                <h2 className="text-lg font-bold mb-2 sm:mb-0">{item.name}</h2>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                  <div className="flex items-center mr-4">
                    <button onClick={() => handleCartDecrement(index)} className="bg-gray-200 px-2 py-1 rounded-l">-</button>
                    <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                    <button onClick={() => handleCartIncrement(index)} className="bg-gray-200 px-2 py-1 rounded-r">+</button>
                  </div>
                  <p className="font-bold mr-4">가격: ${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeCartItem(index)} className="bg-red-500 text-white px-3 py-1 rounded whitespace-nowrap">삭제</button>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold mb-4">총 가격: ${calculateTotal()}</p>
            <button onClick={onCheckout} className="bg-green-500 text-white px-6 py-2 rounded">체크아웃</button>
          </div>
        </>
      ) : (
        <p className="text-center italic">장바구니가 비어 있습니다</p>
      )}
    </div>
  );
};

export default CartManager;