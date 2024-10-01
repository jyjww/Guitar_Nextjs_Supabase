'use client'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faPhone, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const validatePassword = (pwd) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(pwd);
};

export default function Mypage() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [point, setPoint] = useState(0);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const sessionKey = localStorage.getItem('sessionKey');
        if (!sessionKey) {
            alert('로그인이 필요합니다.');
            window.location.href = '/Login';
            return;
        }

        try {
            const { data: memberData, error: memberError } = await supabase
                .from('member')
                .select('name, username, point, phone, email, is_admin')
                .eq('session_key', sessionKey)
                .single();

            if (memberError) throw memberError;

            if (memberData) {
                setName(memberData.name);
                setUsername(memberData.username);
                setPoint(memberData.point);
                setPhone(memberData.phone);
                setEmail(memberData.email);
                setIsAdmin(memberData.is_admin);

                // Newsletter 구독 상태 확인
                const { data: newsletterData, error: newsletterError } = await supabase
                    .from('newsletter')
                    .select('*')
                    .eq('email', memberData.email)
                    .single();

                if (newsletterError && newsletterError.code !== 'PGRST116') {
                    throw newsletterError;
                }

                setIsSubscribed(!!newsletterData && newsletterData.deleted_at === null);
            }
        } catch (error) {
            console.error('사용자 정보 조회 오류:', error);
            alert('사용자 정보를 불러오는 데 실패했습니다.');
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword) {
            alert('새 비밀번호를 입력해주세요.');
            return;
        }

        if (!validatePassword(newPassword)) {
            alert('영어, 숫자, 특수문자를 포함한 비밀번호를 입력해 주세요.');
            return;
        }

        try {
            const { error } = await supabase
                .from('member')
                .update({ password: newPassword })
                .eq('username', username);

            if (error) throw error;

            alert('비밀번호가 성공적으로 변경되었습니다.');
            setNewPassword('');

            // 로그아웃 과정
            const sessionKey = localStorage.getItem('sessionKey');
            if (sessionKey) {
                const { error: logoutError } = await supabase
                    .from('member')
                    .update({ session_key: null, session_expires_at: null })
                    .eq('session_key', sessionKey);
                
                if (logoutError) {
                    console.error('세션 정보 삭제 오류:', logoutError);
                    throw logoutError;
                }
            }

            // 클라이언트 측 세션 정보 삭제
            localStorage.removeItem('sessionKey');
            console.log('로그아웃: sessionKey 삭제됨');

            // 로그아웃 성공 메시지
            alert('비밀번호가 변경되어 자동으로 로그아웃됩니다.');

            // 메인 페이지로 이동 및 강제 리프레시
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('비밀번호 변경 또는 로그아웃 오류:', error);
            alert('비밀번호 변경 또는 로그아웃 중 오류가 발생했습니다.');
        }
    };

    const handleSubscriptionChange = async () => {
        if (isAdmin) return; // 관리자인 경우 함수 실행을 중단

        try {
            if (isSubscribed) {
                // 구독 취소 확인
                const confirmCancel = window.confirm('정말로 뉴스레터 구독을 취소하시겠습니까?');
                if (!confirmCancel) {
                    return; // 취소를 선택하지 않으면 함수 종료
                }
                
                // 구독 취소
                const { error } = await supabase
                    .from('newsletter')
                    .update({ deleted_at: new Date().toISOString() })
                    .eq('email', email);

                if (error) throw error;
                setIsSubscribed(false);
                alert('뉴스레터 구독이 취소되었습니다.');
            } else {
                // 구독 신청 또는 재구독
                const { data, error: selectError } = await supabase
                    .from('newsletter')
                    .select('*')
                    .eq('email', email)
                    .single();

                if (selectError && selectError.code !== 'PGRST116') {
                    throw selectError;
                }

                let error;
                if (data) {
                    // 기존 레코드가 있으면 업데이트
                    const { error: updateError } = await supabase
                        .from('newsletter')
                        .update({ deleted_at: null })
                        .eq('email', email);
                    error = updateError;
                } else {
                    // 레코드가 없으면 새로 삽입
                    const { error: insertError } = await supabase
                        .from('newsletter')
                        .insert({ email, deleted_at: null });
                    error = insertError;
                }

                if (error) throw error;
                setIsSubscribed(true);
                alert('뉴스레터 구독이 신청되었습니다.');
            }
        } catch (error) {
            console.error('구독 상태 변경 오류:', error);
            alert('구독 상태 변경에 실패했습니다.');
        }
    };

    return (
        <div className="font-nanumsquare">
            <div className="flex flex-col items-center justify-center mx-auto mt-24 w-full sm:w-[500px] min-h-[550px] bg-[#f9f9f9] rounded-lg shadow-md p-6 sm:p-12 pb-24 gap-5">
                <h1 className="font-['NanumSquareExtrabold'] font-bold text-2xl">Mypage</h1>
                <div className="flex flex-col items-center w-full mb-5 gap-2.5">
                    <div className="flex items-center w-full">
                        <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2.5" />
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded text-base" 
                            type="text" 
                            value={name}
                            readOnly
                        />
                    </div>
                    <div className="flex items-center w-full">
                        <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2.5" />
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded text-base" 
                            type="text" 
                            value={username}
                            readOnly
                        />
                    </div>
                    <div className="flex items-center w-full relative">
                        <FontAwesomeIcon icon={faLock} className="w-5 h-5 mr-2.5" />
                        <div className="flex w-full flex-nowrap">
                            <input 
                                className="w-full p-2.5 border border-gray-300 rounded-l text-base" 
                                type="password" 
                                placeholder="새 비밀번호" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button 
                                onClick={handlePasswordChange}
                                className="px-4 h-[46px] bg-gray-100 border border-gray-300 border-l-0 rounded-r text-sm text-gray-600 transition-colors duration-300 hover:bg-gray-200 focus:outline-none whitespace-nowrap"
                            >
                                변경
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 mr-2.5" />
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded text-base" 
                            type="text" 
                            value={point}
                            readOnly
                        />
                    </div>
                    <div className="flex items-center w-full">
                        <FontAwesomeIcon icon={faPhone} className="w-5 h-5 mr-2.5" />
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded text-base" 
                            type="tel" 
                            value={phone}
                            readOnly
                        />
                    </div>
                    <div className="flex items-center w-full">
                        <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 mr-2.5" />
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded text-base" 
                            type="email" 
                            value={email}
                            readOnly
                        />
                    </div>
                    <div className="flex items-center w-full mt-10 mb-2">
                        <label htmlFor="newsletter" className={`flex items-center cursor-pointer w-full ${isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className={`relative w-10 h-6 transition duration-200 ease-linear rounded-full ${isSubscribed ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <span
                                    className={`absolute left-0 top-0 w-6 h-6 bg-white border-2 rounded-full transition-transform duration-200 ease-linear transform ${isSubscribed ? 'translate-x-4 border-green-500' : 'translate-x-0 border-gray-300'}`}
                                />
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-900">{isSubscribed ? '뉴스레터 구독 중' : '뉴스레터 구독 해제'}</span>
                        </label>
                        <input
                            type="checkbox"
                            id="newsletter"
                            checked={isSubscribed}
                            onChange={handleSubscriptionChange}
                            className="hidden"
                            disabled={isAdmin}
                        />
                    </div>
                    <div className="flex items-center w-full"><Link href="/Purchase" className="w-full p-2.5 bg-[#333333] text-white border-none rounded text-base cursor-pointer text-center">구매 내역</Link></div>
                    {isAdmin && (
                        <div className="flex items-center w-full mt-2">
                            <Link href="/Admin" className="w-full p-2.5 bg-[#333333] text-white border-none rounded text-base cursor-pointer text-center">
                                관리자 화면 접속
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full h-[150px] overflow-x-hidden"></div>
        </div>
    );
}