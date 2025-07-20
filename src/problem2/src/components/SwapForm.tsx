import React, { useEffect, useState } from "react";
import { fetchPrices } from "../api/fetchPrices";
import { type TokenPrice } from "../types";
import ArrowDownIcon from "../assets/arrowdown.svg";
import ConfirmModal from "./ConfirmModal";

const SwapForm: React.FC = () => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [fromToken, setFromToken] = useState("SWTH");
  const [toToken, setToToken] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPrices()
      .then((data) => {
        const seen = new Set<string>();
        const unique = data.filter((p) => {
          if (seen.has(p.currency)) return false;
          seen.add(p.currency);
          return p.price && !isNaN(parseFloat(p.price));
        });
        setPrices(unique);
      })
      .catch(() => setError("Failed to fetch token prices"));
  }, []);

  const getTokenImage = (symbol: string) =>
    `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;

  const handleSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setConverted(null);
    setAmount("");
  };

  const computeConversion = () => {
    const from = prices.find((p) => p.currency === fromToken);
    const to = prices.find((p) => p.currency === toToken);
    const amt = parseFloat(amount);

    if (!from || !to || isNaN(amt) || amt <= 0) {
      setConverted(null);
      return;
    }

    const result = (amt * parseFloat(from.price)) / parseFloat(to.price);
    setConverted(result.toFixed(6));
  };

  const confirmSwap = () => {
    setShowModal(false);
    setFromToken("SWTH");
    setToToken("ETH");
    setAmount("");
  };

  const onClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    computeConversion();
  }, [amount, fromToken, toToken]);

  return (
    <>
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-center">Swap</h2>

        {/* From Section */}
        <div className="bg-gray-100 rounded-xl p-4 mb-3">
          <div className="flex justify-between items-center">
            <input
              className="text-2xl bg-transparent focus:outline-none w-1/2"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;

                if (parseFloat(value) < 0) {
                  setError("Amount cannot be negative.");
                  return;
                }
                setAmount(value);
                setError("");
              }}
            />
            <select
              className="flex items-center gap-2 bg-transparent text-lg font-medium"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
            >
              {prices.map((p) => (
                <option key={p.currency} value={p.currency}>
                  {p.currency}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <img
              src={getTokenImage(fromToken)}
              alt={fromToken}
              className="w-6 h-6"
            />
            <span className="text-sm text-gray-500">{fromToken}</span>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2">
          <button
            onClick={handleSwap}
            className="bg-white border rounded-full p-2 hover:shadow transition"
          >
            <img src={ArrowDownIcon} alt="Swap" className="w-5 h-5" />
          </button>
        </div>

        {/* To Section */}
        <div className="bg-gray-100 rounded-xl p-4 mt-3">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold text-gray-700">
              {converted ? converted : "0.0"}
            </div>
            <select
              className="flex items-center gap-2 bg-transparent text-lg font-medium"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
            >
              {prices.map((p) => (
                <option key={p.currency} value={p.currency}>
                  {p.currency}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <img
              src={getTokenImage(toToken)}
              alt={toToken}
              className="w-6 h-6"
            />
            <span className="text-sm text-gray-500">{toToken}</span>
          </div>
        </div>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <button
          onClick={() => {
            if (!amount || parseFloat(amount) <= 0) {
              setError("Please enter a valid amount.");
              setConverted(null);
              return;
            }
            setError("");
            setShowModal(true);
          }}
          className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Confirm Swap
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <ConfirmModal
          isOpen={showModal}
          onClose={onClose}
          onConfirm={confirmSwap}
        />
      )}
    </>
  );
};

export default SwapForm;
