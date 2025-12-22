import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: number;
  date: string;
  time: string;
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  balance: number;
  paymentMethod: string;
  orderId?: number;
}

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem('voiceAI_transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Failed to parse transactions:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-4xl font-bold text-white">Transactions</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Total Balance</p>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              ${transactions.length > 0 
                ? transactions[0].balance.toFixed(2) 
                : '0.00'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Total Spent</p>
              <ArrowUpRight className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-red-300">
              ${transactions
                .filter(t => t.type === 'debit')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Total Credited</p>
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-300">
              ${transactions
                .filter(t => t.type === 'credit')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg">No transactions yet</p>
              <p className="text-white/50 mt-2">Your transaction history will appear here</p>
              <button
                onClick={() => navigate('/home')}
                className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Left Section */}
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-full ${
                        transaction.type === 'debit'
                          ? 'bg-red-500/20'
                          : 'bg-green-500/20'
                      }`}
                    >
                      {transaction.type === 'debit' ? (
                        <ArrowUpRight
                          className={`w-5 h-5 ${
                            transaction.type === 'debit'
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}
                        />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{transaction.description}</p>
                      <p className="text-white/60 text-sm">
                        {transaction.date} at {transaction.time}
                      </p>
                      {transaction.paymentMethod && (
                        <p className="text-white/50 text-xs mt-1">
                          {transaction.paymentMethod}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === 'debit'
                          ? 'text-red-300'
                          : 'text-green-300'
                      }`}
                    >
                      {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-white/60 text-sm">
                      Balance: ${transaction.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
