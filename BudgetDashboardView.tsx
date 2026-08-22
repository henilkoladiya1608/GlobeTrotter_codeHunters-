import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { t, formatINR } from "../lib/i18n";
import { TripExpense } from "../types";
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  Plus,
  Download,
  Trash2,
  Calendar,
  CreditCard,
  Banknote,
  Receipt,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";

export const BudgetDashboardView: React.FC = () => {
  const {
    trips,
    selectedTripId,
    setSelectedTripId,
    selectedTrip,
    currentLanguage,
    setIsAddExpenseModalOpen,
    deleteExpense,
    showToast,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  if (!selectedTrip) {
    return (
      <div className="text-center py-20">
        <p className="text-[#5f5e5e]">No active trip selected for budget tracking.</p>
      </div>
    );
  }

  const totalBudget = selectedTrip.budgetINR || 1;
  const totalSpent = selectedTrip.spentINR || 0;
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;
  const dailyAverage = Math.round(totalSpent / (selectedTrip.durationDays || 1));
  const safeDailySpend = Math.max(
    0,
    Math.round(remaining / (selectedTrip.durationDays || 1))
  );

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {
    Transport: 0,
    Accommodation: 0,
    "Meals & Dining": 0,
    Activities: 0,
    Shopping: 0,
    Others: 0,
  };

  selectedTrip.expenses.forEach((exp) => {
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category] += exp.amountINR;
    } else {
      categoryTotals["Others"] += exp.amountINR;
    }
  });

  const filteredExpenses = selectedTrip.expenses.filter((exp) => {
    return categoryFilter === "All" || exp.category === categoryFilter;
  });

  const handleExportCSV = () => {
    if (selectedTrip.expenses.length === 0) {
      showToast("No expenses to export.");
      return;
    }

    const headers = "Date,Title,Category,PaymentMethod,Amount(INR),PaidBy,ReceiptNote\n";
    const rows = selectedTrip.expenses
      .map(
        (e) =>
          `"${e.date}","${e.title}","${e.category}","${e.paymentMethod}",${e.amountINR},"${
            e.paidBy || ""
          }","${e.receiptNote || ""}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedTrip.title.replace(/\s+/g, "_")}_Expenses_INR.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV expense report downloaded successfully!");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Accommodation":
        return "bg-indigo-500";
      case "Transport":
        return "bg-blue-500";
      case "Meals & Dining":
        return "bg-amber-500";
      case "Activities":
        return "bg-emerald-500";
      case "Shopping":
        return "bg-purple-500";
      default:
        return "bg-[#5f5e5e]";
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Trip Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1c]">
            {t("budget", currentLanguage)}
          </h1>
          <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1">
            Real-time Indian Rupee (INR ₹) tracking, category breakdowns and expense ledger
          </p>
        </div>

        {/* Trip Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#5f5e5e]">Trip:</span>
          <select
            value={selectedTrip.id}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="px-4 py-2 rounded-full border border-[#DDDDDD] bg-white text-xs font-bold text-[#1b1c1c] shadow-2xs outline-hidden cursor-pointer"
          >
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.title} ({trip.destination})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Over-Budget Alert Banner */}
      {isOverBudget && (
        <div className="p-4 rounded-2xl bg-[#ffdada]/60 border border-[#ba1a1a]/30 text-[#ba1a1a] flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0" />
            <span className="text-xs font-semibold">
              Warning: You have exceeded the planned budget for this trip by{" "}
              <strong className="underline">{formatINR(Math.abs(remaining))}</strong>.
            </span>
          </div>
          <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#ba1a1a] text-white">
            Over Budget
          </span>
        </div>
      )}

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#5f5e5e] uppercase tracking-wider">
            {t("totalBudget", currentLanguage)}
          </span>
          <p className="text-xl sm:text-2xl font-bold text-[#1b1c1c] mt-1">
            {formatINR(totalBudget)}
          </p>
          <span className="text-[11px] text-[#5f5e5e] mt-2">
            Allocated for {selectedTrip.durationDays} days
          </span>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#5f5e5e] uppercase tracking-wider">
            {t("totalSpent", currentLanguage)}
          </span>
          <p className="text-xl sm:text-2xl font-bold text-[#ba0036] mt-1">
            {formatINR(totalSpent)}
          </p>
          <span className="text-[11px] text-[#5f5e5e] mt-2">
            {Math.round((totalSpent / totalBudget) * 100)}% of total budget
          </span>
        </div>

        {/* Remaining Budget */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#5f5e5e] uppercase tracking-wider">
            {t("remainingBudget", currentLanguage)}
          </span>
          <p
            className={`text-xl sm:text-2xl font-bold mt-1 ${
              isOverBudget ? "text-[#ba1a1a]" : "text-[#006a45]"
            }`}
          >
            {formatINR(remaining)}
          </p>
          <span className="text-[11px] text-[#5f5e5e] mt-2">
            {isOverBudget ? "Exceeded target" : "Safe to spend"}
          </span>
        </div>

        {/* Daily Average Spend */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#5f5e5e] uppercase tracking-wider">
            {t("safeDailySpend", currentLanguage)}
          </span>
          <p className="text-xl sm:text-2xl font-bold text-[#1b1c1c] mt-1">
            {formatINR(safeDailySpend)} / day
          </p>
          <span className="text-[11px] text-[#5f5e5e] mt-2">
            Avg Spent: {formatINR(dailyAverage)} / day
          </span>
        </div>
      </div>

      {/* Category Breakdown & Visual Progress */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#efeded] pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#ba0036]" />
            <h3 className="text-sm font-bold text-[#1b1c1c]">
              Spending Breakdown by Category
            </h3>
          </div>
          <span className="text-xs text-[#5f5e5e]">
            Total {selectedTrip.expenses.length} transactions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {Object.entries(categoryTotals).map(([category, amount]) => {
            const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
            return (
              <div key={category} className="p-3.5 rounded-xl bg-[#f5f3f3] border border-[#DDDDDD] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1b1c1c]">{category}</span>
                  <span className="font-bold text-[#1b1c1c]">{formatINR(amount)}</span>
                </div>
                <div className="w-full h-1.5 bg-[#efeded] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getCategoryColor(category)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#5f5e5e] text-right">{percentage}% of spent</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Transactions Table / Ledger */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDDDDD] shadow-ethos-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efeded] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#1b1c1c]">Expense Ledger</h3>
            <p className="text-xs text-[#5f5e5e]">Itemized bills, IRCTC tickets, meals and hotel stays</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#DDDDDD] bg-white hover:bg-[#f5f3f3] text-xs font-semibold text-[#1b1c1c] shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("exportCsv", currentLanguage)}</span>
            </button>

            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ba0036] hover:bg-[#9e002e] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("addExpense", currentLanguage)}</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-8 h-8 text-[#5f5e5e] mx-auto mb-2" />
            <p className="text-xs text-[#5f5e5e]">No expenses recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DDDDDD] text-[#5f5e5e] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Item / Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR ₹)</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeded]">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-[#f5f3f3]/80 transition-colors">
                    <td className="py-3 px-3 text-[#5f5e5e] whitespace-nowrap font-medium">
                      {expense.date}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#1b1c1c]">{expense.title}</p>
                      {expense.receiptNote && (
                        <span className="text-[10px] text-[#5f5e5e] block">{expense.receiptNote}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#efeded] text-[#1b1c1c] font-semibold text-[11px]">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5f5e5e]">
                      <span className="px-2.5 py-0.5 rounded-full border border-[#DDDDDD] text-[10px] font-medium bg-white">
                        {expense.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#1b1c1c] whitespace-nowrap">
                      {formatINR(expense.amountINR)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteExpense(selectedTrip.id, expense.id)}
                        className="p-1 text-[#5f5e5e] hover:text-[#ba1a1a] transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
