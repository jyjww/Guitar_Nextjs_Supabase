import styles from '../globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Login() {
    return (
        <div className="maincontent">
            <h1>Login Page</h1>
            <div className="loginform">
                <div className="inputwrapper">
                    <FontAwesomeIcon icon={faCircleUser} className="loginicon" size="sm" style={{width:"24px", height:"24px"}}/>
                    <input className="logininput" type="text" placeholder="Username" />
                </div>
                <div className="inputwrapper">
                    <FontAwesomeIcon icon={faLock} className="loginicon" size="sm" style={{width:"24px", height:"24px"}}/>
                    <input className="logininput" type="password" placeholder="Password" />
                </div>
                <button className="loginbutton">Login</button>
                <Link href="/Login/Signup" className="loginlink">Signup</Link>
            </div>
        </div>
    );
};
