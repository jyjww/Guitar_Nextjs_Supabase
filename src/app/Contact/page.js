import styles from '../globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePhone, faSquareEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faSquareInstagram, faSquareYoutube } from '@fortawesome/free-brands-svg-icons';

export default function Contact() {
    return (
        <div className="maincontent">
            <h1>Contact Us</h1>
            <div className="contactus">
                <div className="inputwrapper_contact">
                    <h3><FontAwesomeIcon icon={faSquarePhone} className="loginicon" size="sm" style={{width:"24px", height:"24px"}}/></h3>
                    <p>123-456-7890</p>
                </div>
                <div className="inputwrapper_contact">
                    <h3><FontAwesomeIcon icon={faSquareEnvelope} className="loginicon" size="sm" style={{width:"24px", height:"24px"}}/></h3>
                    <p>ibanez@gmail.com</p>
                </div>
                <div className="inputwrapper_contact">
                    <h3><FontAwesomeIcon icon={faSquareInstagram} className="loginicon" size="sm" style={{width:"24px", height:"24px"}}/></h3>
                    <p>@ibanezguitars</p>
                </div>
                <div className="inputwrapper_contact">
                    <h3><FontAwesomeIcon icon={faSquareYoutube} className="loginicon" size="sm" style={{width:"24px", height:"24px"}}/></h3>
                    <p>IbanezOfficial</p>
                </div>
            </div>
            <div className="loginform">
                <div className="inputwrapper2">
                    <input className="contactinput" type="text" placeholder="Name" />
                    <input className="contactinput" type="password" placeholder="Email" />
                    <input className="contactinput" type="password" placeholder="Phone" />
                </div>
                <button className="loginbutton">Submit</button>
            </div>
        </div>
    );
};
