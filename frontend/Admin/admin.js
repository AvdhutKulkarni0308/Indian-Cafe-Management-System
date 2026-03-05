// ===== Config =====
const API_BASE = "https://indian-cafe-management-system.onrender.com";
const ADMIN_TOKEN_KEY = "adminToken";

// ===== Auth Helpers =====
function storeAdminToken(t) {
  localStorage.setItem(ADMIN_TOKEN_KEY, t);
}
function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}
function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}
function isAdminLoggedIn() {
  return !!getAdminToken();
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken()}`,
  };
}

// ===== DOM Refs =====
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

// ===== Login =====
loginBtn.addEventListener("click", async () => {
  const email = usernameInput.value.trim();
  const pass = passwordInput.value;

  if (!email || !pass) {
    loginError.textContent = "Please enter email and password.";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in…";
  loginError.textContent = "";

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();

    if (!res.ok) {
      loginError.textContent = data.error || "Login failed.";
      return;
    }
    if (data.role !== "admin") {
      loginError.textContent = "Access denied. Admin accounts only.";
      return;
    }

    storeAdminToken(data.token);
    showDashboard();
  } catch (err) {
    loginError.textContent = "Server error. Is the backend running?";
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Sign In";
  }
});

// Allow Enter key to submit login
[usernameInput, passwordInput].forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loginBtn.click();
  });
});

// ===== Logout =====
logoutBtn.addEventListener("click", () => {
  clearAdminToken();
  dashboardSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
  loginError.textContent = "";
});

// ===== Session Handling =====
function showDashboard() {
  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
  fetchOrders();
  renderMenu();
}

function handleAuthError(res) {
  if (res.status === 401 || res.status === 403) {
    clearAdminToken();
    dashboardSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    loginError.textContent = "Session expired. Please log in again.";
  }
}

// Auto-restore session on page load
if (isAdminLoggedIn()) showDashboard();

// ===== Tab Navigation =====
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update buttons
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    // Update panels
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

// Refresh button
document
  .getElementById("refresh-orders-btn")
  ?.addEventListener("click", fetchOrders);

// ===== Orders =====
const ordersBody = document.getElementById("orders-body");

async function fetchOrders() {
  ordersBody.innerHTML = `
    <tr><td colspan="6">
      <div class="empty-state"><div class="empty-icon">⏳</div><p>Loading orders…</p></div>
    </td></tr>`;

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error();
    }

    const orders = await response.json();
    ordersBody.innerHTML = "";

    if (orders.length === 0) {
      ordersBody.innerHTML = `
        <tr><td colspan="6">
          <div class="empty-state"><div class="empty-icon">📋</div><p>No orders yet.</p></div>
        </td></tr>`;
      return;
    }

    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="order-id" title="${order._id}">${order._id.slice(-8)}</span></td>
        <td>${order.customer?.email || "Guest"}</td>
        <td><span class="table-no">${order.tableNumber || "–"}</span></td>
        <td><span class="amount">₹${order.total}</span></td>
        <td style="color:var(--gray-400);font-size:0.8rem;">${date}</td>
        <td>
          <div class="action-group">
            <button class="btn btn-info btn-sm view-btn" data-id="${order._id}">View</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${order._id}">Delete</button>
          </div>
        </td>`;
      ordersBody.appendChild(row);
    });

    document
      .querySelectorAll(".view-btn")
      .forEach((btn) =>
        btn.addEventListener("click", () => viewOrder(btn.dataset.id)),
      );
    document
      .querySelectorAll(".delete-btn")
      .forEach((btn) =>
        btn.addEventListener("click", () => deleteOrder(btn.dataset.id)),
      );
  } catch (err) {
    ordersBody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state"><p>Failed to load orders.</p></div>
      </td></tr>`;
  }
}

async function deleteOrder(id) {
  if (!confirm("Delete this order? This cannot be undone.")) return;
  try {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      handleAuthError(res);
      throw new Error();
    }
    fetchOrders();
  } catch {
    alert("Failed to delete order.");
  }
}

function viewOrder(id) {
  fetch(`${API_BASE}/orders/${id}`, { headers: authHeaders() })
    .then((r) => {
      if (!r.ok) {
        handleAuthError(r);
        throw new Error();
      }
      return r.json();
    })
    .then((order) => {
      const date = new Date(order.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,.45);
        display:flex;align-items:center;justify-content:center;z-index:999;`;

      const modal = document.createElement("div");
      modal.style.cssText = `
        background:#fff;border-radius:12px;padding:1.75rem;
        max-width:500px;width:90%;max-height:85vh;overflow-y:auto;
        box-shadow:0 20px 60px rgba(0,0,0,.2);`;

      modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1.25rem;">
          <div>
            <h3 style="font-size:1.05rem;font-weight:700;color:#111827;margin:0 0 .25rem;">Order Details</h3>
            <p style="color:#9ca3af;font-size:.8rem;margin:0;">${date}</p>
          </div>
          <button onclick="this.closest('div[style]').remove()"
            style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#6b7280;line-height:1;">×</button>
        </div>
        <div style="background:#f9fafb;border-radius:8px;padding:.875rem 1rem;margin-bottom:1.25rem;font-size:.875rem;">
          <p style="margin:.2rem 0;"><strong>Order ID:</strong> <code style="color:#6b7280;font-size:.8rem;">${order._id}</code></p>
          <p style="margin:.2rem 0;"><strong>Customer:</strong> ${order.customer?.email || "Guest"}</p>
          <p style="margin:.2rem 0;"><strong>Table:</strong> ${order.tableNumber || "–"}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.875rem;">
          <thead>
            <tr style="background:#f3f4f6;border-radius:6px;">
              <th style="padding:.6rem .75rem;text-align:left;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Item</th>
              <th style="padding:.6rem .75rem;text-align:center;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Qty</th>
              <th style="padding:.6rem .75rem;text-align:right;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Price</th>
              <th style="padding:.6rem .75rem;text-align:right;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (i) => `
              <tr style="border-bottom:1px solid #e5e7eb;">
                <td style="padding:.6rem .75rem;">${i.name}</td>
                <td style="padding:.6rem .75rem;text-align:center;">${i.quantity}</td>
                <td style="padding:.6rem .75rem;text-align:right;">₹${i.price}</td>
                <td style="padding:.6rem .75rem;text-align:right;">₹${i.price * i.quantity}</td>
              </tr>`,
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr style="font-weight:700;border-top:2px solid #e5e7eb;">
              <td colspan="3" style="padding:.75rem;text-align:right;color:#111827;">Grand Total</td>
              <td style="padding:.75rem;text-align:right;color:#b45309;">₹${order.total}</td>
            </tr>
          </tfoot>
        </table>`;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
      });
    })
    .catch(() => alert("Failed to load order details."));
}

// ===== Menu Items =====
const menuList = document.getElementById("menu-list");
const menuForm = document.getElementById("menu-form");
const nameInput = document.getElementById("menu-name");
const categoryInput = document.getElementById("menu-category");
const priceInput = document.getElementById("menu-price");
const descInput = document.getElementById("menu-description");
const menuSubmitBtn = document.getElementById("menu-submit");
const menuCancelBtn = document.getElementById("menu-cancel");
const formHeading = document.getElementById("form-heading");
const menuCount = document.getElementById("menu-count");

let menuItems = [];

// Category badge helper
function catBadge(cat) {
  const map = {
    "Hot Beverages": "cat-hot",
    "Cold Beverages": "cat-cold",
    "Snacks & Quick Bites": "cat-snack",
    Desserts: "cat-dessert",
  };
  const cls = map[cat] || "cat-other";
  return `<span class="cat-badge ${cls}">${cat}</span>`;
}

async function renderMenu() {
  menuList.innerHTML =
    '<div class="empty-state"><div class="empty-icon">⏳</div><p>Loading…</p></div>';
  try {
    const res = await fetch(`${API_BASE}/menu`);
    menuItems = await res.json();
    menuCount.textContent = `${menuItems.length} items`;
    drawMenuItems();
  } catch {
    menuList.innerHTML =
      '<div class="empty-state"><p>Failed to load menu.</p></div>';
  }
}

