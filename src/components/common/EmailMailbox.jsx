'use client';

import { FaEnvelope } from 'react-icons/fa';

export default function EmailMailbox({ email = 'order@researchchems.online', className = '' }) {
  return (
    <a
      href={`https://mail.google.com/mail/?view=cm&to=${email}&su=Inquiry%20from%20BuyResearchChems`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl ${className}`}
    >
      <FaEnvelope className="text-lg" />
      <span>Email Us</span>
    </a>
  );
}
