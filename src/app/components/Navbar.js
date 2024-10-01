'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    // 로그인 상태 및 사용자 이름 확인
    const checkLoginStatus = async () => {
      const sessionKey = localStorage.getItem('sessionKey');
      console.log(sessionKey);
      if (sessionKey) {
        try {
          const { data, error } = await supabase
            .from('member')
            .select('username')
            .eq('session_key', sessionKey)
            .single();

          if (error) throw error;

          if (data) {
            setIsLoggedIn(true);
            setUsername(data.username);
          } else {
            // 세션 키가 유효하지 않은 경우
            localStorage.removeItem('sessionKey');
            setIsLoggedIn(false);
            setUsername('');
          }
        } catch (error) {
          console.error('사용자 정보 조회 오류:', error);
          setIsLoggedIn(false);
          setUsername('');
        }
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    // 메뉴가 열릴 때마다 타이머 설정
    if (isMenuOpen) {
      resetTimer();
    } else {
      // 메뉴가 닫힐 때 타이머 제거
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    // 컴포넌트가 언마운트될 때 타이머 제거
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isMenuOpen]);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 2000); // 3초 후 메뉴 닫기
  };

  const handleLogout = async () => {
    try {
      // 데이터베이스에서 세션 정보 직접 삭제
      const sessionKey = localStorage.getItem('sessionKey');
      if (sessionKey) {
        const { error } = await supabase
          .from('member')
          .update({ session_key: null, session_expires_at: null })
          .eq('session_key', sessionKey);
        
        if (error) {
          console.error('세션 정보 삭제 오류:', error);
          throw error;
        }
      }

      // 클라이언트 측 세션 정보 삭제
      localStorage.removeItem('sessionKey');
      console.log('로그아웃: sessionKey 삭제됨');

      // 로그아웃 성공 메시지
      alert(`${username}님, 로그아웃되었습니다.`);

      // 상태 업데이트
      setIsLoggedIn(false);
      setUsername('');

      // 메뉴 닫기
      setIsMenuOpen(false);

      // 메인 페이지로 이동 및 강제 리프레시
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    // 링크 클릭 시 타이머 제거
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    resetTimer();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white px-5 py-4 shadow-md overflow-hidden">
      <div className="flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="text-center sm:text-left">
          <Image src="/logo.png" alt="Logo" width={100} height={40} />
        </Link>

        {/* 메뉴 토글 버튼 (모든 화면에서 보임) */}
        <button className="block text-2xl text-[#333]" onClick={handleMenuToggle}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* 메뉴가 열리면 표시 (모든 화면에서 토글 가능) */}
      {isMenuOpen && (
        <div className="mt-4 w-full flex flex-col items-center space-y-4" onMouseMove={resetTimer} onTouchStart={resetTimer}>
          <Link href="/Shop" onClick={handleLinkClick} className="group w-full text-center">
            <span className="text-[#333] group-hover:text-[#666] group-hover:underline">Shop</span>
          </Link>
          <Link href="/About" onClick={handleLinkClick} className="group w-full text-center">
            <span className="text-[#333] group-hover:text-[#666] group-hover:underline">About</span>
          </Link>
          <Link href="/Contact" onClick={handleLinkClick} className="group w-full text-center">
            <span className="text-[#333] group-hover:text-[#666] group-hover:underline">Contact</span>
          </Link>
          <Link href="/Cart" onClick={handleLinkClick} className="group w-full text-center">
            <span className="text-[#333] group-hover:text-[#666] group-hover:underline">Cart</span>
          </Link>
          {isLoggedIn && (
            <Link href="/Mypage" onClick={handleLinkClick} className="group w-full text-center">
              <span className="text-[#333] group-hover:text-[#666] group-hover:underline">Mypage</span>
            </Link>
          )}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="group w-full text-center">
              <span className="text-[#333] group-hover:text-[#666] group-hover:underline">Logout</span>
            </button>
          ) : (
            <Link href="/Login" onClick={handleLinkClick} className="group w-full text-center">
              <span className="text-[#333] group-hover:text-[#666] group-hover:underline">Login</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
