'use client'
import { useState } from 'react';

const MemberRegistration = () => {
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 여기에 실제 DB 연동 로직을 구현합니다.
      console.log('회원 등록:', memberInfo);
      // 예: const response = await fetch('/api/register', { method: 'POST', body: JSON.stringify(memberInfo) });
      // 성공 시 처리 (예: 알림 표시, 페이지 이동 등)
    } catch (error) {
      console.error('회원 등록 실패:', error);
      // 실패 시 처리 (예: 에러 메시지 표시)
    }
  };

  return { memberInfo, handleInputChange, handleSubmit };
};

export default MemberRegistration;