'use client';

import React, {useState} from 'react';
import Image from 'next/image';
import styles from './components.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 가져오기
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기
import ItemDetail from './ItemDetail';

import { handleImageClick, handleCloseDetail } from '../utils/eventHandlers';

const categories = [
    { title: '( Electric )', image: '/electric.png', alt: 'Electric' },
    { title: '( Base )', image: '/base.png', alt: 'Base' },
    { title: '( Acoustic )', image: '/acoustic.png', alt: 'Acustic' },
    { title: '( Accessories )', image: '/accessory.png', alt: 'Accessories' },
  ];

const CategorySection = () => {
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

    return (
        <div className={styles.categories}>
            <h2 className={styles.category_title}>Best Sellers</h2>
            <div className={styles.category_cards}>
                {selectedImage ? (
                // 이미지 상세 페이지 표시
                <ItemDetail image={selectedImage} onClose={() => handleCloseDetail(setSelectedImage)} />
                ) : (
                    categories.map((category) => (
                        <div
                            className={styles.category_card}
                            key={category.title}
                            onClick={() => handleImageClick(setSelectedImage, category)} // 이미지 클릭 핸들러 추가
                            style={{ cursor: 'pointer' }} // 커서 스타일 변경
                        >   
                        <div className={styles.category_card} key={category.title} />
                            <div className={styles.category_text}>
                                <h3 className={styles.category_subtitle}>{category.title}</h3>
                                <button className={styles.category_button}><FontAwesomeIcon icon={faArrowRight} size="sm" style={{color:"#5c5c5c"}}/></button>
                            </div>
                            <img src={category.image} alt={category.alt} className={styles.category_image}/>
                        </div>
                    ))
                )}  
            </div>
        </div>
    );
};

export default CategorySection;