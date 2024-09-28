'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../components/components.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    // 로컬 스토리지에서 장바구니 정보 불러오기
    loadCartItems();

    // URL 파라미터에서 새 아이템 정보 가져오기
    const name = searchParams.get('name');
    const price = searchParams.get('price');
    const img = searchParams.get('img');
    const qty = searchParams.get('qty');

    if (name && price && img && qty) {
      const newItem = { name, price, img, quantity: parseInt(qty) };
      addToCart(newItem);
    }
  }, [searchParams]);

  const loadCartItems = () => {
    const storedCart = localStorage.getItem('cart');
    const storedTimestamp = localStorage.getItem('cartTimestamp');

    if (storedCart && storedTimestamp) {
      const currentTime = new Date().getTime();
      const storedTime = parseInt(storedTimestamp);

      // 1시간(3600000 밀리초) 이내인 경우에만 저장된 장바구니 정보 사용
      if (currentTime - storedTime < 3600000) {
        setCartItems(JSON.parse(storedCart));
      } else {
        // 1시간 이상 지났으면 저장된 정보 삭제
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTimestamp');
      }
    }
  };

  const addToCart = (newItem) => {
    setCartItems(prevItems => {
      const updatedItems = [...prevItems, newItem];
      saveCartItems(updatedItems);
      return updatedItems;
    });
  };

  const saveCartItems = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    localStorage.setItem('cartTimestamp', new Date().getTime().toString());
  };

  const updateQuantity = (index, newQuantity) => {
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = Math.max(1, newQuantity);
      saveCartItems(updatedItems);
      return updatedItems;
    });
  };

  const removeItem = (index) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter((_, i) => i !== index);
      saveCartItems(updatedItems);
      return updatedItems;
    });
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>장바구니</h1>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className={styles.cartItem}>
              <img src={item.img} alt={item.name} width={100} height={100} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h2 className={styles.itemName}>{item.name}</h2>
                <div className={styles.quantityControl}>
                  <button onClick={() => updateQuantity(index, item.quantity - 1)} className={styles.quantityButton}>-</button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, item.quantity + 1)} className={styles.quantityButton}>+</button>
                </div>
                <p className={styles.itemPrice}>가격: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button onClick={() => removeItem(index)} className={styles.removeButton}>삭제</button>
            </div>
          ))}
          <div className={styles.cartSummary}>
            <p className={styles.totalPrice}>총 가격: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
            <button className={styles.checkoutButton}>체크아웃</button>
          </div>
        </>
      ) : (
        <p className={styles.emptyCart}>장바구니가 비어 있습니다</p>
      )}
    </div>
  );
};

export default Cart;
