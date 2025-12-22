import React, { useState } from 'react';
import { CreditCard, Smartphone, Truck } from 'lucide-react';

interface PaymentMethodsSectionProps {
  onSelect: (method: string) => void;
  selectedMethod: string;
}

const paymentMethods = [
  { label: 'Credit Card', value: 'credit_card', icon: CreditCard },
  { label: 'UPI', value: 'upi', icon: Smartphone },
  { label: 'Cash on Delivery', value: 'cod', icon: Truck },
];

export function PaymentMethodsSection({ onSelect, selectedMethod }: PaymentMethodsSectionProps) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 mt-4">
      <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
      <div className="grid grid-cols-3 gap-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <button
              key={method.value}
              onClick={() => onSelect(method.value)}
              className={`flex flex-col items-center p-4 rounded-xl transition ${
                selectedMethod === method.value
                  ? 'bg-blue-500/40 border-2 border-blue-500'
                  : 'bg-white/10 border-2 border-transparent hover:bg-white/20'
              }`}
            >
              <IconComponent className="w-6 h-6 text-white mb-2" />
              <span className="text-white text-sm font-medium text-center">{method.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
