import React from "react";

interface CheckoutPaymentModalProps {
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  setShowCheckoutPaymentModal: (show: boolean) => void;
}

const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  setShowCheckoutPaymentModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Select Payment Method</h2>
          <button
            onClick={() => setShowCheckoutPaymentModal(false)}
            className="text-white/70 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { label: '💳 Card', value: 'card', description: 'Credit or Debit Card' },
            { label: '📱 UPI', value: 'upi', description: 'Google Pay, PhonePe, Paytm' },
            { label: '🚚 COD', value: 'cod', description: 'Cash on Delivery' },
          ].map((method) => (
            <button
              key={method.value}
              onClick={() => {
                setSelectedPaymentMethod(method.value);
                setShowCheckoutPaymentModal(false);
              }}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                selectedPaymentMethod === method.value
                  ? "bg-blue-500/40 border-2 border-blue-400"
                  : "bg-white/10 border-2 border-transparent hover:bg-white/20"
              }`}
            >
              <p className="text-white font-semibold mb-1">{method.label}</p>
              <p className="text-white/70 text-sm">{method.description}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCheckoutPaymentModal(false)}
          className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default CheckoutPaymentModal;
