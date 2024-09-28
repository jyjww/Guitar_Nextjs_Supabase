'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../components/components.module.css';
import { supabase } from '../supabaseClient';
import { handleImageClick2, handleCloseDetail, handleIncrement, handleDecrement } from '../utils/eventHandlers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 가져오기
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기

// Function to generate items automatically
const generateItemsElectric = (count) => {
    let items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i + 1,
        name: `Item ${i + 1}`,
        type: 'Electric',                // Static type for all items
        price: `$${10 + i * 10}`,        // Incremental price logic
        img: `/Electric/electricG_(${i}).png`  // Automatically generate the image file name
      });
    }
    return items;
  };
  

const items = generateItemsElectric(10); // Generate 10 items automatically

const ShopItems = ({ handleAddToCart }) => {
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
    const [quantity, setQuantity] = useState(1); // State for quantity

    return (
      <div className={styles.gridContainer}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <Image 
              src={item.img} 
              alt={item.name} 
              width={200} 
              height={200} 
              className={styles.image}
              onClick={() => {
                console.log('Item clicked:', item);
                handleImageClick2(setSelectedImage, item);}} // Attach event handler to image
              style={{ cursor: 'pointer' }} // Optional: Change cursor to indicate clickability
            />
            <div className={styles.ItemDescription}>
                <p style={{fontWeight: "bold"}}>( {item.type} )</p>
                <h3>{item.name}</h3>
                <p className={styles.price}>{item.price}</p>
            </div>
          </div>
        ))}
        {/* Popup div to show item details when an image is clicked */}
        {selectedImage && (
            <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <button className={styles.closeButton} onClick={() => handleCloseDetail(setSelectedImage)}>
                    <FontAwesomeIcon icon={faArrowRight} size="sm" style={{color:"#666666"}}/>
                </button>
                
                <div className={styles.popupContent}>
                    <Image 
                    src={selectedImage.img} 
                    alt={selectedImage.name} 
                    width={300} 
                    height={300}
                    className={styles.popupImage}
                    />
                    
                    <div className={styles.popupText}>
                        <div className={styles.popupText1}>
                            <h2>{selectedImage.name}</h2>
                            <p>{selectedImage.type}</p>
                            <p style={{color: '#e07808', fontWeight: "bold", fontStyle: "italic", fontSize: "1.5rem"}}>{selectedImage.price}</p>
                        </div>
                        {/* Quantity Control Section */}
                        <div className={styles.popupText2}>
                            <div className={styles.quantityControl}>
                                <button onClick={() => handleDecrement(setQuantity)} className={styles.quantityButton}>-</button>
                                <span className={styles.quantity}>{quantity}</span>
                                <button onClick={() => handleIncrement(setQuantity)} className={styles.quantityButton}>+</button>
                            </div>
                        </div>
                        <button className={styles.cartButton}>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
            </div>
        )}
      </div>
    );
  };
  
  export default ShopItems;