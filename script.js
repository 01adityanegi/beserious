/* ══════════════════════════════════════════════════════════
   BE SERIOUS — E-Commerce Engine
   Cart, Checkout, Router, Search, Email via Google Apps Script
   ══════════════════════════════════════════════════════════ */

// ─── GOOGLE APPS SCRIPT URL ─────────────────────────────
// Deploy the Google Apps Script and paste the URL here:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwK7D47PNwP1WwRjCk_k2cdqkcYT8_3mQbmRMipjJ6KHgg3sHxbJ6Rv9MIPX01zU1gD/exec';

// ─── PRODUCT CATALOG ────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: 'The Essential Tee', price: 599, category: 'essentials', badge: 'NEW', desc: 'Our essential everyday tee.', colors: ['#1A1A1A', '#FFFFFF'], colorNames: ['Black', 'White'], sizes: ['S', 'M', 'L', 'XL'], images: ['assets/product_pic/tshirt.png', 'assets/product_pic/tshirt.png'] },
  { id: 2, name: 'Classic Crewneck', price: 649, category: 'essentials', badge: 'BESTSELLER', desc: 'A timeless crewneck fit.', colors: ['#FFFFFF', '#1A1A1A'], colorNames: ['White', 'Black'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], images: ['assets/product_pic/tshirt2.png', 'assets/product_pic/tshirt2.png'] },
  { id: 3, name: 'Signature Heavyweight', price: 999, compareAtPrice: 1249, category: 'limited', badge: '20% OFF', desc: 'Premium heavyweight fabric.', colors: ['#1A1A1A'], colorNames: ['Black'], sizes: ['S', 'M', 'L', 'XL'], images: ['assets/product_pic/mainmodel1.png', 'assets/product_pic/mainmodel1.png'] },
  { id: 4, name: 'Premium Model Fit', price: 999, compareAtPrice: 1249, category: 'limited', badge: '20% OFF', desc: 'Impeccable drape and comfort.', colors: ['#2C3E50', '#1A1A1A'], colorNames: ['Navy', 'Black'], sizes: ['M', 'L', 'XL'], images: ['assets/product_pic/mainmodel2.png', 'assets/product_pic/mainmodel2.png'] },
  { id: 5, name: 'Oversized Drop Shoulder', price: 699, category: 'essentials', badge: 'NEW', desc: 'Relaxed streetwear silhouette.', colors: ['#4A5E3D', '#1A1A1A'], colorNames: ['Olive', 'Black'], sizes: ['S', 'M', 'L'], images: ['assets/product_pic/girlt-shirt.png', 'assets/product_pic/girlt-shirt.png'] },
  { id: 6, name: 'Boxy Fit Silhouette', price: 699, category: 'essentials', badge: 'BESTSELLER', desc: 'Designed for movement.', colors: ['#FFFFFF'], colorNames: ['White'], sizes: ['S', 'M', 'L', 'XL'], images: ['assets/product_pic/girltshirt.png', 'assets/product_pic/girltshirt.png'] },
  { id: 7, name: 'Studio Collection Tee', price: 999, compareAtPrice: 1249, category: 'limited', badge: '20% OFF', desc: 'Crafted for creators.', colors: ['#1A1A1A', '#FFFFFF'], colorNames: ['Black', 'White'], sizes: ['M', 'L', 'XL', 'XXL'], images: ['assets/product_pic/mainmodel4.png', 'assets/product_pic/mainmodel4.png'] },
  { id: 8, name: 'Urban Aesthetic', price: 999, compareAtPrice: 1249, category: 'limited', badge: '20% OFF', desc: 'Bold and confident.', colors: ['#1A1A1A'], colorNames: ['Black'], sizes: ['S', 'M', 'L', 'XL'], images: ['assets/product_pic/mainmodel3.png', 'assets/product_pic/mainmodel3.png'] },
  { id: 9, name: 'Limited Supermodel Edition', price: 1299, category: 'statement', badge: 'LIMITED', desc: 'Highly sought after.', colors: ['#1A1A1A'], colorNames: ['Black'], sizes: ['M', 'L'], images: ['assets/product_pic/supermodel.png', 'assets/product_pic/supermodel.png'] },
  { id: 10, name: 'Midnight Edition', price: 999, compareAtPrice: 1249, category: 'limited', badge: '20% OFF', desc: 'Dark and mysterious.', colors: ['#1A1A1A'], colorNames: ['Black'], sizes: ['S', 'M', 'L', 'XL'], images: ['assets/product_pic/mainmodel5.png', 'assets/product_pic/mainmodel5.png'] },
  { id: 11, name: 'Graphic Print Base', price: 599, category: 'statement', badge: 'BESTSELLER', desc: 'Make your mark.', colors: ['#FFFFFF'], colorNames: ['White'], sizes: ['S', 'M', 'L', 'XL'], images: ['assets/product_pic/t-shirt1.png', 'assets/product_pic/t-shirt1.png'] },
  { id: 12, name: 'Everyday Casual', price: 649, category: 'essentials', badge: 'BESTSELLER', desc: 'For every occasion.', colors: ['#1A1A1A', '#FFFFFF'], colorNames: ['Black', 'White'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], images: ['assets/product_pic/girltshirt2.png', 'assets/product_pic/girltshirt2.png'] }
];

