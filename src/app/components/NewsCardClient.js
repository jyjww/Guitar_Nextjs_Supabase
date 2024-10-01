'use client';

import { useState, useEffect, useRef } from 'react';
import NewsCard from './newscard.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

export default function ClientComponent({ newsItems }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 300; // 카드의 예상 너비
        const gap = 24; // gap-6의 픽셀 값
        const newItemsPerPage = Math.min(4, Math.floor((containerWidth + gap) / (cardWidth + gap)));
        setItemsPerPage(Math.max(1, newItemsPerPage));
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(newsItems.length / itemsPerPage));
    setCurrentPage(prevPage => Math.min(prevPage, Math.ceil(newsItems.length / itemsPerPage) - 1));
  }, [itemsPerPage, newsItems.length]);

  const handlePrevClick = () => {
    setCurrentPage(prevPage => (prevPage > 0 ? prevPage - 1 : totalPages - 1));
  };

  const handleNextClick = () => {
    setCurrentPage(prevPage => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
  };

  const currentItems = newsItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="w-full mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-8">Newsletter</h1>
      <div className="flex justify-center items-center my-4 space-x-4">
        <div ref={containerRef} className="flex-grow">
          <div className="flex flex-nowrap justify-center gap-6 overflow-hidden">
            {currentItems.map((item, index) => (
              <div key={index} className="flex-shrink-0 border rounded-lg border-gray-300 p-4 w-full max-w-[300px] overflow-x-hidden">
                <NewsCard
                  title={item.title}
                  date={item.date}
                  description={item.description}
                  imageSrc={item.imageSrc}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-6">
        <button className="text-gray-600 hover:text-gray-900 mt-4" onClick={handlePrevClick}>
          <FontAwesomeIcon icon={faAnglesLeft} size="lg" />
        </button>
        <div className="text-center text-gray-500 mt-4">
          페이지 {currentPage + 1} / {totalPages}
        </div>
        <button className="text-gray-600 hover:text-gray-900 mt-4" onClick={handleNextClick}>
          <FontAwesomeIcon icon={faAnglesRight} size="lg" />
        </button>
      </div>
    </div>
  );
}
