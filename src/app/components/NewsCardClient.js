// components/ClientComponent.js
'use client'; // 클라이언트 컴포넌트 설정

import { useState } from 'react';
import NewsCard from './newscard.js';
import styles from './components.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 가져오기
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기

export default function ClientComponent({ newsItems }) {
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지를 관리하는 상태

  const itemsPerPage = 4; // 한 페이지에 표시할 항목 수
  const totalPages = Math.ceil(newsItems.length / itemsPerPage); // 총 페이지 수 계산

  // 이전 버튼 클릭 핸들러
  const handlePrevClick = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : totalPages - 1));
  };

  // 다음 버튼 클릭 핸들러
  const handleNextClick = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
  };

  // 현재 페이지에 해당하는 데이터 잘라내기
  const currentItems = newsItems.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className={styles.newsletterPage}>
      <h1 className={styles.pageTitle}>Newsletter</h1>
      <div className={styles.sliderContainer}>
        <button className={styles.prevButton} onClick={handlePrevClick}><FontAwesomeIcon icon={faAnglesLeft} size="lg" />
        </button>
        <div className={styles.newsGrid}>
          {currentItems.map((item, index) => (
            <div key={index} className={styles.newsCardWrapper}>
              <NewsCard
                title={item.title}
                date={item.date}
                description={item.description}
                imageSrc={item.imageSrc}
              />
            </div>
          ))}
        </div>
        <button className={styles.nextButton} onClick={handleNextClick}><FontAwesomeIcon icon={faAnglesRight} size="lg" />
        </button>
      </div>

      <div className={styles.pageIndicator}>
        Page {currentPage + 1} of {totalPages}
      </div>
    </div>
  );
}
