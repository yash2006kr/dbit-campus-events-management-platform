import React from 'react';

const QRCodeDisplay = ({ qrCodeImageUrl }) => {
  if (!qrCodeImageUrl) return null;

  return (
    <div className="qr-code-display p-4 bg-gray-900 border border-orange-500 rounded-lg flex flex-col items-center">
      <h3 className="text-orange-400 mb-2 font-semibold">Event Check-in QR Code</h3>
      <img src={qrCodeImageUrl} alt="Event Check-in QR Code" className="w-48 h-48" />
      <p className="text-gray-400 mt-2 text-sm">Scan this QR code to check in at the event.</p>
    </div>
  );
};

export default QRCodeDisplay;
