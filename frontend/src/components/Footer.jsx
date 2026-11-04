import React from 'react';

export const Footer = ({ portalName = 'IT Support Portal' }) => {
  return (
    <footer className="mt-auto border-t border-[#dce5ef] bg-white py-6">
      <div className="w-[92%] max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#778797]">
        <p className="font-bold text-[#234e70] m-0">IT Helpdesk Ticketing System</p>
        <span className="mt-1 sm:mt-0">{portalName}</span>
      </div>
    </footer>
  );
};

