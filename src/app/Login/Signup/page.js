import styles from '../../globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faLock, faEnvelope, faPhone, faIdCard } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Signup from './signup';
export default function SignupPage() {
    return (
        <div>
            <Signup />
        </div>
    );
};