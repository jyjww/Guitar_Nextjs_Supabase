'use client'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            // 사용자 인증
            const { data, error } = await supabase
                .from('member')
                .select('id, is_admin')
                .eq('username', username)
                .eq('password', password)
                .single();

            if (data) {
                if (data.is_admin) {
                    // 관리자일 경우 처리
                    console.log('관리자 계정');
                  }
                // 세션 키 생성
                const sessionKey = uuidv4();
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후

                // 세션 키 저장
                const { error: updateError } = await supabase
                    .from('member')
                    .update({ session_key: sessionKey, session_expires_at: expiresAt })
                    .eq('id', data.id);

                if (updateError) throw updateError;

                // 클라이언트에 세션 키 저장
                localStorage.setItem('sessionKey', sessionKey);
                
                // 로그인 성공 알림 표시 (사용자 이름 포함)
                if (data.is_admin) {
                    alert(`관리자 계정으로 로그인되었습니다.\n${username}님, 환영합니다.`);
                } else {
                    alert(`${username}님, 로그인에 성공했습니다.`);
                }
                
                // 메인 화면으로 이동 후 페이지 리프레시
                window.location.href = '/';
            } else {
                alert('잘못된 사용자 이름 또는 비밀번호입니다.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            if (error.message) {
                alert(`로그인 오류: ${error.message}`);
            } else {
                alert('로그인 중 알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="font-nanumsquare">
            <div className="flex flex-col items-center justify-center mx-auto mt-24 w-full min-h-[450px] sm:w-[500px] min-h-[350px] bg-[#f9f9f9] rounded-lg shadow-md p-6 sm:p-12 pb-24 gap-5">
                <h1 className="font-['NanumSquareExtrabold'] font-bold text-2xl text-top">로그인</h1>
                <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
                    <div className="flex flex-col items-center w-full mb-5 gap-2.5">
                        <div className="flex items-center w-full">
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2.5" />
                            <input
                                className="w-full p-2.5 border border-gray-300 rounded text-base"
                                type="text"
                                placeholder="사용자 이름"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <FontAwesomeIcon icon={faLock} className="w-5 h-5 mr-2.5" />
                            <input
                                className="w-full p-2.5 border border-gray-300 rounded text-base"
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full p-2.5 bg-[#333333] text-white border-none rounded text-base cursor-pointer">제출</button>
                    <p className="mt-4 text-sm text-gray-600">회원이 아니신가요? <a href="/Signup" className="text-blue-500">지금 가입하세요</a></p>
                </form>
            </div>
            <div className="w-full h-[150px] overflow-x-hidden"></div>
        </div>
    );
};