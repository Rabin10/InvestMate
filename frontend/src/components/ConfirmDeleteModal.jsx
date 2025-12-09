import React from "react";

export default function ConfirmDeleteModal({ investment, onCancel, onConfirm }) {
  if (!investment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold mb-2 text-slate-50">
          Remove investment
        </h2>
        <p className="text-sm text-slate-300 mb-6">
          Are you sure you want to remove{" "}
          <span className="font-semibold">{investment.symbol}</span> from your
          portfolio? This action can’t be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-slate-600 text-sm text-slate-100 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-sm font-medium text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
