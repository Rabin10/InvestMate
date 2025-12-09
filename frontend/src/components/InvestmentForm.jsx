import React, { useState, useEffect } from "react";

const defaultData = {
  symbol: "",
  asset_type: "Stock",
  shares: "",
  buy_price: "",
  buy_date: "",
  notes: "",
};

export default function InvestmentForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(defaultData);

  useEffect(() => {
    if (initial) {
      setForm({
        symbol: initial.symbol || "",
        asset_type: initial.asset_type || "Stock",
        shares: initial.shares?.toString() || "",
        buy_price: initial.buy_price?.toString() || "",
        buy_date: initial.buy_date?.slice(0, 10) || "",
        notes: initial.notes || "",
      });
    } else {
      setForm(defaultData);
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      shares: parseFloat(form.shares),
      buy_price: parseFloat(form.buy_price),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {initial ? "Edit Investment" : "Add Investment"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-300">Symbol</label>
            <input
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Asset Type</label>
            <select
              name="asset_type"
              value={form.asset_type}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
            >
              <option>Stock</option>
              <option>Crypto</option>
              <option>ETF</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-300">Shares</label>
              <input
                type="number"
                step="0.00000001"
                name="shares"
                value={form.shares}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Buy Price</label>
              <input
                type="number"
                step="0.01"
                name="buy_price"
                value={form.buy_price}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300">Buy Date</label>
            <input
              type="date"
              name="buy_date"
              value={form.buy_date}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-sm font-medium"
            >
              {initial ? "Save Changes" : "Add Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
