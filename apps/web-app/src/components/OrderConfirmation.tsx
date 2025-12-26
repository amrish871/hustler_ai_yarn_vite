import React from "react";

interface OrderConfirmationProps {
  selectedPaymentMethod: string;
  getTotalPrice: () => string;
  onDone: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  selectedPaymentMethod,
  getTotalPrice,
  onDone,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
        <p className="text-blue-200 mb-6">Your order has been confirmed. Thank you for your purchase!</p>
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-white/70 text-sm mb-2">Payment Method</p>
          <p className="text-white font-semibold capitalize mb-4">{selectedPaymentMethod}</p>
          <p className="text-white/70 text-sm mb-2">Total Amount</p>
          <p className="text-2xl font-bold text-green-300">${getTotalPrice()}</p>
        </div>
        <button
          onClick={onDone}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
