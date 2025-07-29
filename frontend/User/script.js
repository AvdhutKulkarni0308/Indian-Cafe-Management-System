// Menu data
const menuCategories = [
  {
    title: "Hot Beverages",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
    items: [
      {
        id: "hb1",
        name: "Masala Chai",
        price: 25,
        description: "Traditional Indian spiced tea with aromatic blend of spices",
      },
      {
        id: "hb2",
        name: "Filter Coffee",
        price: 40,
        description: "Authentic South Indian style coffee decoction with milk",
      },
      { id: "hb3", name: "Adrak Tulsi Chai", price: 30, description: "Refreshing ginger-tulsi tea for immunity" },
      { id: "hb4", name: "Green Tea", price: 35, description: "Pure green tea leaves with natural antioxidants" },
      { id: "hb5", name: "Kesar Badam Milk", price: 60, description: "Rich saffron and almond flavored milk" },
    ],
  },
  {
    title: "Cold Beverages",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="4"/><line x1="10" x2="10" y1="1" y2="4"/><line x1="14" x2="14" y1="1" y2="4"/></svg>`,
    items: [
      { id: "cb1", name: "Cold Coffee", price: 60, description: "Creamy blended coffee with ice cream" },
      { id: "cb2", name: "Ice Tea", price: 50, description: "Refreshing black tea served with ice and lemon" },
      { id: "cb3", name: "Lassi", price: 55, description: "Choose from Sweet, Salted, or Mango flavors" },
      { id: "cb4", name: "Nimbu Pani", price: 30, description: "Refreshing Indian lemonade with mint and spices" },
      { id: "cb5", name: "Mint Mojito", price: 65, description: "Fresh mint leaves muddled with lime and soda" },
    ],
  },
  {
    title: "Snacks & Quick Bites",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 5v3"/><path d="M5 8h14"/><path d="M15.54 11.29l-9.54 9.54"/><path d="M18.5 18.5l-3-3"/><path d="M2 12h10"/><path d="M2 12a10 10 0 0 0 20 0"/><path d="M12 2a10 10 0 0 0-8 4"/></svg>`,
    items: [
      {
        id: "sb1",
        name: "Vada Pav",
        price: 20,
        description: "Mumbai's favorite street food - spiced potato fritter in bun",
      },
      { id: "sb2", name: "Samosa", price: 25, description: "2 pieces of crispy pastry filled with spiced potatoes" },
      {
        id: "sb3",
        name: "Paneer Kathi Roll",
        price: 75,
        description: "Grilled flatbread wrapped with spiced cottage cheese",
      },
      { id: "sb4", name: "Chole Bhature", price: 90, description: "Fluffy fried bread with spiced chickpea curry" },
      {
        id: "sb5",
        name: "Mumbai-Style Sandwich",
        price: 60,
        description: "Grilled sandwich with vegetables and chutney",
      },
      { id: "sb6", name: "Dhokla", price: 45, description: "Steamed Gujarati snack made from fermented batter" },
    ],
  },
  {
    title: "Desserts",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>`,
    items: [
      { id: "d1", name: "Rasmalai", price: 70, description: "Soft cottage cheese dumplings in saffron milk" },
      { id: "d2", name: "Gulab Jamun", price: 55, description: "Deep-fried milk solids in sugar syrup" },
      { id: "d3", name: "Malai Kulfi", price: 45, description: "Traditional Indian ice cream with nuts" },
      { id: "d4", name: "Gajar Ka Halwa", price: 60, description: "Traditional carrot pudding with nuts and cardamom" },
      { id: "d5", name: "Rabri", price: 65, description: "Condensed milk dessert with layers of malai" },
      { id: "d6", name: "Jalebi", price: 40, description: "Crispy spiral sweets soaked in saffron syrup" },
    ],
  },
];

// Cart state
let cart = {
  items: [],
  total: 0,
};

// Add this near the top of your script.js
const broadcastChannel = new BroadcastChannel('menu-update');

broadcastChannel.onmessage = (event) => {
  if (event.data.type === 'UPDATE_MENU') {
    // Reload the menu items
    displayMenuItems('all'); // or whatever your initial category is
  }
};

// ================= DOM Elements =================
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuCategoriesContainer = document.getElementById('menu-categories');
const menuItemsContainer = document.getElementById('menu-items');
const cartContainer = document.getElementById('cart-container');
const cartButton = document.getElementById('cart-button');
const mobileCartButton = document.getElementById('mobile-cart-button');
const cartCount = document.getElementById('cart-count');
const mobileCartCount = document.getElementById('mobile-cart-count');
const currentYearElement = document.getElementById('current-year');
const toastContainer = document.getElementById('toast-container');
const menuList = document.getElementById('menu-list');

// ================= Set Current Year =================
currentYearElement.textContent = new Date().getFullYear();

// ================= Mobile Menu Toggle =================
mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// ================= Init Menu Buttons =================
function initMenuCategories() {
  menuCategoriesContainer.innerHTML = '';

  menuCategories.forEach((category, index) => {
    const button = document.createElement('button');
    button.className = `flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
      index === 0 ? 'bg-orange-700 text-white' : 'bg-white text-gray-700 hover:bg-orange-50'
    }`;
    button.innerHTML = `${category.icon}<span>${category.title}</span>`;

    button.addEventListener('click', () => {
      document.querySelectorAll('#menu-categories button').forEach(btn => {
        btn.classList.remove('bg-orange-700', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-orange-50');
      });
      button.classList.remove('bg-white', 'text-gray-700', 'hover:bg-orange-50');
      button.classList.add('bg-orange-700', 'text-white');

      displayMenuItems(category);
    });

    menuCategoriesContainer.appendChild(button);
  });

  displayMenuItems(menuCategories[0]);
}

// ================= Display Items =================
async function displayMenuItems(category) {
  let dbMenuItems = [];
  try {
    const response = await fetch('http://localhost:5000/menu');
    if (response.ok) {
      dbMenuItems = await response.json();
    }
  } catch (error) {
    console.warn('Backend not available, showing only static items.');
  }

  menuItemsContainer.innerHTML = '';

  // Always show static items, add backend items if available
  const staticItems = menuCategories.find(cat => cat.title === category.title).items;
  const dynamicItems = dbMenuItems.filter(item => item.category === category.title);

  const allItems = [...staticItems, ...dynamicItems];

  if (allItems.length === 0) {
    menuItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">No menu items found.</p>';
    return;
  }

  allItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow';
    itemElement.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-xl font-semibold text-gray-900">${item.name}</h3>
        <span class="text-lg font-medium text-orange-700">₹${item.price}</span>
      </div>
      <p class="text-gray-600 text-sm">${item.description}</p>
      <button class="add-to-cart-btn mt-4 w-full bg-orange-50 text-orange-700 py-2 rounded-md hover:bg-orange-100 transition-colors" 
        data-id="${item._id || item.id}" 
        data-name="${item.name}" 
        data-price="${item.price}">
        Add to Cart
      </button>
    `;
    menuItemsContainer.appendChild(itemElement);
  });

  // Add event listeners for Add to Cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      addToCart({ id, name, price });
    });
  });
}

