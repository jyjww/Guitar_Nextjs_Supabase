'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../components/components.module.css';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트 가져오기
import { handleImageClick2, handleCloseDetail, handleIncrement, handleDecrement } from '../utils/eventHandlers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'; // FontAwesome에서 < > 아이콘 가져오기

// Supabase에서 데이터를 불러오는 함수
const fetchItemsFromSupabase = async () => {
    const { data, error } = await supabase
        .from('shop_items') // shop_items 테이블에서 데이터 가져오기
        .select('*'); // 모든 컬럼 선택

    if (error) {
        console.error('Error fetching items:', error);
        return [];
    }
    
    return data;
};

const ShopItems = () => {
    const router = useRouter();
    const [items, setItems] = useState([]); // State to hold items from the database
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
    const [quantity, setQuantity] = useState(1); // State for quantity
    const [selectedItem, setSelectedItem] = useState(null);

    // 페이지네이션을 위한 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const itemsPerPage = 12; // 한 페이지에 표시할 아이템 수

    // 총 페이지 수 계산
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // 현재 페이지에 보여줄 아이템 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);


    // 컴포넌트가 마운트되면 Supabase에서 데이터를 가져옴
    useEffect(() => {
        const fetchItems = async () => {
            const fetchedItems = await fetchItemsFromSupabase();
            setItems(fetchedItems); // 가져온 데이터를 state에 설정
        };
        
        fetchItems();
    }, []);

    // 페이지네이션을 위한 함수
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleImageClick2 = (setSelectedImage, item) => {
        setSelectedImage(item);
        setSelectedItem(item);
        setQuantity(1); // 이미지 클릭 시 수량을 1로 초기화
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + 1;
            if (selectedItem) {
                setSelectedItem({...selectedItem, quantity: newQuantity});
            }
            return newQuantity;
        });
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => {
            const newQuantity = Math.max(prevQuantity - 1, 1);
            if (selectedItem) {
                setSelectedItem({...selectedItem, quantity: newQuantity});
            }
            return newQuantity;
        });
    };

    const handleAddToCart = (item) => {
        console.log('Adding to cart:', item);
        const cartItem = {
            name: item.name,
            price: item.price,
            img: item.img,
            quantity: item.quantity || quantity
        };

        // 로컬 스토리지에서 기존 장바구니 정보 가져오기
        const storedCart = localStorage.getItem('cart');
        const storedTimestamp = localStorage.getItem('cartTimestamp');
        let cartItems = [];

        if (storedCart && storedTimestamp) {
            const currentTime = new Date().getTime();
            const storedTime = parseInt(storedTimestamp);

            // 1시간 이내인 경우에만 저장된 장바구니 정보 사용
            if (currentTime - storedTime < 3600000) {
                cartItems = JSON.parse(storedCart);
            }
        }

        // 새 아이템 추가
        cartItems.push(cartItem);

        // 로컬 스토리지에 업데이트된 장바구니 정보 저장
        localStorage.setItem('cart', JSON.stringify(cartItems));
        localStorage.setItem('cartTimestamp', new Date().getTime().toString());

        // Cart 페이지로 이동
        router.push('/Cart');
    };

    return (
        <div>
          {/* 그리드 외부에 페이지네이션을 둠 */}
          <div className={styles.gridContainer}>
            {currentItems.map((item) => (
              <div key={item.id} className={styles.card}>
                <Image
                  src={item.img}
                  alt={item.name}
                  width={200}
                  height={200}
                  className={styles.image}
                  onClick={() => {
                    console.log('Item clicked:', item);
                    handleImageClick2(setSelectedImage, item);
                  }} // Attach event handler to image
                  style={{ cursor: 'pointer' }} // Optional: Change cursor to indicate clickability
                />
                <div className={styles.ItemDescription}>
                  <p style={{ fontWeight: 'bold' }}>({item.category})</p>
                  <h3>{item.name}</h3>
                  <p className={styles.price}>${item.price}</p>
                </div>
              </div>
            ))}
          </div>
      
          {/* Popup div to show item details when an image is clicked */}
          {selectedImage && (
            <div className={styles.popupOverlay}>
              <div className={styles.popup}>
                <button
                  className={styles.closeButton}
                  onClick={() => handleCloseDetail(setSelectedImage)}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="sm"
                    style={{ color: '#666666' }}
                  />
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
                      <p>{selectedImage.category}</p>
                      <p
                        style={{
                          color: '#e07808',
                          fontWeight: 'bold',
                          fontStyle: 'italic',
                          fontSize: '1.5rem',
                        }}
                      >
                        ${selectedImage.price}
                      </p>
                    </div>
                    {/* Quantity Control Section */}
                    <div className={styles.popupText2}>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={handleDecrement}
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{quantity}</span>
                        <button
                          onClick={handleIncrement}
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button className={styles.cartButton} onClick={() => handleAddToCart(selectedItem)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          )}
      
          {/* 페이지네이션을 그리드 외부에 배치 */}
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
      
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={
                  currentPage === index + 1
                    ? styles.activePage
                    : styles.pageButton
                }
              >
                {index + 1}
              </button>
            ))}
      
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      );      
};

export default ShopItems;