// ─── ADD DUMMY REVIEWS ──────────────────────────────────
PRODUCTS.forEach(p => {
  // Generate a random rating between 4.2 and 5.0
  p.rating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
  p.reviewCount = Math.floor(Math.random() * 200) + 15;
  p.reviews = [
    { name: "Rahul S.", rating: 5, text: "Amazing quality, fits perfectly! Will buy again." },
    { name: "Aditi M.", rating: 4, text: "Really good fabric. Color is exactly as shown." },
    { name: "Vikram K.", rating: 5, text: "Best t-shirt I've bought recently. Very comfortable." }
  ];
  // Add a 4-star review occasionally based on the random rating
  if (p.rating < 4.8) {
    p.reviews[2].rating = 4;
    p.reviews[2].text = "Good, but the size runs slightly large.";
  }
});

// ─── STATE ──────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('bs-cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('bs-wishlist') || '[]');

// ─── DOM REFS ───────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ─── ROUTER ─────────────────────────────────────────────
function router() {
  const hash = location.hash || '#home';
  const [page, params] = hash.split('?');
  const route = page.replace('#', '');

  // Hide all pages
  $$('.page').forEach(p => p.classList.remove('active'));

  // Close mobile menu
  $('mobileMenu')?.classList.remove('open');
  $('menuToggle')?.classList.remove('open');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (route.startsWith('product-')) {
    const id = parseInt(route.replace('product-', ''));
    $('page-product').classList.add('active');
    renderProductDetail(id);
  } else if (route === 'shop') {
    $('page-shop').classList.add('active');
    const filter = new URLSearchParams(params).get('filter') || 'all';
    renderShop(filter);
  } else if (route === 'cart') {
    $('page-cart').classList.add('active');
    renderCartPage();
  } else if (route === 'checkout') {
    $('page-checkout').classList.add('active');
    renderCheckout();
  } else if (route === 'confirmed') {
    $('page-confirmed').classList.add('active');
  } else if (route === 'track') {
    $('page-track').classList.add('active');
    renderRecentOrders();
  } else if (route === 'invoice') {
    $('page-invoice').classList.add('active');
    const orderId = new URLSearchParams(params).get('id');
    renderInvoice(orderId);
  } else {
    $('page-home').classList.add('active');
    renderFeatured();
  }

  // Re-init reveals for newly visible content
  requestAnimationFrame(initReveal);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  router();
  updateCartUI();
  initNavbar();
  initMobileMenu();
  initSearch();
  initCartDrawer();
  initNewsletter();
  initReveal();
  initHeroScroll();
});