// ================= Cart Functions =================
function addToCart(item) {
  const existing = cart.items.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ ...item, quantity: 1 });
  }
  cart.total += item.price;
  updateCartDisplay();
  showToast(`${item.name} added to cart`, 'success');
}

function updateQuantity(id, quantity) {
  const item = cart.items.find(i => i.id === id);
  if (!item || quantity < 1) return;
  const diff = quantity - item.quantity;
  item.quantity = quantity;
  cart.total += item.price * diff;
  updateCartDisplay();
}

function removeItem(id) {
  const index = cart.items.findIndex(i => i.id === id);
  if (index === -1) return;
  cart.total -= cart.items[index].price * cart.items[index].quantity;
  cart.items.splice(index, 1);
  updateCartDisplay();
  showToast('Item removed from cart', 'success');
}

function clearCart() {
  cart.items = [];
  cart.total = 0;
  updateCartDisplay();
}

function updateCartDisplay() {
  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  if (count > 0) {
    cartCount.textContent = count;
    cartCount.classList.remove('hidden');
    mobileCartCount.textContent = count;
    mobileCartCount.classList.remove('hidden');
  } else {
    cartCount.classList.add('hidden');
    mobileCartCount.classList.add('hidden');
  }

  if (cartContainer) {
    if (cart.items.length === 0) {
      cartContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
    } else {
      let html = '<div class="space-y-4">';
      cart.items.forEach(item => {
        html += `
          <div class="flex items-center justify-between border-b pb-4">
            <div>
              <h3 class="font-medium">${item.name}</h3>
              <p class="text-gray-600">₹${item.price}</p>
            </div>
            <div class="flex items-center gap-3">
              <button class="quantity-decrease" data-id="${item.id}">-</button>
              <span class="w-8 text-center">${item.quantity}</span>
              <button class="quantity-increase" data-id="${item.id}">+</button>
              <button class="remove-item ml-2 text-red-500" data-id="${item.id}">x</button>
            </div>
          </div>
        `;
      });
      html += '</div><div class="mt-6 border-t pt-4"><div class="flex justify-between text-lg font-semibold"><span>Total:</span><span>₹' + cart.total.toFixed(2) + '</span></div><button id="checkout-button" class="w-full mt-4 bg-orange-700 text-white py-3 rounded-lg hover:bg-orange-800">Checkout</button></div>';
      cartContainer.innerHTML = html;

      document.querySelectorAll('.quantity-decrease').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = cart.items.find(i => i.id === btn.getAttribute('data-id'));
          if (item) updateQuantity(item.id, item.quantity - 1);
        });
      });

      document.querySelectorAll('.quantity-increase').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = cart.items.find(i => i.id === btn.getAttribute('data-id'));
          if (item) updateQuantity(item.id, item.quantity + 1);
        });
      });

      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
          removeItem(btn.getAttribute('data-id'));
        });
      });

      document.getElementById('checkout-button').addEventListener('click', () => {
        checkout();
      });
    }
  }
}

// ================= Checkout Function (Final Version) =================
async function checkout() {
  if (cart.items.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  const total = cart.total;

  try {
    const response = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: "Guest",
        items: cart.items,
        total: total,
      }),
    });

    if (!response.ok) throw new Error("Order submission failed");

    const data = await response.json();
    showToast("Order placed successfully!", "success");
    clearCart();
    console.log("✅ Order saved:", data);
  } catch (error) {
    console.error("❌ Order failed:", error);
    showToast("Something went wrong. Try again!", "error");
  }
}

// ================= Toast Notification =================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

// ================= Cart Scroll Behavior =================
cartButton.addEventListener('click', () => {
  const contactSection = document.getElementById('contact');
  if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
});

mobileCartButton.addEventListener('click', () => {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    mobileMenu.classList.add('hidden');
  }
});

// ================= Draw Menu Items =================
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

// ================= Init =================
document.addEventListener('DOMContentLoaded', () => {
  initMenuCategories();
  updateCartDisplay();
});