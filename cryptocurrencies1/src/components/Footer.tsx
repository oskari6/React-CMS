import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
            </ul>
          </div>
          <div className="footer-social">
            <h3>Follow Us</h3>
            <a href="https://facebook.com">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://instagram.com">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: oskarisulkakoski@gmail.com</p>
            <p>Phone: (040) 5922219</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