// ─── PRODUCT CARD RENDERER ──────────────────────────────
function createProductCard(product) {
  const isWished = wishlist.includes(product.id);
  const badgeClass = product.badge === 'BESTSELLER' ? 'bestseller' :
    product.badge === 'LIMITED' ? 'sold' : '';

  return `
    <div class="product-card" data-id="${product.id}" onclick="navigateProduct(${product.id})">
      <div class="pc-img-wrap">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy" width="400" height="533"/>
        ${product.badge ? `<span class="pc-badge ${badgeClass}">${product.badge}</span>` : ''}
        <button class="pc-wishlist ${isWished ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id}, this)" aria-label="Wishlist" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <button class="pc-quick-add" onclick="event.stopPropagation(); quickAdd(${product.id})" type="button">QUICK ADD — ₹${product.price.toLocaleString('en-IN')}</button>
      </div>
      <div class="pc-info">
        <p class="pc-name">${product.name}</p>
        <div class="pc-rating" style="font-size: 13px; color: #f59e0b; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span style="color: var(--text-dark); font-weight: 500;">${product.rating}</span>
          <span style="color: var(--text-muted); margin-left: 2px;">(${product.reviewCount})</span>
        </div>
        <p class="pc-price" style="margin-top: 4px;">
          ₹${product.price.toLocaleString('en-IN')}
          ${product.compareAtPrice ? `<span style="text-decoration:line-through; opacity:0.5; font-size:0.85em; margin-left:6px;">₹${product.compareAtPrice.toLocaleString('en-IN')}</span>` : ''}
        </p>
        <div class="pc-colors">
          ${product.colors.map(c => `<span class="pc-color-dot" style="background:${c}"></span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function navigateProduct(id) {
  location.hash = `#product-${id}`;
}

// ─── FEATURED GRID (HOME PAGE) ──────────────────────────
function renderFeatured() {
  const grid = $('featuredGrid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.badge === 'BESTSELLER' || p.badge === 'NEW' || p.badge === '20% OFF').slice(0, 12);
  grid.innerHTML = featured.map(createProductCard).join('');
}

// ─── SHOP PAGE ──────────────────────────────────────────
function renderShop(filter = 'all') {
  const grid = $('shopGrid');
  if (!grid) return;

  // Update active filter button
  $$('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  let filtered = [...PRODUCTS];
  if (filter === 'new') filtered = PRODUCTS.filter(p => p.badge === 'NEW');
  else if (filter === 'bestseller') filtered = PRODUCTS.filter(p => p.badge === 'BESTSELLER');
  else if (filter === 'limited') filtered = PRODUCTS.filter(p => p.badge === 'LIMITED');

  // Sort
  const sort = $('sortSelect')?.value || 'default';
  if (sort === 'low') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'high') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = filtered.map(createProductCard).join('');
  $('shopCount').textContent = `${filtered.length} Product${filtered.length !== 1 ? 's' : ''}`;
}

// Filter buttons
document.addEventListener('click', e => {
  if (e.target.classList.contains('filter-btn')) {
    const filter = e.target.dataset.filter;
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderShop(filter);
  }
});

// Sort
$('sortSelect')?.addEventListener('change', () => {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  renderShop(activeFilter);
});

// ─── PRODUCT DETAIL ─────────────────────────────────────
let selectedSize = '';
let selectedColor = '';

function renderProductDetail(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  selectedSize = '';
  selectedColor = product.colorNames[0];
  $('pdSelectedColorLabel').textContent = selectedColor;

  // Main image
  $('pdMainImg').innerHTML = `<img src="${product.images[0]}" alt="${product.name}" width="600" height="800"/>`;

  // Thumbs
  $('pdThumbs').innerHTML = product.images.map((img, i) =>
    `<div class="pd-thumb ${i === 0 ? 'active' : ''}" onclick="switchImage(this, '${img}')">
      <img src="${img}" alt="${product.name} view ${i + 1}" width="72" height="90"/>
    </div>`
  ).join('');

  // Info
  $('pdBadge').textContent = product.badge;
  $('pdName').textContent = product.name;
  $('pdPrice').innerHTML = `₹${product.price.toLocaleString('en-IN')} ${product.compareAtPrice ? `<span style="text-decoration:line-through; opacity:0.5; font-size:0.85em; margin-left:6px;">₹${product.compareAtPrice.toLocaleString('en-IN')}</span>` : ''}`;
  $('pdDesc').textContent = product.desc;

  // Colors
  $('pdColorOptions').innerHTML = product.colors.map((c, i) =>
    `<button class="pd-color-opt ${i === 0 ? 'active' : ''}" style="background:${c}" 
     onclick="selectColor(this, '${product.colorNames[i]}')" 
     title="${product.colorNames[i]}" type="button"></button>`
  ).join('');

  // Sizes
  $('pdSizeOptions').innerHTML = product.sizes.map(s =>
    `<button class="pd-size-opt" onclick="selectSize(this, '${s}')" type="button">${s}</button>`
  ).join('');

  // Add to cart button
  const addBtn = $('pdAddCart');
  addBtn.textContent = 'ADD TO BAG';
  addBtn.classList.remove('added');
  addBtn.onclick = () => addToCartFromDetail(product);

  // Related products
  const related = PRODUCTS.filter(p => p.id !== id).sort(() => 0.5 - Math.random()).slice(0, 4);
  $('relatedGrid').innerHTML = related.map(createProductCard).join('');

  // Reviews Header
  const starsHtml = renderStars(product.rating);
  $('pdStars').innerHTML = starsHtml;
  $('pdRatingText').textContent = product.rating;
  $('pdReviewCount').textContent = `(${product.reviewCount} Reviews)`;

  // Reviews Section
  $('pdReviewsAvgStars').innerHTML = starsHtml;
  $('pdReviewsAvgText').textContent = `${product.rating} out of 5`;
  $('pdReviewsTotalCount').textContent = `Based on ${product.reviewCount} reviews`;
  
  $('pdReviewsList').innerHTML = product.reviews.map(r => `
    <div style="padding-bottom: 24px; border-bottom: 1px solid var(--border-light);">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--text-dark);">
          ${r.name.charAt(0)}
        </div>
        <div>
          <p style="font-weight: 600; color: var(--text-dark); margin: 0;">${r.name} <svg width="14" height="14" viewBox="0 0 24 24" fill="#4cba2c" style="vertical-align: middle; margin-left: 4px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></p>
          <div style="color: #f59e0b; font-size: 12px; letter-spacing: 2px;">${renderStars(r.rating)}</div>
        </div>
      </div>
      <p style="color: var(--text); line-height: 1.5; margin: 0;">${r.text}</p>
    </div>
  `).join('');
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  let html = '';
  for (let i = 0; i < fullStars; i++) html += '★';
  for (let i = 0; i < emptyStars; i++) html += '☆';
  return html;
}

function switchImage(thumb, src) {
  $$('.pd-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  $('pdMainImg').innerHTML = `<img src="${src}" alt="Product view" width="600" height="800"/>`;
}

function selectSize(el, size) {
  $$('.pd-size-opt').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  selectedSize = size;
}

function selectColor(el, color) {
  $$('.pd-color-opt').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  selectedColor = color;
  $('pdSelectedColorLabel').textContent = color;
}

function addToCartFromDetail(product) {
  if (!selectedSize) {
    showToast('Please select a size');
    return;
  }

  const item = {
    id: product.id,
    name: product.name,
    price: product.price,
    size: selectedSize,
    color: selectedColor,
    image: product.images[0],
    qty: 1
  };

  addToCart(item);

  const btn = $('pdAddCart');
  btn.textContent = '✓ ADDED TO BAG';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'ADD TO BAG';
    btn.classList.remove('added');
  }, 2000);
}

function quickAdd(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const item = {
    id: product.id,
    name: product.name,
    price: product.price,
    size: 'M',
    color: product.colorNames[0],
    image: product.images[0],
    qty: 1
  };

  addToCart(item);
  openCartDrawer();
}

// ─── CART MANAGEMENT ────────────────────────────────────
function addToCart(item) {
  const existing = cart.find(c => c.id === item.id && c.size === item.size && c.color === item.color);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push(item);
  }
  saveCart();
  updateCartUI();
  showToast(`${item.name} added to bag`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  renderCartDrawer();
  renderCartPage();
}

function updateQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  updateCartUI();
  renderCartDrawer();
  renderCartPage();
}

