// src/components/Footer.jsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-footer-bg)', color: 'var(--color-footer-text)' }}>
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Section 1: Brand */}
          <div className="mb-4 lg:mb-0">
            <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--color-primary)' }}>
              BrightBuy
            </h3>
            <p className="text-sm">
              Your trusted source for consumer electronics in Texas. Quality products, reliable service.
            </p>
          </div>
          
          {/* Section 2: Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-secondary">All Products</Link></li>
              <li><Link href="/about" className="hover:text-secondary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-secondary">Contact</Link></li>
              <li><Link href="/cart" className="hover:text-secondary">My Cart</Link></li>
            </ul>
          </div>
          
          {/* Section 3: Legal */}
          <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-secondary">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-secondary">Terms of Service</a></li>
              </ul>
          </div>

          {/* Section 4: Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start"><i className="fas fa-map-marker-alt mr-3 mt-1"></i><span>Dallas, Texas, USA</span></li>
              <li className="flex items-start"><i className="fas fa-phone mr-3 mt-1"></i><span>+1 (123) 456-7890</span></li>
              <li className="flex items-start"><i className="fas fa-envelope mr-3 mt-1"></i><span>support@brightbuy.com</span></li>
            </ul>
          </div>

        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm" style={{ borderColor: 'var(--color-footer-text)', opacity: 0.5 }}>
          <p>&copy; {new Date().getFullYear()} BrightBuy. All Rights Reserved. | Team: Izzath, Janith, Kalhara, Hatheem, Savindu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;