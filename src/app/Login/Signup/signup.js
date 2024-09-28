import styles from '../../globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faLock, faEnvelope, faPhone, faIdCard } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import MemberRegistration from './resisterdb.js';

const Signup = () => {
    const { memberInfo, handleInputChange, handleSubmit } = MemberRegistration();

    return (
        <div className="maincontent">
            <h1>회원가입</h1>
            <form className="signupform" onSubmit={handleSubmit}>
                <div className="inputwrapper">
                    <FontAwesomeIcon icon={faCircleUser} className="signupicon" size="sm" style={{width:"24px", height:"24px"}}/>
                    <input className="signupinput" type="text" name="name" value={memberInfo.name} onChange={handleInputChange} placeholder="이름" />
                </div>
                <div className="inputwrapper">
                    <FontAwesomeIcon icon={faIdCard} className="signupicon" size="sm" style={{width:"24px", height:"24px"}}/>
                    <input className="signupinput" type="text" name="username" value={memberInfo.username} onChange={handleInputChange} placeholder="아이디" />
                </div>
                <div className="inputwrapper">
                    <FontAwesomeIcon icon={faLock} className="signupicon" size="sm" style={{width:"24px", height:"24px"}}/>
                    <input className="signupinput" type="password" name="password" value={memberInfo.password} onChange={handleInputChange} placeholder="비밀번호" />
                </div>
                <div className="inputwrapper">
                    <FontAwesomeIcon icon={faEnvelope} className="signupicon" size="sm" style={{width:"24px", height:"24px"}}/>
                    <input className="signupinput" type="email" name="email" value={memberInfo.email} onChange={handleInputChange} placeholder="이메일" />
                </div>
                <div className="inputwrapper">
                    <FontAwesomeIcon icon={faPhone} className="signupicon" size="sm" style={{width:"24px", height:"24px"}}/>
                    <input className="signupinput" type="tel" name="phone" value={memberInfo.phone} onChange={handleInputChange} placeholder="전화번호" />
                </div>
                <button className="signupbutton" type="submit">회원가입</button>
                <Link href="/Login" className="signuplink">로그인으로 돌아가기</Link>
            </form>
        </div>
    );
};

export default Signup;
