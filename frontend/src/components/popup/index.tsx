import React, { useState } from 'react';

type PopupProps = {
  show: boolean;
  onClose: () => void;
};

const Popup = ({ show, onClose }: PopupProps) => {
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const resetLink = `${window.location.origin}/reset-password`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white p-5 rounded-lg shadow-lg z-50 w-[90%] max-w-md border border-gray-200">
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 text-gray-500 hover:text-gray-700 text-xl font-medium border-none bg-transparent cursor-pointer"
        aria-label="Close"
      >
        ×
      </button>

      <h3 className="text-lg font-semibold mb-2">Reset Your Password</h3>

      <div className="mb-3">
        <p className="mb-2">Here's your password reset link:</p>
        <p>Save this link for future use</p>
        <div className="flex items-center gap-2 mb-2">
          <a
            href={resetLink}
            className="text-blue-600 hover:underline truncate"
          >
            {resetLink}
          </a>
          <button
            onClick={handleCopy}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${copied
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            aria-label="Copy reset link"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="h-6">
          {copied && (
            <p className="text-sm text-green-600 animate-fade-in">
              Link copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
