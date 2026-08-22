import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { t, formatINR } from "../../lib/i18n";
import { ExpenseCategory, PaymentMethod } from "../../types";
import { X, Receipt, Wallet, Calendar, CreditCard, Banknote } from "lucide-react";

export const AddExpenseModal: React.FC = () => {
  const {
    isAddExpenseModalOpen,
    setIsAddExpenseModalOpen,
    selectedTrip,
    addExpense,
    currentLanguage,
  } = useApp();

  const [title, setTitle] = useState("");
  const [amountINR, setAmountINR] = useState<number>(1200);
  const [category, setCategory] = useState<ExpenseCategory>("Meals & Dining");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI / GPay / PhonePe");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState("Self");
  const [receiptNote, setReceiptNote] = useState("");

  if (!isAddExpenseModalOpen || !selectedTrip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amountINR <= 0) return;

    addExpense(selectedTrip.id, {
      title,
      amountINR: Number(amountINR),
      category,
      paymentMethod,
      date,
      paidBy,
      receiptNote,
    });

    setTitle("");
    setAmountINR(1200);
    setReceiptNote("");
    setIsAddExpenseModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#efeded] flex items-center justify-between bg-[#f5f3f3]">
          <div>
            <h3 className="text-base font-bold text-[#1b1c1c]">
              {t("addExpense", currentLanguage)}
            </h3>
            <p className="text-xs text-[#5f5e5e]">Trip: {selectedTrip.title}</p>
          </div>
          <button
            onClick={() => setIsAddExpenseModalOpen(false)}
            className="p-1.5 text-[#5f5e5e] hover:text-[#1b1c1c] rounded-full hover:bg-[#efeded] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
              Expense Item / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dinner at Chokhi Dhani, Jaipur"
              className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                Amount (INR ₹) *
              </label>
              <input
                type="number"
                min="1"
                step="50"
                required
                value={amountINR}
                onChange={(e) => setAmountINR(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] font-bold focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              >
                <option value="Meals & Dining">Meals &amp; Dining</option>
                <option value="Transport">Transport (Train/Flight/Cab)</option>
                <option value="Accommodation">Accommodation / Stay</option>
                <option value="Activities">Activities &amp; Entry Fees</option>
                <option value="Shopping">Shopping &amp; Souvenirs</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
              >
                <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
                <option value="Cash (INR)">Cash (INR)</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Receipt Note / Memo</label>
            <input
              type="text"
              value={receiptNote}
              onChange={(e) => setReceiptNote(e.target.value)}
              placeholder="e.g. Split 50-50 with travel partner"
              className="w-full px-3.5 py-2 bg-[#f5f3f3] border border-[#DDDDDD] rounded-xl text-xs text-[#1b1c1c] focus:bg-white focus:border-[#ba0036] outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-[#efeded] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddExpenseModalOpen(false)}
              className="px-4 py-2 rounded-full border border-[#DDDDDD] text-xs font-semibold text-[#5f5e5e] hover:bg-[#f5f3f3]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
