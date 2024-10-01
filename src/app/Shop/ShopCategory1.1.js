'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../supabaseClient';
import { handleImageClick2, handleCloseDetail, handleIncrement, handleDecrement } from '../utils/eventHandlers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ShopCategory from './ShopCategory';

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
    
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <ShopItemsContent />
        </Suspense>
    );
};

const ShopItemsContent = () => {
    const searchParams = useSearchParams();
    const [items, setItems] = useState([]); // State to hold items from the database
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
    const [quantity, setQuantity] = useState(1); // State for quantity
    const [selectedItem, setSelectedItem] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOption, setSortOption] = useState({ column: 'name', order: 'asc' });

    // 페이지네이션을 위한 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const itemsPerPage = 12; // 한 페지에 표시할 아이템 수

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // 현재 페이지에 보여줄 아이템 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);


    // 컴포넌트가 마운트되면 Supabase에서 데이터를 가져옴
    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    useEffect(() => {
        const itemId = searchParams.get('itemId');
        if (itemId && items.length > 0) {
            const item = items.find(item => item.id.toString() === itemId);
            if (item) {
                setSelectedImage(item);
                setSelectedItem(item);
                setQuantity(1);
            }
        }
    }, [searchParams, items]);

    useEffect(() => {
        filterAndSortItems();
    }, [items, selectedCategory, sortOption]);

    const fetchItems = async () => {
        const fetchedItems = await fetchItemsFromSupabase();
        setItems(fetchedItems);
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('shop_items')
            .select('category');

        if (error) {
            console.error('카테고리를 가져오는 중 오류 발생:', error);
            return;
        }

        const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
    };

    const filterAndSortItems = () => {
        let result = [...items];
        
        if (selectedCategory !== 'All') {
            result = result.filter(item => item.category === selectedCategory);
        }

        result.sort((a, b) => {
            if (a[sortOption.column] < b[sortOption.column]) return sortOption.order === 'asc' ? -1 : 1;
            if (a[sortOption.column] > b[sortOption.column]) return sortOption.order === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredItems(result);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSortChange = (newSortOption) => {
        setSortOption(newSortOption);
    };

    // 페이지네이션을 위한 함수
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleImageClick2 = (item) => {
        setSelectedImage(item);
        setSelectedItem(item);
        setQuantity(1);
        router.push(`/Shop?itemId=${item.id}`, undefined, { shallow: true });
    };

    const handleShopIncrement = () => {
        setQuantity(prevQuantity => handleIncrement(prevQuantity));
    };

    const handleShopDecrement = () => {
        setQuantity(prevQuantity => handleDecrement(prevQuantity));
    };

    const handleAddToCart = (item) => {
        console.log('Adding to cart:', item);
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            img: item.img,
            quantity: quantity
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

        // 메시지 표시
        setAddedToCart(true);

        // 3초 후 메시지 숨기기
        setTimeout(() => {
            setAddedToCart(false);
        }, 3000);
    };

    const handleCloseDetail = () => {
        setSelectedImage(null);
        setSelectedItem(null);
        router.push('/Shop', undefined, { shallow: true });
    };

    // ShopCategory 컴포넌트의 로직을 사용
    const shopCategory = ShopCategory({
        categories,
        selectedCategory,
        sortOption,
        onCategoryChange: handleCategoryChange,
        onSortChange: handleSortChange
    });

    return (
        <div className="w-[70%] mx-auto px-4 py-8">
            <ShopCategory
                categories={categories}
                selectedCategory={selectedCategory}
                sortOption={sortOption}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
            />

            {/* 기존의 아이템 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {currentItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                        <div className="relative h-48 w-full border-b border-gray-200">
                            <Image
                                src={item.img}
                                alt={item.name}
                                layout="fill"
                                objectFit="contain"
                                className="cursor-pointer"
                                onClick={() => handleImageClick2(item)}
                            />
                        </div>
                        <div className="p-4">
                            <p className="text-sm font-bold text-gray-600">({item.category})</p>
                            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                            <p className="text-orange-500 font-bold">${item.price}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-black'
                    } disabled:opacity-50`}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-black'
                    } disabled:opacity-50`}
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>

            {/* Popup Overlay */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 relative">
                        <div className="flex flex-col md:flex-row md:items-stretch">
                            <div className="md:w-1/2 rounded-lg overflow-hidden flex flex-col">
                                <Image
                                    src={selectedImage.img}
                                    alt={selectedImage.name}
                                    width={300}
                                    height={300}
                                    objectFit="contain"
                                    className="w-full h-auto flex-grow"
                                />
                            </div>
                            <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0 flex flex-col">
                                <div className="mb-4 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">{selectedImage.name}</h2>
                                    <button
                                        onClick={handleCloseDetail}
                                        className="text-2xl text-gray-600 hover:text-gray-800"
                                    >
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                </div>
                                <p className="text-gray-600">{selectedImage.category}</p>
                                <p className="text-2xl font-bold text-orange-500 italic">${selectedImage.price}</p>
                                <div className="flex-grow"></div>
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <button onClick={handleShopDecrement} className="bg-gray-200 px-3 py-1 rounded-l">-</button>
                                            <span className="px-4 py-1 bg-gray-100">{quantity}</span>
                                            <button onClick={handleShopIncrement} className="bg-gray-200 px-3 py-1 rounded-r">+</button>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleAddToCart(selectedItem)}
                                        disabled={addedToCart}
                                        className={`w-full py-2 rounded ${
                                            addedToCart 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-gray-100 text-black'
                                        } hover:bg-opacity-90 transition-colors`}
                                    >
                                        {addedToCart ? '장바구니에 저장됨' : '장바구니에 추가'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopItems;