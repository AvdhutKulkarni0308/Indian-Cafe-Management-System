// ===== Mock Login =====
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "chai123";

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

// ===== Login Logic =====
loginBtn.addEventListener("click", () => {
  const user = usernameInput.value;
  const pass = passwordInput.value;
  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    loginError.textContent = "";
    fetchOrders(); // Add this line to load orders when logging in
    renderMenu();
  } else {
    loginError.textContent = "Invalid credentials!";
  }
});

logoutBtn.addEventListener("click", () => {
  dashboardSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
});

// ===== Orders =====
const ordersBody = document.getElementById("orders-body");

async function fetchOrders() {
  try {
    const response = await fetch('http://localhost:5000/orders');
    const orders = await response.json();
    
    ordersBody.innerHTML = '';
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order._id}</td>
        <td>${order.customer || 'Guest'}</td>
        <td>₹${order.total}</td>
        <td>
          <button class="view-btn" data-id="${order._id}">View</button>
          <button class="delete-btn" data-id="${order._id}">Delete</button>
        </td>
      `;
      ordersBody.appendChild(row);
    });

    // Add event listeners after creating the buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        viewOrder(id);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await deleteOrder(id);
      });
    });
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  }
}

async function deleteOrder(id) {
  try {
    const response = await fetch(`http://localhost:5000/orders/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete order');
    }

    // Refresh the orders list after successful deletion
    await fetchOrders();
  } catch (err) {
    console.error('Error deleting order:', err);
    alert('Failed to delete order');
  }
}

function viewOrder(id) {
  fetch(`http://localhost:5000/orders/${id}`)
    .then(response => response.json())
    .then(order => {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;

      // Create modal
      const modal = document.createElement('div');
      modal.className = 'modal-content';
      modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      `;

      // Format order date
      const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      // Format order items as table
      const itemsTable = `
        <table style="width: 100%; margin-top: 1rem; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="text-align: left; padding: 0.5rem;">Item</th>
              <th style="text-align: center; padding: 0.5rem;">Qty</th>
              <th style="text-align: right; padding: 0.5rem;">Price</th>
              <th style="text-align: right; padding: 0.5rem;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 0.5rem;">${item.name}</td>
                <td style="text-align: center; padding: 0.5rem;">${item.quantity}</td>
                <td style="text-align: right; padding: 0.5rem;">₹${item.price}</td>
                <td style="text-align: right; padding: 0.5rem;">₹${item.price * item.quantity}</td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold; background: #f9fafb;">
              <td colspan="3" style="text-align: right; padding: 0.5rem;">Grand Total:</td>
              <td style="text-align: right; padding: 0.5rem;">₹${order.total}</td>
            </tr>
          </tbody>
        </table>
      `;

      // Populate modal content
      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
          <div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #111827;">Order Details</h3>
            <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">${orderDate}</p>
          </div>
          <button onclick="this.closest('.modal-overlay').remove()" 
                  style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #374151;">&times;</button>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <p style="margin: 0.25rem 0;"><strong>Order ID:</strong> <span style="color: #6b7280; font-family: monospace;">${order._id}</span></p>
          <p style="margin: 0.25rem 0;"><strong>Customer:</strong> ${order.customer || 'Guest'}</p>
        </div>
        <div>
          <h4 style="margin: 0 0 0.5rem 0; color: #111827;">Order Items</h4>
          ${itemsTable}
        </div>
      `;

      // Add modal to overlay
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Close on outside click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
      });
    })
    .catch(err => {
      console.error('Error viewing order:', err);
      alert('Failed to load order details');
    });
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

let menuItems = []; // Will hold data from backend

async function renderMenu() {
  try {
    const res = await fetch("http://localhost:5000/menu"); // Update if needed
    menuItems = await res.json();
    drawMenuItems();
  } catch (err) {
    console.error("Failed to fetch menu items:", err);
  }
}

function drawMenuItems() {
  menuList.innerHTML = "";
  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Price:</strong> ₹${item.price}</p>
      <p>${item.description}</p>
      <div class="menu-item-actions">
        <button class="edit-btn" data-id="${item._id}">Edit</button>
        <button class="delete-btn" data-id="${item._id}">Delete</button>
      </div>
    `;
    menuList.appendChild(div);
  });

  // Add event listeners for buttons
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      editItem(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      deleteItem(id);
    });
  });
}

menuForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate category selection
  if (!categoryInput.value) {
    alert("Please select a category");
    return;
  }

  const newItem = {
    name: nameInput.value,
    category: categoryInput.value,
    price: parseFloat(priceInput.value),
    description: descInput.value,
    isCustom: true
  };

  try {
    const response = await fetch("http://localhost:5000/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    if (!response.ok) {
      throw new Error('Failed to add item');
    }

    // Broadcast the menu update event
    const broadcastChannel = new BroadcastChannel('menu-update');
    broadcastChannel.postMessage({ type: 'UPDATE_MENU' });

    menuForm.reset();
    renderMenu();
  } catch (err) {
    console.error("Failed to add item:", err);
    alert("Failed to add menu item");
  }
});

async function deleteItem(id) {
  if (confirm("Delete this menu item?")) {
    try {
      const response = await fetch(`http://localhost:5000/menu/${id}`, { 
        method: "DELETE" 
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Broadcast the menu update event
      const broadcastChannel = new BroadcastChannel('menu-update');
      broadcastChannel.postMessage({ type: 'UPDATE_MENU' });

      renderMenu();
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete menu item");
    }
  }
}

async function editItem(id) {
  const item = menuItems.find(i => i._id === id);
  if (!item) return;

  // Populate form with item data
  nameInput.value = item.name;
  categoryInput.value = item.category;
  priceInput.value = item.price;
  descInput.value = item.description;

  // Change form state to edit mode
  menuSubmitBtn.textContent = "Update Item";
  menuCancelBtn.classList.remove("hidden");
  menuForm.dataset.editId = id;

  // Scroll form into view
  menuForm.scrollIntoView({ behavior: 'smooth' });

  // Remove existing submit handler
  menuForm.removeEventListener("submit", handleAdd);

  // Add new submit handler for edit
  menuForm.onsubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryInput.value) {
      alert("Please select a category");
      return;
    }

    const updated = {
      name: nameInput.value,
      category: categoryInput.value,
      price: parseFloat(priceInput.value),
      description: descInput.value
    };

    try {
      const response = await fetch(`http://localhost:5000/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      // Reset form
      resetForm();
      
      // Broadcast update
      const broadcastChannel = new BroadcastChannel('menu-update');
      broadcastChannel.postMessage({ type: 'UPDATE_MENU' });

      // Refresh menu list
      await renderMenu();

    } catch (err) {
      console.error("Failed to update item:", err);
      alert("Failed to update menu item");
    }
  };
}

// Add cancel button handler
menuCancelBtn.addEventListener("click", resetForm);

// Function to reset form state
function resetForm() {
  menuForm.reset();
  menuSubmitBtn.textContent = "Add Item";
  menuCancelBtn.classList.add("hidden");
  menuForm.dataset.editId = "";
  menuForm.onsubmit = handleAdd;
}

function handleAdd(e) {
  e.preventDefault();
  // handled in menuForm listener above
}
