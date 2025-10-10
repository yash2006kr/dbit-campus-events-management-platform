import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

const QRScanner = ({ onClose, onCheckinSuccess }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const result = await codeReader.current.decodeOnceFromVideoDevice(undefined, videoRef.current);

      if (result) {
        const qrData = JSON.parse(result.text);
        if (qrData.eventId) {
          await handleCheckin(qrData.eventId);
        } else {
          setError('Invalid QR code format');
        }
      }
    } catch (err) {
      console.error('QR scan error:', err);
      setError('Failed to scan QR code. Please try again.');
    } finally {
      setIsScanning(false);
      if (codeReader.current) {
        codeReader.current.reset();
      }
    }
  };

  const handleCheckin = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/checkin`);
      toast.success('Check-in successful!');
      onCheckinSuccess && onCheckinSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
      setError(error.response?.data?.message || 'Check-in failed');
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (codeReader.current) {
      codeReader.current.reset();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-orange-500 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-orange-400">Scan QR Code</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        <div className="mb-4">
          <video
            ref={videoRef}
            className="w-full h-64 bg-gray-800 rounded border"
            playsInline
            muted
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              <FaCamera />
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition-colors"
            >
              Stop Scanning
            </button>
          )}
        </div>

        <p className="text-gray-400 text-sm mt-3 text-center">
          Position the QR code within the camera view to check in.
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