function drawMenuItems() {
  if (menuItems.length === 0) {
    menuList.innerHTML =
      '<div class="empty-state"><div class="empty-icon">🍽</div><p>No items yet.</p></div>';
    return;
  }
  menuList.innerHTML = "";
  menuItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "menu-item-row";
    row.innerHTML = `
      <div class="menu-item-info">
        <h4>${item.name}</h4>
        <div class="meta">${catBadge(item.category)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span class="menu-item-price">₹${item.price}</span>
        <button class="btn btn-info btn-sm edit-btn" data-id="${item._id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-item-btn" data-id="${item._id}">Delete</button>
      </div>`;
    menuList.appendChild(row);
  });

  document
    .querySelectorAll(".edit-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => editItem(btn.dataset.id)),
    );
  document
    .querySelectorAll(".delete-item-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => deleteItem(btn.dataset.id)),
    );
}

// Add item
menuForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!categoryInput.value) {
    alert("Please select a category");
    return;
  }

  const newItem = {
    name: nameInput.value.trim(),
    category: categoryInput.value,
    price: parseFloat(priceInput.value),
    description: descInput.value.trim(),
  };

  menuSubmitBtn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/menu`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(newItem),
    });
    if (!res.ok) {
      handleAuthError(res);
      throw new Error();
    }
    new BroadcastChannel("menu-update").postMessage({ type: "UPDATE_MENU" });
    resetForm();
    renderMenu();
  } catch {
    alert("Failed to add menu item.");
  } finally {
    menuSubmitBtn.disabled = false;
  }
});

async function deleteItem(id) {
  if (!confirm("Delete this menu item?")) return;
  try {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      handleAuthError(res);
      throw new Error();
    }
    new BroadcastChannel("menu-update").postMessage({ type: "UPDATE_MENU" });
    renderMenu();
  } catch {
    alert("Failed to delete menu item.");
  }
}

function editItem(id) {
  const item = menuItems.find((i) => i._id === id);
  if (!item) return;

  nameInput.value = item.name;
  categoryInput.value = item.category;
  priceInput.value = item.price;
  descInput.value = item.description;

  formHeading.textContent = "✏️ Edit Menu Item";
  menuSubmitBtn.textContent = "Update Item";
  menuCancelBtn.classList.remove("hidden");

  // Switch to menu tab
  document.querySelector('[data-tab="menu"]').click();
  menuForm.scrollIntoView({ behavior: "smooth", block: "start" });

  menuForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!categoryInput.value) {
      alert("Please select a category");
      return;
    }
    const updated = {
      name: nameInput.value.trim(),
      category: categoryInput.value,
      price: parseFloat(priceInput.value),
      description: descInput.value.trim(),
    };
    menuSubmitBtn.disabled = true;
    try {
      const res = await fetch(`${API_BASE}/menu/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        handleAuthError(res);
        throw new Error();
      }
      new BroadcastChannel("menu-update").postMessage({ type: "UPDATE_MENU" });
      resetForm();
      renderMenu();
    } catch {
      alert("Failed to update menu item.");
    } finally {
      menuSubmitBtn.disabled = false;
    }
  };
}

menuCancelBtn.addEventListener("click", resetForm);

function resetForm() {
  menuForm.reset();
  menuForm.onsubmit = null;
  formHeading.textContent = "➕ Add Menu Item";
  menuSubmitBtn.textContent = "Add Item";
  menuCancelBtn.classList.add("hidden");
}
