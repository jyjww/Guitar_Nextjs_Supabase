'use client';

import { React, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './PurchaseManger.css';
// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function PurchaseManager() {
  const [purchases, setPurchases] = useState([]);
  const [session, setSession] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const sessionKey = localStorage.getItem('sessionKey');
      if (sessionKey) {
        try {
          const { data, error } = await supabase
            .from('member')
            .select('id, is_admin, username')
            .eq('session_key', sessionKey)
            .single();

          if (error) throw error;

          if (data) {
            setSession({ user: { id: data.id, isAdmin: data.is_admin, username: data.username } });
            fetchPurchases(data.id, data.is_admin, data.username);
          } else {
            localStorage.removeItem('sessionKey');
          }
        } catch (error) {
          console.error('세션 확인 오류:', error);
          localStorage.removeItem('sessionKey');
        }
      }
    };

    checkSession();

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPurchases = async (userId, isAdmin, username) => {
    console.log('Fetching purchases for:', { userId, isAdmin, username });
    try {
      let query = supabase.from('purchase').select('*');
      
      if (!isAdmin) {
        query = query.eq('username', username);  // userId 대신 username 사용
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('Fetched purchases:', data);
      setPurchases(data);
    } catch (error) {
      console.error('구매 내역 조회 오류:', error);
    }
  };

  if (!session) {
    return <div className="text-center text-xl font-semibold mt-10">로그인이 필요합니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 font-nanumsquare p-8">
      <div className="mt-2">
        {/* 큰 화면용 테이블 뷰 (640px 이상) */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                {session.user.isAdmin && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={purchase.img} alt={purchase.name} className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(purchase.date).toLocaleDateString()}</td>
                  {session.user.isAdmin && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.username}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 작은 화면용 카드 뷰 (640px 미만) */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {purchases.map((purchase, index) => (
            <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4">
                <img src={purchase.img} alt={purchase.name} className="w-[60%] h-[60%] object-fit mb-4 rounded-md mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{purchase.name}</h3>
                <div className="space-y-2 text-sm text-gray-500">
                  <p><span className="font-medium">카테고리:</span> {purchase.category}</p>
                  <p><span className="font-medium">가격:</span> {purchase.price}</p>
                  <p><span className="font-medium">수량:</span> {purchase.quantity}</p>
                  <p><span className="font-medium">날짜:</span> {new Date(purchase.date).toLocaleDateString()}</p>
                  {session.user.isAdmin && <p><span className="font-medium">사용자:</span> {purchase.username}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}