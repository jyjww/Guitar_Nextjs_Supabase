'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import ItemDetail from './ItemDetail';
import { createClient } from '@supabase/supabase-js';

import { handleImageClick, handleCloseDetail } from '../utils/eventHandlers';

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const CategorySection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const containerRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetchTopProducts();
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        const sessionKey = localStorage.getItem('sessionKey');
        if (sessionKey) {
            try {
                const { data, error } = await supabase
                    .from('member')
                    .select('session_expires_at')
                    .eq('session_key', sessionKey)
                    .single();

                if (data && new Date(data.session_expires_at) > new Date()) {
                    setIsLoggedIn(true);
                } else {
                    // 세션이 만료되었거나 없는 경우
                    localStorage.removeItem('sessionKey');
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('세션 확인 오류:', error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    const fetchTopProducts = async () => {
        try {
            const { data: shopItems, error } = await supabase
                .from('shop_items')
                .select('*')
                .order('sold', { ascending: false });

            if (error) throw error;

            console.log('Fetched shop items:', shopItems);

            const categoryMap = {
                'Electric': 'Electric',
                'Base': 'Base',
                'Acoustic': 'Acoustic',
                'Other': 'Accessories'
            };

            const topProducts = Object.entries(categoryMap).map(([dbCategory, displayCategory]) => {
                const item = shopItems.find(item => item.category === dbCategory);
                console.log(`Category: ${dbCategory}, Found item:`, item);
                return item ? {
                    title: `( ${displayCategory} )`,
                    image: item.img,
                    alt: item.name,
                    name: item.name,
                    price: item.price,
                    id: item.id
                } : null;
            }).filter(Boolean);

            console.log('Top products:', topProducts);

            setCategories(topProducts);
        } catch (error) {
            console.error('상위 제품 조회 오류:', error);
        }
    };

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const handlePrevClick = () => {
        setCurrentPage(prevPage => (prevPage > 0 ? prevPage - 1 : totalPages - 1));
    };

    const handleNextClick = () => {
        setCurrentPage(prevPage => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
    };

    const currentCategories = categories.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div className="w-full flex flex-col justify-center items-center my-5">
            <h2 className="font-extrabold text-4xl mb-8 text-center">Best Sellers</h2>
            {selectedImage ? (
                <ItemDetail 
                    item={selectedImage} 
                    onClose={() => handleCloseDetail(setSelectedImage)}
                    isLoggedIn={isLoggedIn}
                />
            ) : (
                <>
                    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:w-[70%] gap-4 my-5 w-[80%]">
                        {currentCategories.map((category) => (
                            <div
                                className="flex flex-col justify-between items-center w-full max-w-[250px] mx-auto aspect-[3/4] rounded-3xl bg-[#f4f4f4] border-2 border-[#f4f4f4] cursor-pointer overflow-hidden"
                                key={category.id}
                                onClick={() => handleImageClick(setSelectedImage, category)}
                            >
                                <div className="flex flex-row justify-between w-full px-4 items-center mt-1 mb-2">
                                    <h3 className="font-light text-nowrap max-w-[70%] truncate">{category.title}</h3>
                                    <button className="border border-white rounded-full w-8 h-8 flex justify-center items-center bg-white text-black">
                                        <FontAwesomeIcon icon={faArrowRight} size="sm" className="text-[#5c5c5c]"/>
                                    </button>
                                </div>
                                <div className="w-full flex-grow bg-white rounded-b-3xl flex items-center justify-center p-4">
                                    {category.image ? (
                                        <Image 
                                            src={category.image}
                                            alt={category.alt}
                                            layout="responsive"
                                            width={100}
                                            height={100}
                                            className="object-contain"
                                            onError={(e) => {
                                                console.error('Image load error:', e);
                                                e.target.src = '/placeholder.png';  // 플레이스홀더 이미지 경로
                                            }}
                                        />
                                    ) : (
                                        <p>이미지를 불러올 수 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-6 mt-4">
                            <button className="text-gray-600 hover:text-gray-900" onClick={handlePrevClick}>
                                <FontAwesomeIcon icon={faAnglesLeft} size="lg" />
                            </button>
                            <div className="text-center text-gray-500">
                                페이지 {currentPage + 1} / {totalPages}
                            </div>
                            <button className="text-gray-600 hover:text-gray-900" onClick={handleNextClick}>
                                <FontAwesomeIcon icon={faAnglesRight} size="lg" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CategorySection;