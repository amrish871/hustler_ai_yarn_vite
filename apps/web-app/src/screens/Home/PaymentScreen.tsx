import React, { useState } from 'react';

interface PaymentScreenProps {
  total: number;
  onConfirm: (method: string) => void;
  onBack: () => void;
}

const paymentMethods = [
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'UPI', value: 'upi' },
  { label: 'Cash on Delivery', value: 'cod' },
];

export default function PaymentScreen({ total, onConfirm, onBack }: PaymentScreenProps) {
  const [selected, setSelected] = useState('cod');

  return (
    <div className="p-4 flex gap-6">
      {/* Payment Methods (Left) */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.value}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
                selected === method.value
                  ? 'bg-blue-500/30 border-2 border-blue-500'
                  : 'bg-white/10 border-2 border-transparent hover:bg-white/20'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={selected === method.value}
                onChange={() => setSelected(method.value)}
                className="w-5 h-5"
              />
              <span className="text-white font-medium">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Checkout Summary (Right) */}
      <div className="flex-1 bg-white/10 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-white/80">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Delivery Fee</span>
              <span>₹0</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-2 flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <button
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
            onClick={() => onConfirm(selected)}
          >
            Pay ₹{total}
          </button>
          <button
            className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
