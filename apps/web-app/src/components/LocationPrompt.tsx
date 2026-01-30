import React, { useState } from "react";
import { MapPin, Loader } from "lucide-react";

interface LocationPromptProps {
  onSelectAddress: (address: string) => void;
  onClose: () => void;
  addresses: Array<{ id: number; label: string; address: string }>;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({
  onSelectAddress,
  onClose,
  addresses,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          
          const { latitude, longitude } = position.coords;
          // In a real app, you would use a reverse geocoding API here
          // For now, we'll use a mock address based on coordinates
          const mockAddress = `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          alert('Getting location: ' + mockAddress);
          onSelectAddress(mockAddress);
          setLoading(false);
        } catch (err) {
          setError("Failed to get location details");
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message || "Failed to get your location");
        setLoading(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-blue-300" />
          <h2 className="text-2xl font-bold text-white">Select Location</h2>
        </div>

        <p className="text-white/80 text-sm mb-6">
          Choose how you'd like to set your delivery location:
        </p>

        <div className="space-y-3 mb-6">
          {/* Current Location Button */}
          <button
            onClick={handleCurrentLocation}
            disabled={loading}
            className="w-full p-4 rounded-lg bg-blue-600/40 border-2 border-blue-400 hover:bg-blue-600/60 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Use Current Location
              </>
            )}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white/60">
                or
              </span>
            </div>
          </div>

          {/* Saved Addresses */}
          <p className="text-white/70 text-xs font-semibold">Select from saved addresses:</p>
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => onSelectAddress(addr.address)}
              className="w-full p-3 rounded-lg text-left bg-white/10 border-2 border-transparent hover:bg-white/20 hover:border-blue-400 text-white transition-all"
            >
              <p className="font-semibold text-sm mb-1">{addr.label}</p>
              <p className="text-white/70 text-xs truncate">{addr.address}</p>
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default LocationPrompt;
