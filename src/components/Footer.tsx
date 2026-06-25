import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <h3>🍽️ GourmetGo</h3>
          <p>
            Experience premium culinary delights delivered right to your doorstep. Hot, fresh, and tracked in real-time.
          </p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Column 1 */}
        <div className="footer-column">
          <h4>Discover</h4>
          <ul>
            <li><Link href="/restaurants">Trending Restaurants</Link></li>
            <li><Link href="/restaurants?cuisine=Healthy">Healthy Eating</Link></li>
            <li><Link href="/restaurants?cuisine=Premium">Gourmet Selection</Link></li>
            <li><Link href="/offers">Exclusive Offers</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h4>About Us</h4>
          <ul>
            <li><Link href="/about">Our Story</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/blog">Foodie Blog</Link></li>
            <li><Link href="/contact">Contact Support</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/refund">Refund Policy</Link></li>
            <li><Link href="/delivery-terms">Delivery Info</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} GourmetGo Inc. All rights reserved.</p>
        <p>Crafted for food lovers everywhere.</p>
      </div>
    </footer>
  );
}
