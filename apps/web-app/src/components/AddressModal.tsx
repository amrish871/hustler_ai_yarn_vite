import React from "react";

interface Address {
  id: number;
  label: string;
  address: string;
}

interface AddressModalProps {
  addresses: Address[];
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  setShowAddressModal: (show: boolean) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  addresses,
  deliveryAddress,
  setDeliveryAddress,
  setShowAddressModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Select Delivery Address</h2>
          <button
            onClick={() => setShowAddressModal(false)}
            className="text-white/70 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => {
                setDeliveryAddress(addr.address);
                setShowAddressModal(false);
              }}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                deliveryAddress === addr.address
                  ? "bg-blue-500/40 border-2 border-blue-400"
                  : "bg-white/10 border-2 border-transparent hover:bg-white/20"
              }`}
            >
              <p className="text-white font-semibold mb-1">{addr.label}</p>
              <p className="text-white/70 text-sm">{addr.address}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddressModal(false)}
          className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default AddressModal;