function saveCart() {
  localStorage.setItem('bs-cart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const countEl = $('cartCount');
  if (countEl) {
    countEl.textContent = count;
    countEl.classList.toggle('show', count > 0);
  }
}

// ─── WISHLIST ───────────────────────────────────────────
function toggleWishlist(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    showToast('Removed from wishlist');
  } else {
    wishlist.push(id);
    btn.classList.add('active');
    showToast('Added to wishlist');
  }
  localStorage.setItem('bs-wishlist', JSON.stringify(wishlist));
}

// ─── CART DRAWER ────────────────────────────────────────
function initCartDrawer() {
  $('navCartBtn')?.addEventListener('click', e => {
    e.preventDefault();
    openCartDrawer();
  });
  $('drawerClose')?.addEventListener('click', closeCartDrawer);
  $('cartDrawerOverlay')?.addEventListener('click', closeCartDrawer);
  $('drawerCheckoutBtn')?.addEventListener('click', () => {
    closeCartDrawer();
    location.hash = '#checkout';
  });
}

function openCartDrawer() {
  renderCartDrawer();
  $('cartDrawer')?.classList.add('open');
  $('cartDrawerOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  $('cartDrawer')?.classList.remove('open');
  $('cartDrawerOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const body = $('drawerBody');
  const empty = $('drawerEmpty');
  const footer = $('drawerFooter');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = '<p class="drawer-empty">Your bag is empty</p>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  body.innerHTML = cart.map((item, i) => `
    <div class="drawer-item">
      <img class="drawer-item-img" src="${item.image}" alt="${item.name}" width="80" height="100"/>
      <div class="drawer-item-info">
        <p class="drawer-item-name">${item.name}</p>
        <p class="drawer-item-meta">Size: ${item.size} | Color: ${item.color}</p>
        <p class="drawer-item-price">₹${item.price.toLocaleString('en-IN')}</p>
        <div class="drawer-item-actions">
          <button class="qty-btn" onclick="updateQty(${i}, -1)" type="button">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${i}, 1)" type="button">+</button>
          <button class="drawer-item-remove" onclick="removeFromCart(${i})" type="button">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  $('drawerTotal').textContent = `₹${getCartTotal().toLocaleString('en-IN')}`;
}

// ─── CART PAGE ──────────────────────────────────────────
function renderCartPage() {
  const items = $('cartItems');
  const summary = $('cartSummary');
  const empty = $('cartEmpty');
  if (!items) return;

  if (cart.length === 0) {
    items.innerHTML = '<p class="cart-empty">Your bag is empty. <a href="#shop">Continue shopping</a></p>';
    summary.style.display = 'none';
    return;
  }

  summary.style.display = 'block';
  items.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" width="100" height="130"/>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">Size: ${item.size} | Color: ${item.color}</p>
        <p class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</p>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateQty(${i}, -1)" type="button">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${i}, 1)" type="button">+</button>
          <button class="cart-item-remove" onclick="removeFromCart(${i})" type="button">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  const total = getCartTotal();
  const shipping = total >= 999 ? 0 : 49;
  $('cartSubtotal').textContent = `₹${total.toLocaleString('en-IN')}`;
  $('cartShipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
  $('cartTotal').textContent = `₹${(total + shipping).toLocaleString('en-IN')}`;
}

// ─── CHECKOUT ───────────────────────────────────────────
function renderCheckout() {
  const coItems = $('coItems');
  if (!coItems || cart.length === 0) return;

  coItems.innerHTML = cart.map(item => `
    <div class="co-item">
      <img src="${item.image}" alt="${item.name}" width="60" height="75"/>
      <div class="co-item-info">
        <h4>${item.name}</h4>
        <p>Size: ${item.size} | Color: ${item.color} | Qty: ${item.qty}</p>
        <p class="co-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</p>
      </div>
    </div>
  `).join('');

  const total = getCartTotal();
  const shipping = total >= 999 ? 0 : 49;
  $('coSubtotal').textContent = `₹${total.toLocaleString('en-IN')}`;
  $('coShipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
  $('coTotal').textContent = `₹${(total + shipping).toLocaleString('en-IN')}`;
}

let pendingOrderData = null;
let currentOtp = null;

// Checkout form submission
$('checkoutForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = $('coEmail').value;
  $('otpEmailDisplay').textContent = email;

  // Generate random 6-digit OTP
  currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save form state
  pendingOrderData = {
    name: $('coName').value,
    phone: $('coPhone').value,
    email: email,
    address: $('coAddress').value,
    city: $('coCity').value,
    state: $('coState').value,
    pincode: $('coPincode').value
  };

  // Show OTP Modal
  $('otpModal').classList.add('active');
  $('otpInput').value = '';
  $('otpError').textContent = 'Sending OTP...';

  // EmailJS API CALL
  emailjs.send("service_8ptze0c", "template_z7w77nz", {
    user_email: email,
    otp_code: currentOtp,
  })
  .then(function(response) {
     console.log('SUCCESS!', response.status, response.text);
     $('otpError').textContent = 'OTP sent to your email successfully.';
     $('otpError').style.color = '#4cba2c'; // Make success message green
  }, function(error) {
     console.error('FAILED...', error);
     // error is usually an object { status, text } in EmailJS
     const errMsg = error.text || error.message || 'Unknown EmailJS error';
     $('otpError').textContent = 'Error: ' + errMsg;
     $('otpError').style.color = '#dc3545'; // Ensure error is red
     console.log(`[TESTING] Your OTP is: ${currentOtp}`);
  });
});

// Cancel OTP
$('cancelOtpBtn')?.addEventListener('click', () => {
  $('otpModal').classList.remove('active');
  pendingOrderData = null;
});

// Verify OTP & Place Order
$('verifyOtpBtn')?.addEventListener('click', async () => {
  const enteredOtp = $('otpInput').value.trim();
  
  if (!enteredOtp) {
    $('otpError').textContent = 'Please enter the OTP';
    return;
  }
  
  if (enteredOtp !== currentOtp) {
    $('otpError').textContent = 'Invalid OTP. Please try again.';
    return;
  }

  // OTP is correct - Proceed to place order
  $('otpError').textContent = '';
  $('otpModal').classList.remove('active');

  const btn = $('placeOrderBtn');
  const oldBtnText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'PLACING ORDER...';

  const total = getCartTotal();
  const shipping = total >= 999 ? 0 : 49;

  const order = {
    orderId: 'BS-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    date: new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' }),
    customer: pendingOrderData,
    items: cart.map(item => ({
      name: item.name,
      size: item.size,
      color: item.color,
      qty: item.qty,
      price: item.price * item.qty
    })),
    subtotal: total,
    shipping: shipping === 0 ? 'FREE' : `₹${shipping}`,
    total: total + shipping,
    payment: 'Cash on Delivery\n\n(product is from messho)'
  };

  // Save order locally
  const orders = JSON.parse(localStorage.getItem('bs-orders') || '[]');
  orders.push({ ...order, status: 'Order Placed', timestamp: Date.now() });
  localStorage.setItem('bs-orders', JSON.stringify(orders));

  // Format the email body directly in the frontend
  let emailBody = `A new order has been placed on BE SERIOUS.\n\n`;
  emailBody += `--- ORDER SUMMARY ---\n`;
  emailBody += `Order ID: ${order.orderId}\n`;
  emailBody += `Date: ${order.date}\n\n`;
  
  emailBody += `--- CUSTOMER DETAILS ---\n`;
  emailBody += `Name: ${order.customer.name}\n`;
  emailBody += `Phone: ${order.customer.phone}\n`;
  emailBody += `Email: ${order.customer.email}\n`;
  emailBody += `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}\n\n`;
  
  emailBody += `--- ITEMS ---\n`;
  order.items.forEach((item, index) => {
    emailBody += `${index + 1}. ${item.name}\n`;
    emailBody += `   Size: ${item.size} | Color: ${item.color} | Qty: ${item.qty} | Price: ₹${item.price.toLocaleString('en-IN')}\n`;
  });
  
  emailBody += `\n--- PAYMENT ---\n`;
  emailBody += `Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}\n`;
  emailBody += `Shipping: ${order.shipping}\n`;
  emailBody += `Total: ₹${order.total.toLocaleString('en-IN')}\n`;
  emailBody += `Method: ${order.payment}\n`;

  const formData = new URLSearchParams();
  formData.append('name', order.customer.name);
  formData.append('email', order.customer.email);
  formData.append('phoneno', order.customer.phone);
  formData.append('_subject', `BE SERIOUS: New Order Received (${order.orderId})`);
  formData.append('message', emailBody);

  // Send email via Google Apps Script
  try {
    if (APPS_SCRIPT_URL) {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
    }
  } catch (err) {
    console.log('Email notification skipped:', err);
  }

  // Clear cart
  cart = [];
  saveCart();
  updateCartUI();

  // Show confirmation
  $('confirmOrderId').textContent = order.orderId;
  $('confirmEmail').textContent = order.customer.email;
  $('viewInvoiceBtn').href = `#invoice?id=${order.orderId}`;
  
  // Show animated popup modal
  $('orderSuccessModal').classList.add('active');
  
  location.hash = '#confirmed';

  btn.disabled = false;
  btn.textContent = 'PLACE ORDER — COD';
  $('checkoutForm').reset();
  pendingOrderData = null;
  currentOtp = null;
});

