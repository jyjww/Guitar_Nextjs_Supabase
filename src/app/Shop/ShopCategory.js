'use client';
import React from 'react';

const ShopCategory = ({ 
    categories = [], 
    selectedCategory = 'All', 
    sortOption = { column: 'name', order: 'asc' }, 
    onCategoryChange, 
    onSortChange 
}) => {

    const handleCategoryClick = (category) => {
        if (onCategoryChange) {
            onCategoryChange(category);
        }
    };

    const handleSortChange = (column) => {
        let newOrder;
        if (sortOption.column === column) {
            // 같은 컬럼을 클릭한 경우, 정렬 순서를 변경
            newOrder = sortOption.order === 'asc' ? 'desc' : 'asc';
        } else {
            // 다른 컬럼을 클릭한 경우, 기본적으로 오름차순 정렬
            newOrder = 'asc';
        }
        const newSortOption = { column, order: newOrder };
        if (onSortChange) {
            onSortChange(newSortOption);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-top mb-10 sm:mb-8 sticky top-0 bg-white z-10 pb-4">
            <h2 className="font-extrabold text-2xl sm:text-3xl mb-4 sm:mb-6">Category</h2>
            <ul className="w-full max-w-md flex flex-wrap justify-center border-b border-gray-300 pb-2 mb-4">
                {['All', 'Electric', 'Base', 'Acoustic', 'Other', ...categories.filter(category => 
                    !['All', 'Electric', 'Base', 'Acoustic', 'Other'].includes(category)
                )].map((category, index) => (
                    <li 
                        key={index} 
                        className={`mx-6 my-1 sm:mx-4 sm:my-2 cursor-pointer transition-colors ${
                            selectedCategory === category ? 'text-[#333] font-bold' : 'hover:text-blue-600'
                        }`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </li>
                ))}
            </ul>

            {/* 정렬 버튼 */}
            <div className="flex justify-center space-x-4 mb-10">
                <button 
                    onClick={() => handleSortChange('name')}
                    className={`px-3 py-1 rounded ${sortOption.column === 'name' ? 'bg-[#333] text-white' : 'bg-gray-200'}`}
                >
                    이름 {sortOption.column === 'name' && (sortOption.order === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                    onClick={() => handleSortChange('price')}
                    className={`px-3 py-1 rounded ${sortOption.column === 'price' ? 'bg-[#333] text-white' : 'bg-gray-200'}`}
                >
                    가격 {sortOption.column === 'price' && (sortOption.order === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                    onClick={() => handleSortChange('sold')}
                    className={`px-3 py-1 rounded ${sortOption.column === 'sold' ? 'bg-[#333] text-white' : 'bg-gray-200'}`}
                >
                    판매량 {sortOption.column === 'sold' && (sortOption.order === 'asc' ? '↑' : '↓')}
                </button>
            </div>
        </div>
    );
};

export default ShopCategory;
