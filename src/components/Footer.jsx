import React from 'react';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Tagline */}
          <div>
            <h3 className="text-2xl font-bold mb-2">VovantSpace</h3>
            <p className="text-sm">Empowering innovation through collaboration</p>
          </div>
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact</h4>
            <p className="text-sm">
              Email:{' '}
              <a href="mailto:contact@vovantspace.com" className="hover:underline">
                contact@vovantspace.com
              </a>
            </p>
            <p className="text-sm">
              Phone:{' '}
              <a href="tel:5551234567" className="hover:underline">
                (555) 123-4567
              </a>
            </p>
          </div>
          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="LinkedIn" className="hover:text-green-200 transition-colors">
                <FaLinkedin className="text-2xl" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-green-200 transition-colors">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-green-200 transition-colors">
                <FaInstagram className="text-2xl" />
              </a>
            </div>
          </div>
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Legal</h4>
            <p className="text-sm hover:underline cursor-pointer">Privacy Policy</p>
            <p className="text-sm hover:underline cursor-pointer">Terms of Service</p>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-green-200">
          &copy; {new Date().getFullYear()} VovantSpace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