// Close Custom Modal
$('closeModalBtn')?.addEventListener('click', () => {
  $('orderSuccessModal').classList.remove('active');
});

// ─── TRACK ORDER ────────────────────────────────────────
$('trackBtn')?.addEventListener('click', () => {
  const orderId = $('trackInput').value.trim().toUpperCase();
  const orders = JSON.parse(localStorage.getItem('bs-orders') || '[]');
  const order = orders.find(o => o.orderId === orderId);
  const result = $('trackResult');

  if (!order) {
    result.innerHTML = '<p style="color:var(--text-muted);padding:24px 0">No order found with this ID. Please check and try again.</p>';
    return;
  }

  result.innerHTML = `
    <div class="track-order-card">
      <h3>Order ${order.orderId}</h3>
      <p>Date: <strong>${order.date}</strong></p>
      <p>Name: <strong>${order.customer.name}</strong></p>
      <p>Phone: <strong>${order.customer.phone}</strong></p>
      <p>Delivery: <strong>${order.customer.address}, ${order.customer.city}, ${order.customer.state} — ${order.customer.pincode}</strong></p>
      <p>Payment: <strong>${order.payment}</strong></p>
      <p>Total: <strong>₹${order.total.toLocaleString('en-IN')}</strong></p>
      <span class="track-status">${order.status}</span>
      <ul class="track-items">
        ${order.items.map(item => `<li>${item.name} — Size ${item.size}, ${item.color} × ${item.qty} — ₹${item.price.toLocaleString('en-IN')}</li>`).join('')}
      </ul>
      <a href="#invoice?id=${order.orderId}" class="btn-outline-dark" style="display: block; width: 100%; text-align: center; margin-top: 20px; font-size: 11px; padding: 12px; text-decoration: none;">VIEW INVOICE</a>
    </div>
  `;
});

