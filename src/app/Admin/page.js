'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AdminPage() {
    const [newsletters, setNewsletters] = useState([]);
    const [qnas, setQnas] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [currentQna, setCurrentQna] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        const sessionKey = localStorage.getItem('sessionKey');
        if (!sessionKey) {
            alert('로그인이 필요합니다.');
            router.push('/Login');
            return;
        }

        try {
            const { data: memberData, error: memberError } = await supabase
                .from('member')
                .select('is_admin, username')
                .eq('session_key', sessionKey)
                .single();

            if (memberError) throw memberError;

            if (memberData && memberData.is_admin) {
                setIsAdmin(true);
                setAdminUsername(memberData.username);
                fetchData();
            } else {
                alert('관리자 권한이 없습니다.');
                router.push('/');
            }
        } catch (error) {
            console.error('관리자 권한 확인 오류:', error);
            alert('관리자 권한을 확인하는 데 실패했습니다.');
            router.push('/');
        }
    };

    const fetchData = async () => {
        const { data: newsletterData } = await supabase
            .from('newsletter')
            .select('email, created_at')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        const { data: qnaData } = await supabase
            .from('qna')
            .select('*')
            .order('created_at', { ascending: false });

        setNewsletters(newsletterData);
        setQnas(qnaData);
    };

    const handleReply = async (qnaId, adminMessage) => {
        try {
            const { data, error } = await supabase
                .from('qna')
                .update({
                    admin_username: adminUsername,
                    admin_message: adminMessage,
                    reply_date: new Date().toISOString()
                })
                .eq('id', qnaId);

            if (error) throw error;

            alert('답변이 성공적으로 저장되었습니다.');
            fetchData(); // 데이터 새로고침
        } catch (error) {
            console.error('답변 저장 오류:', error);
            alert('답변 저장에 실패했습니다.');
        }
    };

    const openReplyPopup = (qna) => {
        setCurrentQna(qna);
        setReplyText(qna.admin_message || '');
        setShowPopup(true);
    };

    const closeReplyPopup = () => {
        setShowPopup(false);
        setCurrentQna(null);
        setReplyText('');
    };

    const handleReplySubmit = async () => {
        if (currentQna) {
            await handleReply(currentQna.id, replyText);
            closeReplyPopup();
        }
    };

    if (!isAdmin) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="font-nanumsquare p-8">
            <div className="w-full h-[100px] overflow-x-hidden"></div>
            <h1 className="text-2xl font-bold mb-6 text-center">관리자 페이지</h1>

            <h2 className="text-xl font-semibold mb-4">뉴스레터 구독자</h2>
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full table-auto border-collapse hidden md:table">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">이메일</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">구독 일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsletters.map((newsletter, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="p-3 text-sm text-gray-600">{newsletter.email}</td>
                                <td className="p-3 text-sm text-gray-600">{new Date(newsletter.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="md:hidden">
                    {newsletters.map((newsletter, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg mb-4 p-4">
                            <p className="text-sm font-semibold mb-2">이메일: <span className="font-normal">{newsletter.email}</span></p>
                            <p className="text-sm font-semibold mb-2">구독 일자: <span className="font-normal">{new Date(newsletter.created_at).toLocaleString()}</span></p>
                        </div>
                    ))}
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">문의 내역</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse hidden md:table">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">문의 일자</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">이름</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">이메일</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">전화번호</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">메시지</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">회원 여부</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">관리자 답변</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">답변 일자</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-700">작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {qnas.map((qna) => (
                            <tr key={qna.id} className="border-b border-gray-200">
                                <td className="p-3 text-sm text-gray-600">{new Date(qna.created_at).toLocaleString()}</td>
                                <td className="p-3 text-sm text-gray-600">{qna.name}</td>
                                <td className="p-3 text-sm text-gray-600">{qna.email}</td>
                                <td className="p-3 text-sm text-gray-600">{qna.phone}</td>
                                <td className="p-3 text-sm text-gray-600">{qna.message}</td>
                                <td className="p-3 text-sm text-gray-600">{qna.member_id ? '✓' : ''}</td>
                                <td className="p-3 text-sm text-gray-600">{qna.admin_message || '-'}</td>
                                <td className="p-3 text-sm text-gray-600">{qna.reply_date ? new Date(qna.reply_date).toLocaleString() : '-'}</td>
                                <td className="p-3 text-sm text-gray-600">
                                    <button
                                        onClick={() => openReplyPopup(qna)}
                                        className={`font-bold py-1 px-2 rounded ${
                                            qna.admin_message
                                                ? 'bg-gray-500 text-white cursor-default'
                                                : 'bg-blue-500 hover:bg-blue-700 text-white'
                                        }`}
                                        disabled={!!qna.admin_message}
                                    >
                                        {qna.admin_message ? '답변완료' : '답변'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="md:hidden">
                    {qnas.map((qna) => (
                        <div key={qna.id} className="bg-white shadow-md rounded-lg mb-4 p-4">
                            <p className="text-sm font-semibold mb-2">문의 일자: <span className="font-normal">{new Date(qna.created_at).toLocaleString()}</span></p>
                            <p className="text-sm font-semibold mb-2">이름: <span className="font-normal">{qna.name}</span></p>
                            <p className="text-sm font-semibold mb-2">이메일: <span className="font-normal">{qna.email}</span></p>
                            <p className="text-sm font-semibold mb-2">전화번호: <span className="font-normal">{qna.phone}</span></p>
                            <p className="text-sm font-semibold mb-2">메시지: <span className="font-normal">{qna.message}</span></p>
                            <p className="text-sm font-semibold mb-2">회원 여부: <span className="font-normal">{qna.member_id ? '✓' : '✗'}</span></p>
                            <p className="text-sm font-semibold mb-2">관리자 답변: <span className="font-normal">{qna.admin_message || '-'}</span></p>
                            <p className="text-sm font-semibold mb-2">답변 일자: <span className="font-normal">{qna.reply_date ? new Date(qna.reply_date).toLocaleString() : '-'}</span></p>
                            <button
                                onClick={() => openReplyPopup(qna)}
                                className={`font-bold py-2 px-4 rounded mt-2 w-full ${
                                    qna.admin_message
                                        ? 'bg-gray-500 text-white cursor-default'
                                        : 'bg-blue-500 hover:bg-blue-700 text-white'
                                }`}
                                disabled={!!qna.admin_message}
                            >
                                {qna.admin_message ? '답변완료' : '답변'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 팝업 오버레이 */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">답변 입력</h3>
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="답변을 입력하세요..."
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={closeReplyPopup}
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleReplySubmit}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}