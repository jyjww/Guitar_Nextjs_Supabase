import "../globals.css"; // Import global styles or your specific CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_1">
        <h3>Subscribe to our <br/>Newsletter</h3>
        <input className="newsletter_input" type="text" placeholder="Your mail here" />
        <button className="newsletter_icon">
          <FontAwesomeIcon icon={faArrowRight} size={5} style={{color:"#333333", width: "20px", height: "20px"}}/>
        </button>
      </div>
      {/* Footer Logo or Text */}
      <div className="footer_3">
        <div>
          <p>© 2024 Ibanez</p>
        </div>

        {/* Footer Links Section */}
        <div className="footer_links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