function renderRecentOrders() {
  const orders = JSON.parse(localStorage.getItem('bs-orders') || '[]');
  const section = $('recentOrdersSection');
  const list = $('recentOrdersList');
  if (!section || !list) return;

  if (orders.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  const sortedOrders = [...orders].reverse();

  list.innerHTML = sortedOrders.map(order => `
    <div class="track-order-card" style="margin: 0; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <h3 style="margin: 0;">Order ${order.orderId}</h3>
        <span class="track-status" style="margin: 0; font-size: 11px;">${order.status || 'Order Placed'}</span>
      </div>
      <p>Date: <strong>${order.date}</strong></p>
      <p>Total: <strong>₹${order.total.toLocaleString('en-IN')}</strong></p>
      <p style="margin-top: 8px;">Delivery to: ${order.customer.city}, ${order.customer.state}</p>
      <div style="display: flex; gap: 8px; margin-top: 16px;">
        <button class="btn-outline-dark" style="flex: 1; font-size: 11px; padding: 12px;" type="button" onclick="trackOrderDirect('${order.orderId}')">VIEW DETAILS</button>
        <a href="#invoice?id=${order.orderId}" class="btn-primary-dark" style="flex: 1; font-size: 11px; padding: 12px; text-align: center; text-decoration: none;">INVOICE</a>
      </div>
    </div>
  `).join('');
}

function trackOrderDirect(orderId) {
  $('trackInput').value = orderId;
  $('trackBtn').click();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── NAVBAR ─────────────────────────────────────────────
function initNavbar() {
  const navbar = $('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ─── MOBILE MENU ────────────────────────────────────────
function initMobileMenu() {
  const toggle = $('menuToggle');
  const menu = $('mobileMenu');

  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  $$('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('open');
      toggle?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── SEARCH ─────────────────────────────────────────────
function initSearch() {
  $('searchToggle')?.addEventListener('click', () => {
    $('searchOverlay').classList.add('open');
    setTimeout(() => $('searchInput').focus(), 100);
  });

  $('searchClose')?.addEventListener('click', () => {
    $('searchOverlay').classList.remove('open');
    $('searchInput').value = '';
    $('searchResults').innerHTML = '';
  });

  $('searchInput')?.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    if (q.length < 2) {
      $('searchResults').innerHTML = '';
      return;
    }

    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );

    $('searchResults').innerHTML = results.length ? results.map(p => `
      <div class="search-result-item" onclick="location.hash='#product-${p.id}'; document.getElementById('searchOverlay').classList.remove('open');">
        <img src="${p.images[0]}" alt="${p.name}" width="60" height="75"/>
        <div class="search-result-info">
          <h4>${p.name}</h4>
          <p>₹${p.price.toLocaleString('en-IN')}</p>
        </div>
      </div>
    `).join('') : '<p style="color:var(--text-muted);padding:16px 0">No products found</p>';
  });

  // ESC to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      $('searchOverlay')?.classList.remove('open');
    }
  });
}

