import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 가져오기
import { faXmark, faCartPlus, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ItemDetail = ({ item, onClose }) => {
    const [addedToCart, setAddedToCart] = useState(false);
    const router = useRouter();
    
    const handleRedirectToShop = () => {
        router.push(`/Shop?itemId=${item.id}`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl">
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className="flex flex-col items-center">
                    <Image 
                        src={item.image} 
                        alt={item.alt} 
                        width={300} 
                        height={300} 
                        className="object-contain mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                    <p className="text-xl text-gray-600 mb-4">${item.price}</p>
                    <p className="text-gray-500 mb-4">{item.title}</p>
                </div>
                <div className="flex justify-center mt-4">
                    <button 
                        onClick={handleRedirectToShop}
                        className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                        상세 정보 보기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;
