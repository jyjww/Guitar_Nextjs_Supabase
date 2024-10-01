'use client'

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePhone, faSquareEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faSquareInstagram, faSquareYoutube } from '@fortawesome/free-brands-svg-icons';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [memberId, setMemberId] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const sessionKey = localStorage.getItem('sessionKey');
            if (sessionKey) {
                try {
                    const { data, error } = await supabase
                        .from('member')
                        .select('id, username, email, phone')
                        .eq('session_key', sessionKey)
                        .single();

                    if (data && !error) {
                        setIsLoggedIn(true);
                        setMemberId(data.id);
                        setName(data.username);
                        setEmail(data.email);
                        setPhone(data.phone || '');
                    } else {
                        // 세션이 만료되었거나 유효하지 않은 경우
                        localStorage.removeItem('sessionKey');
                    }
                } catch (error) {
                    console.error('사용자 정보 조회 오류:', error);
                }
            }
        };

        checkLoginStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let insertData;
            if (isLoggedIn && memberId) {
                insertData = { member_id: memberId, name, email, phone, message };
            } else {
                insertData = { name, email, phone, message };
            }

            const { data, error } = await supabase
                .from('qna')
                .insert([insertData]);
            
            if (error) throw error;
            
            alert('문의가 성공적으로 제출되었습니다!');
            setMessage('');
        } catch (error) {
            alert('문의 제출 중 오류가 발생했습니다: ' + error.message);
        }
    };

    return (
        <div className="font-nanumsquare">
        <div className="flex flex-col items-center justify-center mx-auto mt-24 w-full sm:w-[500px] max-h-fit bg-[#f9f9f9] rounded-lg shadow-md p-6 sm:p-12 pb-24 gap-5">
            <h1 className="font-['NanumSquareExtrabold'] font-bold text-2xl">Contact Us</h1>
            <div className="mt-5 w-full">
                <div className="flex items-center justify-between w-full mb-1">
                    <h3 className="mr-2.5"><FontAwesomeIcon icon={faSquarePhone} className="w-6 h-6" /></h3>
                    <p>123-456-7890</p>
                </div>
                <div className="flex items-center justify-between w-full mb-1">
                    <h3 className="mr-2.5"><FontAwesomeIcon icon={faSquareEnvelope} className="w-6 h-6" /></h3>
                    <p>ibanez@gmail.com</p>
                </div>
                <div className="flex items-center justify-between w-full mb-1">
                    <h3 className="mr-2.5"><FontAwesomeIcon icon={faSquareInstagram} className="w-6 h-6" /></h3>
                    <p>@ibanezguitars</p>
                </div>
                <div className="flex items-center justify-between w-full mb-1">
                    <h3 className="mr-2.5"><FontAwesomeIcon icon={faSquareYoutube} className="w-6 h-6" /></h3>
                    <p>IbanezOfficial</p>
                </div>
            </div>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center w-full mb-5 gap-2.5">
                    <input 
                        className="w-full p-2.5 border border-gray-300 rounded text-base"
                        type="text" 
                        placeholder="이름" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        readOnly={isLoggedIn}
                    />
                    <input 
                        className="w-full p-2.5 border border-gray-300 rounded text-base"
                        type="email" 
                        placeholder="이메일" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={isLoggedIn}
                    />
                    <input 
                        className="w-full p-2.5 border border-gray-300 rounded text-base"
                        type="tel" 
                        placeholder="전화번호" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        readOnly={isLoggedIn}
                    />
                    <textarea 
                        className="w-full p-2.5 border border-gray-300 rounded text-base resize-none" 
                        placeholder="문의사항을 입력해주세요" 
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <button 
                    className="w-full p-2.5 bg-[#333333] text-white border-none rounded text-base cursor-pointer mb-2"
                    onClick={handleSubmit}
                >
                    제출하기
                </button>
                {isLoggedIn && (
                    <Link href="/MyInquiries" className="w-full">
                        <button className="w-full p-2.5 bg-[#cdcdcd] text-white border-none rounded text-base cursor-pointer font-nanumsquare">
                            기존 문의내역 보기
                        </button>
                    </Link>
                )}
            </div>
        </div>
        <div className="w-full h-[150px] overflow-x-hidden"></div>
        </div>
    );
};
