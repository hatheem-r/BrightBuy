// src/components/Footer.jsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-footer-bg)",
        color: "var(--color-footer-text)",
      }}
    >
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Section 1: Brand */}
          <div className="mb-4 lg:mb-0 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-xl shadow-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="BrightBuy Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h3
                className="font-bold text-2xl"
                style={{ color: "var(--color-primary)" }}
              >
                BrightBuy
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted source for consumer electronics in Texas. Quality
              products, reliable service.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="animate-fade-in delay-100">
            <h3 className="font-bold mb-6 text-lg flex items-center">
              <i className="fas fa-link text-secondary mr-2"></i>
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                >
                  <i className="fas fa-chevron-right text-xs mr-2"></i>All
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                >
                  <i className="fas fa-chevron-right text-xs mr-2"></i>About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                >
                  <i className="fas fa-chevron-right text-xs mr-2"></i>Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                >
                  <i className="fas fa-chevron-right text-xs mr-2"></i>My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Legal */}
          <div className="animate-fade-in delay-200">
            <h3 className="font-bold mb-6 text-lg flex items-center">
              <i className="fas fa-gavel text-secondary mr-2"></i>
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                >
                  <i className="fas fa-chevron-right text-xs mr-2"></i>Privacy
                  Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                >
                  <i className="fas fa-chevron-right text-xs mr-2"></i>Terms of
                  Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                >
                  <i className="fas fa-chevron-right text-xs mr-2"></i>Return
                  Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                >
                  <i className="fas fa-chevron-right text-xs mr-2"></i>Shipping
                  Info
                </a>
              </li>
            </ul>
          </div>

          {/* Section 4: Contact */}
          <div className="animate-fade-in delay-300">
            <h3 className="font-bold mb-6 text-lg flex items-center">
              <i className="fas fa-envelope text-secondary mr-2"></i>
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-secondary transition-all duration-300">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <span className="leading-relaxed">Dallas, Texas, USA</span>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-secondary transition-all duration-300">
                  <i className="fas fa-phone"></i>
                </div>
                <span className="leading-relaxed">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-secondary transition-all duration-300">
                  <i className="fas fa-envelope"></i>
                </div>
                <span className="leading-relaxed">support@brightbuy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: "var(--color-footer-text)", opacity: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-bold">BrightBuy</span>. All Rights Reserved.
            </p>
            <p className="text-sm text-center">
              Made with{" "}
              <i className="fas fa-heart text-red-500 mx-1 animate-pulse-slow"></i>{" "}
              by Team: Izzath, Janith, Kalhara, Hatheem, Savindu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
