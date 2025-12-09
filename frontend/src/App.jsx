import React, { useEffect, useState } from "react";
import {
  fetchMe,
  fetchInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} from "./api";
import PortfolioDashboard from "./components/PortfolioDashboard";
import InvestmentForm from "./components/InvestmentForm";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // for delete modal

  useEffect(() => {
    (async () => {
      const u = await fetchMe();
      if (u) {
        setUser(u);
        const inv = await fetchInvestments();
        setInvestments(inv);
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = () => {
    window.location.href = "/auth/google";
  };

  const handleLogout = () => {
    window.location.href = "/auth/logout";
  };

  const openAddForm = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEditForm = (inv) => {
    setEditing(inv);
    setShowForm(true);
  };

  const handleSave = async (data) => {
    try {
      let saved;
      if (editing) {
        // update existing
        saved = await updateInvestment(editing.id, data);
        setInvestments((prev) =>
          prev.map((i) => (i.id === editing.id ? saved : i))
        );
      } else {
        // create new
        saved = await createInvestment(data);
        setInvestments((prev) => [...prev, saved]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // When user clicks "Remove" in the table
  const handleRemoveClick = (inv) => {
    setDeleteTarget(inv);
  };

  // When user confirms delete in the modal
  const confirmRemove = async () => {
    if (!deleteTarget) return;
    try {
      await deleteInvestment(deleteTarget.id);
      setInvestments((prev) =>
        prev.filter((i) => i.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-200">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50">
        <h1 className="text-3xl font-bold mb-4">InvestMate</h1>
        <p className="mb-6 text-slate-300 max-w-md text-center">
          Track all your stocks, crypto, and ETFs in one simple dashboard.
        </p>
        <button
          onClick={handleLogin}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <>
      {/* top-right user / logout */}
      <div className="absolute top-4 right-6 z-10 flex items-center gap-3 text-sm text-slate-300">
        <span>{user.display_name}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-900"
        >
          Logout
        </button>
      </div>

      {/* Main dashboard */}
      <PortfolioDashboard
        investments={investments}
        onAddClick={openAddForm}
        onEdit={openEditForm}
        onRemove={handleRemoveClick}
      />

      {/* Add / Edit form modal */}
      {showForm && (
        <InvestmentForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          investment={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmRemove}
        />
      )}
    </>
  );
}
