const BASE = "";

export async function fetchMe() {
  const res = await fetch(`${BASE}/api/me`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

export async function fetchInvestments() {
  const res = await fetch(`${BASE}/api/investments`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch investments");
  return res.json();
}

export async function createInvestment(payload) {
  const res = await fetch(`${BASE}/api/investments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create investment");
  return res.json();
}

export async function updateInvestment(id, payload) {
  const res = await fetch(`${BASE}/api/investments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update investment");
  return res.json();
}

export async function deleteInvestment(id) {
  const res = await fetch(`${BASE}/api/investments/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete investment");
  return res.json();
}
