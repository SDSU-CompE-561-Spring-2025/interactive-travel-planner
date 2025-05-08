import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
}

const Notification = ({ type, message }: NotificationProps) => {
  return (
    <div 
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3"
      style={{
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        animation: 'fadeInOut 3s ease-in-out forwards'
      }}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="font-medium">{message}</span>
      
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Notification;