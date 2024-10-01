'use client'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faPhone, faCalendar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { checkUsernameDuplicate, saveMember } from '../utils/memberUtils';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [isUsernameDuplicate, setIsUsernameDuplicate] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid || !isPhoneValid || !isEmailValid) {
            alert('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        try {
            const isDuplicate = await checkUsernameDuplicate(username);
            if (isDuplicate) {
                alert('이미 사용 중인 사용자 이름입니다.');
                return;
            }

            const memberData = {
                name,
                username,
                password, // 주의: 실제 구현 시 비밀번호는 암호화해야 합니다.
                phone,
                email,
                birth: dateOfBirth,
            };

            const savedMember = await saveMember(memberData);
            alert(`회원가입이 완료되었습니다. $1000가 지급되었습니다.`);
            router.push('/Login');
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const validatePassword = (pwd) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(pwd);
    };

    const validatePhone = (phoneNumber) => {
        const regex = /^\d{11}$/;
        return regex.test(phoneNumber);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    useEffect(() => {
        if (username) {
            checkUsernameDuplicate();
        }
    }, [username]);

    useEffect(() => {
        setIsPasswordValid(validatePassword(password));
    }, [password]);

    useEffect(() => {
        setIsPhoneValid(validatePhone(phone));
    }, [phone]);

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
    }, [email]);

    return (
        <div className="font-nanumsquare">
            <div className="flex flex-col items-center justify-center mx-auto mt-24 w-full sm:w-[500px] min-h-[550px] bg-[#f9f9f9] rounded-lg shadow-md p-6 sm:p-12 pb-24 gap-5">
                <h1 className="font-['NanumSquareExtrabold'] font-bold text-2xl">회원가입</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                    <div className="flex flex-col items-center w-full mb-5 gap-2.5">
                        <div className="flex items-center w-full">
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2.5" />
                            <input 
                                className="w-full p-2.5 border border-gray-300 rounded text-base" 
                                type="text" 
                                placeholder="Name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <FontAwesomeIcon 
                                icon={faCheck} 
                                className={`ml-2 ${!name ? 'text-gray-300' : 'text-green-500'}`} 
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2.5" />
                            <input 
                                className="w-full p-2.5 border border-gray-300 rounded text-base" 
                                type="text" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <FontAwesomeIcon 
                                icon={faCheck} 
                                className={`ml-2 ${!username ? 'text-gray-300' : isUsernameDuplicate ? 'text-red-500' : 'text-green-500'}`} 
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <FontAwesomeIcon icon={faLock} className="w-5 h-5 mr-2.5" />
                            <input 
                                className="w-full p-2.5 border border-gray-300 rounded text-base" 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FontAwesomeIcon 
                                icon={faCheck} 
                                className={`ml-2 ${!password ? 'text-gray-300' : isPasswordValid ? 'text-green-500' : 'text-red-500'}`} 
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <FontAwesomeIcon icon={faPhone} className="w-5 h-5 mr-2.5" />
                            <input 
                                className="w-full p-2.5 border border-gray-300 rounded text-base" 
                                type="tel" 
                                placeholder="Phone (11 digits)" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                            />
                            <FontAwesomeIcon 
                                icon={faCheck} 
                                className={`ml-2 ${!phone ? 'text-gray-300' : isPhoneValid ? 'text-green-500' : 'text-red-500'}`} 
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 mr-2.5" />
                            <input 
                                className="w-full p-2.5 border border-gray-300 rounded text-base" 
                                type="email" 
                                placeholder="Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FontAwesomeIcon 
                                icon={faCheck} 
                                className={`ml-2 ${!email ? 'text-gray-300' : isEmailValid ? 'text-green-500' : 'text-red-500'}`} 
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <FontAwesomeIcon icon={faCalendar} className="w-5 h-5 mr-2.5" />
                            <input 
                                className="w-full p-2.5 border border-gray-300 rounded text-base" 
                                type="date" 
                                placeholder="Date of Birth" 
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                            <FontAwesomeIcon 
                                icon={faCheck} 
                                className={`ml-2 ${!dateOfBirth ? 'text-gray-300' : 'text-green-500'}`} 
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full p-2.5 bg-[#333333] text-white border-none rounded text-base cursor-pointer">Submit</button>
                </form>
                <p className="mt-4 text-sm text-gray-600">이미 회원이신가요? <a href="/Login" className="text-blue-500">로그인하기</a></p>
            </div>
            <div className="w-full h-[150px] overflow-x-hidden"></div>
        </div>
    );
};