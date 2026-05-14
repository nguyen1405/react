import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-icon">
            <span className="font-bold text-sm">BS</span>
          </div>
          <span className="font-semibold">BlueShop</span>
        </div>
        <div className="footer-copyright">
          © 2026 BlueShop. All rights reserved.
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;