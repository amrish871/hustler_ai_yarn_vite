import React from 'react';

interface MetaLoadingSpinnerProps {
  visible?: boolean;
  message?: string;
}

const MetaLoadingSpinner: React.FC<MetaLoadingSpinnerProps> = ({ 
  visible = true, 
  message = 'Loading...' 
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        {/* Meta-style spinner with multiple rotating elements */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-blue-400"
            style={{
              animation: 'spin 1.2s linear infinite',
            }}
          ></div>
          
          {/* Middle rotating ring - slower */}
          <div
            className="absolute inset-1 rounded-full border-4 border-transparent border-b-purple-400 border-l-purple-400"
            style={{
              animation: 'spin 1.8s linear infinite reverse',
            }}
          ></div>
          
          {/* Inner circle - pulsing */}
          <div
            className="absolute inset-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}
          ></div>
        </div>

        {/* Loading text */}
        <p className="text-white text-center font-semibold text-lg">{message}</p>
        
        {/* Animated dots */}
        <div className="flex justify-center gap-1 mt-4">
          <span
            className="w-2 h-2 rounded-full bg-blue-400"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: '0s',
            }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-purple-400"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: '0.2s',
            }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-pink-400"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: '0.4s',
            }}
          ></span>
        </div>

        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.5;
            }
            50% {
              transform: translateY(-8px);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.5;
              transform: scale(0.9);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MetaLoadingSpinner;
