import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ASSET_COLORS = {
  Stock: "#4F46E5",
  Crypto: "#8B5CF6",
  ETF: "#22C55E",
};

function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

export default function PortfolioDashboard({
  investments,
  onAddClick,
  onEdit,
  onRemove,
}) {
  const {
    totalInvested,
    currentValue,
    totalReturnDollar,
    totalReturnPct,
    holdingsCount,
    allocationData,
  } = useMemo(() => {
    let invested = 0;
    let current = 0;
    const byType = {};

    investments.forEach((inv) => {
      const shares = Number(inv.shares) || 0;
      const buyPrice = Number(inv.buy_price) || 0;
      const currentPrice = Number(inv.current_price) || 0;

      invested += shares * buyPrice;
      current += shares * currentPrice;

      const type = inv.asset_type || "Other";
      if (!byType[type]) byType[type] = 0;
      byType[type] += shares * currentPrice;
    });

    const retDollar = current - invested;
    const retPct = invested > 0 ? (retDollar / invested) * 100 : 0;

    const allocation = Object.entries(byType).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalInvested: invested,
      currentValue: current,
      totalReturnDollar: retDollar,
      totalReturnPct: retPct,
      holdingsCount: investments.length,
      allocationData: allocation,
    };
  }, [investments]);

  // Fake performance data just to draw the line chart
  const perfData = [
    { month: "Jan", value: 10000 },
    { month: "Feb", value: 11000 },
    { month: "Mar", value: 10500 },
    { month: "Apr", value: 12000 },
    { month: "May", value: 13000 },
    { month: "Jun", value: 14000 },
  ];

  // Use real allocation if we have it, otherwise fallback sample
  const donutData =
    allocationData.length > 0
      ? allocationData
      : [
          { name: "Stock", value: 60 },
          { name: "Crypto", value: 30 },
          { name: "ETF", value: 10 },
        ];

  // Total for percentage display in legend
  const totalAllocation = donutData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">InvestMate</h1>
          <button
            onClick={onAddClick}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-medium"
          >
            + Add Investment
          </button>
        </header>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Invested"
            value={formatCurrency(totalInvested)}
          />
          <SummaryCard
            label="Current Value"
            value={formatCurrency(currentValue)}
            subValue={
              totalReturnDollar >= 0
                ? `+${formatCurrency(totalReturnDollar)}`
                : `-${formatCurrency(Math.abs(totalReturnDollar))}`
            }
            positive={totalReturnDollar >= 0}
          />
          <SummaryCard
            label="Total Return"
            value={formatPercent(totalReturnPct)}
            subValue={totalReturnDollar >= 0 ? "All time gain" : "All time loss"}
            positive={totalReturnDollar >= 0}
          />
          <SummaryCard
            label="Holdings"
            value={holdingsCount}
            subValue={`${new Set(
              investments.map((i) => i.asset_type)
            ).size} categories`}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance line chart */}
          <div className="col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">
              Portfolio Performance
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perfData}>
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(v) =>
                      v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset allocation donut chart */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">Asset Allocation</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {donutData.map((entry, index) => {
                      const color =
                        ASSET_COLORS[entry.name] ||
                        ["#22c55e", "#3b82f6", "#a855f7"][index % 3];
                      return <Cell key={entry.name} fill={color} />;
                    })}
                  </Pie>

                  {/* Legend showing percentages, e.g. ETF (40%) */}
                  <Legend
                    formatter={(value, entry) => {
                      const v = entry?.payload?.value ?? 0;
                      const pct = totalAllocation
                        ? ((v / totalAllocation) * 100).toFixed(0)
                        : 0;
                      return `${value} (${pct}%)`;
                    }}
                  />

                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(value),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings table */}
        <HoldingsTable
          investments={investments}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, subValue, positive }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-1">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-semibold">{value}</p>
      {subValue && (
        <p
          className={`text-xs font-medium ${
            positive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {subValue}
        </p>
      )}
    </div>
  );
}

function HoldingsTable({ investments, onEdit, onRemove }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Your Holdings</h2>
          <p className="text-sm text-slate-400">
            Track and manage your investment portfolio
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-800">
              <th className="py-2">Asset</th>
              <th className="py-2">Type</th>
              <th className="py-2 text-right">Shares</th>
              <th className="py-2 text-right">Buy</th>
              <th className="py-2 text-right">Current</th>
              <th className="py-2 text-right">Value</th>
              <th className="py-2 text-right">Return</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center text-slate-500 italic"
                >
                  No investments yet.
                </td>
              </tr>
            )}
            {investments.map((inv) => {
              const shares = Number(inv.shares) || 0;
              const buyPrice = Number(inv.buy_price) || 0;
              const currentPrice = Number(inv.current_price) || 0;
              const value = shares * currentPrice;
              const perReturnPct =
                buyPrice > 0
                  ? ((currentPrice - buyPrice) / buyPrice) * 100
                  : 0;

              return (
                <tr
                  key={inv.id}
                  className="border-b border-slate-800/60 hover:bg-slate-800/40 transition"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold">
                        {inv.symbol?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{inv.symbol}</div>
                        {inv.notes && (
                          <div className="text-xs text-slate-400 truncate max-w-[220px]">
                            {inv.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full bg-slate-800 text-xs">
                      {inv.asset_type}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {shares.toLocaleString("en-US", {
                      maximumFractionDigits: 4,
                    })}
                  </td>
                  <td className="py-3 text-right">
                    {formatCurrency(buyPrice)}
                  </td>
                  <td className="py-3 text-right">
                    {formatCurrency(currentPrice)}
                  </td>
                  <td className="py-3 text-right">
                    {formatCurrency(value)}
                  </td>
                  <td
                    className={`py-3 text-right font-medium ${
                      perReturnPct >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatPercent(perReturnPct)}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(inv)}
                        className="px-3 py-1 rounded-lg border border-slate-700 text-xs hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onRemove(inv)}
                        className="px-3 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