// ─── NEWSLETTER ─────────────────────────────────────────
function initNewsletter() {
  $('nlForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = $('nlEmail').value;
    showToast('Thanks for subscribing! ✦');
    this.reset();

    // Send to Google Apps Script
    if (APPS_SCRIPT_URL) {
      const formData = new URLSearchParams();
      formData.append('name', 'Newsletter Subscriber');
      formData.append('email', email);
      formData.append('phoneno', 'N/A');
      formData.append('_subject', 'BE SERIOUS: New Newsletter Subscriber');
      formData.append('message', `You have a new subscriber!\n\nEmail: ${email}\nDate: ${new Date().toLocaleString('en-IN')}`);

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      }).catch(() => { });
    }
  });
}

// ─── REVEAL ON SCROLL ───────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.d || 0);
      setTimeout(() => entry.target.classList.add('in'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  $$('.reveal').forEach(el => {
    if (!el.classList.contains('in')) observer.observe(el);
  });
}

// ─── HERO CINEMATIC SCROLL (CANVAS) ─────────────────────────
function initHeroScroll() {
  const canvas = document.getElementById('heroCanvas');
  const hero = document.getElementById('heroCinema');
  const content = document.querySelector('.hc-content');
  const bottomText = document.querySelector('.hc-bottom-text');

  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');

  const frameCount = 300;

  // Pad number to 3 digits e.g. 001
  const currentFrame = index => (
    `assets/banner-pic/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
  );

  const images = [];
  let imagesLoaded = 0;
  const img = new Image();
  img.src = currentFrame(1);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Preload frames
  for (let i = 1; i <= frameCount; i++) {
    const preImg = new Image();
    preImg.src = currentFrame(i);
    images.push(preImg);
    preImg.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === 1) { // Draw first frame ASAP
        renderFrame(0);
      }
    };
  }

  // Draw scaled image to act like object-fit: cover
  function renderFrame(index) {
    if (!images[index] || !images[index].complete) return;
    const imgObj = images[index];

    // Scale logic for cover
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = imgObj.width / imgObj.height;
    let renderWidth, renderHeight, x, y;

    if (canvasRatio > imgRatio) {
      renderWidth = canvas.width;
      renderHeight = canvas.width / imgRatio;
      x = 0;
      y = (canvas.height - renderHeight) / 2;
    } else {
      renderWidth = canvas.height * imgRatio;
      renderHeight = canvas.height;
      x = (canvas.width - renderWidth) / 2;
      y = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgObj, x, y, renderWidth, renderHeight);
  }

  // Resize handler
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Re-render current frame based on scroll
    updateScroll();
  });

  // Scroll mapping
  function updateScroll() {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = hero.scrollHeight - window.innerHeight;

    if (scrollTop > hero.scrollHeight) return; // Out of bounds

    const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(scrollFraction * frameCount)
    );

    requestAnimationFrame(() => {
      renderFrame(frameIndex);

      // Sequence 1: 0.00 to 0.25
      const s1 = document.getElementById('slide1');
      if (s1) {
        if (scrollFraction >= 0 && scrollFraction < 0.25) {
          let p = 1 - Math.abs(scrollFraction - 0.125) / 0.125;
          s1.style.opacity = p;
          s1.style.transform = `translateY(calc(-50% + ${(1 - p) * 40}px))`;
        } else {
          s1.style.opacity = 0;
        }
      }

      // Sequence 2: 0.25 to 0.50 (Bottom Right)
      const s2 = document.getElementById('slide2');
      if (s2) {
        if (scrollFraction >= 0.25 && scrollFraction < 0.50) {
          let p = 1 - Math.abs(scrollFraction - 0.375) / 0.125;
          s2.style.opacity = p;
          s2.style.transform = `translateY(${(1 - p) * 40}px)`;
        } else {
          s2.style.opacity = 0;
        }
      }

      // Sequence 3: 0.50 to 0.75
      const s3 = document.getElementById('slide3');
      if (s3) {
        if (scrollFraction >= 0.50 && scrollFraction < 0.75) {
          let p = 1 - Math.abs(scrollFraction - 0.625) / 0.125;
          s3.style.opacity = p;
          s3.style.transform = `translateY(calc(-50% + ${(1 - p) * 40}px))`;
        } else {
          s3.style.opacity = 0;
        }
      }

      // Make final text appear at the END of the sequence
      let progress = Math.max(0, Math.min(1, (scrollFraction - 0.75) / 0.25));

      if (content) {
        let yOffset = (1 - progress) * 100;
        content.style.transform = `translateY(calc(-50% + ${yOffset}px))`;
        content.style.opacity = progress;
        content.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
      }

      if (bottomText) {
        let yOffset = (1 - progress) * 50;
        bottomText.style.transform = `translateY(${yOffset}px)`;
        bottomText.style.opacity = progress;
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial draw
  img.onload = () => {
    renderFrame(0);
  };
}

// ─── TOAST ──────────────────────────────────────────────
function showToast(msg) {
  const toast = $('toast');
  $('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');

  // Don't interfere with router hash links
  if (href.startsWith('#page-') || href === '#') return;
});

// ─── INVOICE RENDERER ───────────────────────────────────
function renderInvoice(orderId) {
  if (!orderId) {
    location.hash = '#home';
    return;
  }
  
  const orders = JSON.parse(localStorage.getItem('bs-orders') || '[]');
  const order = orders.find(o => o.orderId === orderId);
  
  if (!order) {
    alert('Invoice not found');
    location.hash = '#home';
    return;
  }

  $('invOrderId').textContent = order.orderId;
  $('invDate').textContent = order.date;
  $('invName').textContent = order.customer.name;
  $('invAddress').textContent = `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;
  $('invEmailPhone').textContent = `${order.customer.email} | ${order.customer.phone}`;
  
  const itemsHtml = order.items.map(item => `
    <tr>
      <td>
        <strong>${item.name}</strong><br>
        <span style="font-size: 13px; color: var(--text-light)">Size: ${item.size} | Color: ${item.color}</span>
      </td>
      <td style="text-align: center;">${item.qty}</td>
      <td style="text-align: right;">₹${(item.price / item.qty).toLocaleString('en-IN')}</td>
      <td style="text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');
  
  $('invItems').innerHTML = itemsHtml;
  
  $('invSubtotal').textContent = `₹${order.subtotal.toLocaleString('en-IN')}`;
  $('invShipping').textContent = order.shipping;
  $('invTotal').textContent = `₹${order.total.toLocaleString('en-IN')}`;
  $('invPayment').textContent = order.payment;
}
