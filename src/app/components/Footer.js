'use client'

import { useState } from 'react';
import "../globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail) || newEmail === '');
  };

  const handleSubscribe = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('newsletter')
        .insert([{ email }]);

      if (error) throw error;

      alert('뉴스레터 구독이 완료되었습니다!');
      setEmail('');
    } catch (error) {
      alert('구독 중 오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <footer className="mt-20 overflow-x-hidden w-full">
      {/* Newsletter Section */}
      <div className="w-full h-[150px] overflow-x-hidden"></div>
      <div className="w-4/5 lg:w-3/5 mx-auto mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <h3 className="text-center sm:text-left font-extrabold text-2xl sm:text-4xl">
          Subscribe to our <br className="flex flex-col sm:hidden"/> Newsletter
        </h3>
        <div className="flex items-center w-full sm:w-auto">
          <input
            className="border-b border-gray-800 px-4 py-2 w-full sm:w-80"
            type="email"
            placeholder="Your email here"
            value={email}
            onChange={(e) => handleEmailChange(e)}
          />
          <button 
            className="p-2 border border-gray-800 text-gray-800 flex items-center justify-center"
            onClick={handleSubscribe}
          >
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
          </button>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="w-full h-[150px] overflow-x-hidden"></div>
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center px-4 overflow-x-hidden sm:px-8 py-4">
        <p className="font-light text-center sm:text-left">© 2024 Ibanez</p>
        <div className="hidden sm:flex space-x-6">
          <a href="#" className="text-black hover:underline">Privacy Policy</a>
          <a href="#" className="text-black hover:underline">Terms of Service</a>
          <a href="#" className="text-black hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
