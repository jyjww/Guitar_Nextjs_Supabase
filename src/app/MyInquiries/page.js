'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function MyInquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [flippedCards, setFlippedCards] = useState({});
    const router = useRouter();

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        const sessionKey = localStorage.getItem('sessionKey');
        if (!sessionKey) {
            alert('로그인이 필요합니다.');
            router.push('/Login');
            return;
        }

        try {
            const { data: memberData, error: memberError } = await supabase
                .from('member')
                .select('id')
                .eq('session_key', sessionKey)
                .single();

            if (memberError) throw memberError;

            if (memberData) {
                setIsLoggedIn(true);
                fetchInquiries(memberData.id);
            } else {
                alert('로그인 정보를 확인할 수 없습니다.');
                router.push('/Login');
            }
        } catch (error) {
            console.error('로그인 상태 확인 오류:', error);
            alert('로그인 상태를 확인하는 데 실패했습니다.');
            router.push('/Login');
        }
    };

    const fetchInquiries = async (memberId) => {
        const { data, error } = await supabase
            .from('qna')
            .select('*')
            .eq('member_id', memberId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('문의 내역 조회 오류:', error);
            alert('문의 내역을 불러오는 데 실패했습니다.');
        } else {
            setInquiries(data);
        }
    };

    const toggleCard = (id) => {
        setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!isLoggedIn) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="font-nanumsquare p-8">
            <div className="w-full h-[100px] overflow-x-hidden"></div>
            <h1 className="text-2xl font-bold mb-6 text-center">나의 문의 내역</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1240px] mx-auto">
                {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className={`bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-500 ${flippedCards[inquiry.id] ? 'rotate-y-180' : ''}`}>
                        {/* 카드 앞면 */}
                        <div className={`p-6 ${flippedCards[inquiry.id] ? 'hidden' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-gray-500 text-sm">{new Date(inquiry.created_at).toLocaleString()}</p>
                                <p className={`text-sm font-medium ${inquiry.reply_date ? 'text-green-600' : 'text-red-600'}`}>
                                    {inquiry.reply_date ? '답변 완료' : '답변 대기중'}
                                </p>
                            </div>
                            <p className="text-gray-600 mb-2">문의 : </p>
                            <p className="text-gray-700 font-semibold mb-4">{inquiry.message}</p>
                            {inquiry.reply_date && (
                                <button
                                    onClick={() => toggleCard(inquiry.id)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    답변 확인
                                </button>
                            )}
                        </div>
                        
                        {/* 카드 뒷면 */}
                        <div className={`p-6 rotate-y-180 ${flippedCards[inquiry.id] ? '' : 'hidden'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-gray-500 text-sm">{new Date(inquiry.reply_date).toLocaleString()}</p>
                            </div>
                            <p className="text-gray-600 mb-2">답변 : </p>
                            <p className="text-gray-700 font-semibold mb-4">{inquiry.admin_message}</p>
                            <button
                                onClick={() => toggleCard(inquiry.id)}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                확인 완료
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}