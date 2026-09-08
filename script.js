const products = [
  { id: 1, name: "Top Roma", price: 18500, badge: "NUEVO" },
  { id: 2, name: "Jean Siena", price: 32900, badge: "" },
  { id: 3, name: "Remera Basic", price: 14900, badge: "NUEVO" },
  { id: 4, name: "Campera Candy", price: 44500, badge: "" },
  { id: 5, name: "Vestido Olivia", price: 38900, badge: "" },
  { id: 6, name: "Short Denim", price: 25900, badge: "NUEVO" },
  { id: 7, name: "Body Mía", price: 19900, badge: "" },
  { id: 8, name: "Pantalón Urban", price: 34900, badge: "" },
  { id: 9, name: "Musculosa Lola", price: 15900, badge: "" },
  { id: 10, name: "Jean Wide Leg", price: 37900, badge: "NUEVO" },
  { id: 11, name: "Top Candy", price: 16900, badge: "" },
  { id: 12, name: "Pollera Denim", price: 28900, badge: "" }
];

let cart = JSON.parse(localStorage.getItem("cami-cart") || "[]");
let currentProducts = [...products];

const money = value => new Intl.NumberFormat("es-AR", {
  style: "currency", currency: "ARS", maximumFractionDigits: 0
}).format(value);

function productCard(product) {
  const transferPrice = Math.round(product.price * 0.8);
  return `
    <article class="product-card">
      <div class="product-image placeholder-image">
        ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
        <span>FOTO PRODUCTO</span>
        <span class="free-shipping">ENVÍO GRATIS</span>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="price">${money(product.price)}</p>
        <p class="transfer"><strong>${money(transferPrice)}</strong> con TRANSFERENCIA</p>
        <button class="add-btn" data-id="${product.id}">AGREGAR AL CARRITO</button>
      </div>
    </article>`;
}

function renderProducts(list = currentProducts) {
  document.querySelector("#productGrid").innerHTML = list.map(productCard).join("");
  document.querySelector("#featuredGrid").innerHTML = products.slice(0, 8).map(productCard).join("");
  document.querySelector("#productTotal").textContent = `${list.length} productos`;
  bindAddButtons();
}

function bindAddButtons() {
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const found = cart.find(item => item.id === id);
  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  showToast();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function saveCart() {
  localStorage.setItem("cami-cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.querySelector("#cartCount").textContent = count;
  document.querySelector("#cartSubtotal").textContent = money(subtotal);
  const container = document.querySelector("#cartItems");

  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty">El carrito de compras está vacío.</div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-thumb placeholder-image"><span>FOTO</span></div>
      <div><h5>${item.name}</h5><p>${item.qty} × ${money(item.price)}</p></div>
      <button class="remove-item" data-remove="${item.id}">✕</button>
    </div>`).join("");

  container.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.remove)));
  });
}

function openCart() {
  document.querySelector("#cartDrawer").classList.add("open");
  document.querySelector("#overlay").classList.add("show");
  document.querySelector("#cartDrawer").setAttribute("aria-hidden", "false");
}
function closePanels() {
  document.querySelector("#cartDrawer").classList.remove("open");
  document.querySelector("#navMenu").classList.remove("open");
  document.querySelector("#overlay").classList.remove("show");
  document.querySelector("#cartDrawer").setAttribute("aria-hidden", "true");
}
function openSearch() {
  document.querySelector("#searchPanel").classList.add("open");
  setTimeout(() => document.querySelector("#searchInput").focus(), 80);
}
function showToast() {
  const toast = document.querySelector("#toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

document.querySelector("#cartBtn").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closePanels);
document.querySelector("#overlay").addEventListener("click", closePanels);
document.querySelector("#menuBtn").addEventListener("click", () => {
  document.querySelector("#navMenu").classList.add("open");
  document.querySelector("#overlay").classList.add("show");
});
document.querySelectorAll("#navMenu a").forEach(a => a.addEventListener("click", closePanels));

document.querySelector("#searchBtn").addEventListener("click", openSearch);
document.querySelector("#mobileSearchBtn").addEventListener("click", openSearch);
document.querySelector("#closeSearch").addEventListener("click", () => document.querySelector("#searchPanel").classList.remove("open"));

document.querySelector("#searchInput").addEventListener("input", e => {
  const term = e.target.value.trim().toLowerCase();
  currentProducts = products.filter(p => p.name.toLowerCase().includes(term));
  renderProducts(currentProducts);
});

document.querySelector("#sortSelect").addEventListener("change", e => {
  const sorted = [...currentProducts];
  if (e.target.value === "low") sorted.sort((a,b) => a.price-b.price);
  if (e.target.value === "high") sorted.sort((a,b) => b.price-a.price);
  if (e.target.value === "name") sorted.sort((a,b) => a.name.localeCompare(b.name));
  renderProducts(sorted);
});

document.querySelector("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("¡Gracias por suscribirte!");
  e.target.reset();
});

renderProducts();
renderCart();
