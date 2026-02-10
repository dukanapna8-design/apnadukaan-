// Global State
let cart = [];
let currentProduct = null;
let relatedProducts = [];

// DOM Elements
const productDetailContainer = document.getElementById('productDetailContainer');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const cartFooter = document.getElementById('cartFooter');
const cartIcon = document.getElementById('cartIcon');
const closeCartBtn = document.getElementById('closeCart');
const relatedProductsSection = document.getElementById('relatedProductsSection');
const relatedProductsGrid = document.getElementById('relatedProductsGrid');

// Initialize
async function init() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load product details
    await loadProductDetails(productId);
    
    // Load related products
    await loadRelatedProducts();
    
    // Load cart
    loadCart();
    updateCartUI();
    
    // Setup event listeners
    setupEventListeners();
}

// Load Product Details
async function loadProductDetails(productId) {
    try {
        const response = await fetch(`tables/products?limit=100`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            currentProduct = data.data.find(p => p.id === productId);
        }
        
        if (!currentProduct) {
            // Fallback to sample data
            currentProduct = getSampleProducts().find(p => p.id === productId);
        }
        
        if (currentProduct) {
            renderProductDetail();
        } else {
            productDetailContainer.innerHTML = `
                <div class="loading">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Product not found</p>
                    <a href="index.html" class="btn-primary" style="margin-top: 20px; text-decoration: none; display: inline-block;">Back to Home</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading product:', error);
        currentProduct = getSampleProducts().find(p => p.id === productId);
        if (currentProduct) {
            renderProductDetail();
        }
    }
}

// Sample Products (same as main.js)
function getSampleProducts() {
    return [
        {
            id: '1',
            name: 'Apple iPhone 15 Pro (256GB) - Natural Titanium',
            category: 'electronics',
            price: 134900,
            originalPrice: 144900,
            discount: 7,
            rating: 4.5,
            reviews: 2847,
            image: 'https://images.unsplash.com/photo-1696446702183-cbd0674e0c99?w=400&h=400&fit=crop',
            description: 'The iPhone 15 Pro features a strong and light titanium design with the powerful A17 Pro chip for next-level performance and mobile gaming.',
            stock: 50
        },
        {
            id: '2',
            name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB)',
            category: 'electronics',
            price: 124999,
            originalPrice: 134999,
            discount: 7,
            rating: 4.6,
            reviews: 1923,
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
            description: 'Galaxy AI is here. Search like never before, get real-time interpretation on a call, format your notes into summaries and transcribe recordings.',
            stock: 45
        },
        {
            id: '3',
            name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
            category: 'electronics',
            price: 29990,
            originalPrice: 34990,
            discount: 14,
            rating: 4.7,
            reviews: 5621,
            image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop',
            description: 'Industry-leading noise cancellation with two processors controlling 8 microphones for unprecedented noise cancellation.',
            stock: 100
        },
        {
            id: '4',
            name: 'Apple MacBook Air M2 Chip (13-inch, 8GB RAM, 256GB SSD)',
            category: 'electronics',
            price: 114900,
            originalPrice: 119900,
            discount: 4,
            rating: 4.8,
            reviews: 3456,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
            description: 'Supercharged by M2 chip. Incredibly portable and versatile. 18 hours of battery life.',
            stock: 30
        },
        {
            id: '5',
            name: 'Men\'s Cotton Casual Shirt (Blue Checks)',
            category: 'fashion',
            price: 799,
            originalPrice: 1999,
            discount: 60,
            rating: 4.2,
            reviews: 892,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
            description: 'Premium quality cotton casual shirt with modern fit. Perfect for daily wear.',
            stock: 200
        },
        {
            id: '6',
            name: 'Women\'s Ethnic Kurta Set (Floral Print)',
            category: 'fashion',
            price: 1299,
            originalPrice: 2499,
            discount: 48,
            rating: 4.3,
            reviews: 1234,
            image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400&h=400&fit=crop',
            description: 'Beautiful floral print kurta set with palazzo. Comfortable and stylish ethnic wear.',
            stock: 150
        },
        {
            id: '7',
            name: 'Nike Air Max 270 Running Shoes',
            category: 'sports',
            price: 7995,
            originalPrice: 12995,
            discount: 38,
            rating: 4.5,
            reviews: 2341,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
            description: 'Nike\'s biggest heel Air unit yet delivers an ultra-plush feel and all-day comfort.',
            stock: 80
        },
        {
            id: '8',
            name: 'L-Shaped Sofa Set (5 Seater, Grey)',
            category: 'home',
            price: 34999,
            originalPrice: 54999,
            discount: 36,
            rating: 4.4,
            reviews: 567,
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
            description: 'Modern L-shaped sofa with premium fabric upholstery. Perfect for living rooms.',
            stock: 25
        }
    ];
}

// Render Product Detail
function renderProductDetail() {
    // Update breadcrumb
    document.getElementById('breadcrumbCategory').textContent = currentProduct.category.charAt(0).toUpperCase() + currentProduct.category.slice(1);
    document.getElementById('breadcrumbProduct').textContent = currentProduct.name.substring(0, 40) + '...';
    
    const savings = currentProduct.originalPrice - currentProduct.price;
    const stockStatus = currentProduct.stock > 0 ? 
        `<span class="stock-status"><i class="fas fa-check-circle"></i> In Stock</span>` :
        `<span class="stock-status out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>`;
    
    productDetailContainer.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-images">
                <div class="main-image-container">
                    <img src="${currentProduct.image}" alt="${currentProduct.name}" class="main-image" id="mainImage" onerror="this.src='https://via.placeholder.com/500x500?text=Product'">
                </div>
            </div>
            
            <div class="product-info-detail">
                <h1 class="product-title-detail">${currentProduct.name}</h1>
                
                <div class="product-rating-detail">
                    <span class="rating-badge">
                        ${currentProduct.rating} <i class="fas fa-star"></i>
                    </span>
                    <span class="rating-count">${formatNumber(currentProduct.reviews)} ratings & reviews</span>
                </div>
                
                <div class="product-price-detail">
                    <div class="price-current-detail">₹${formatPrice(currentProduct.price)}</div>
                    <div class="price-info">
                        <span class="price-original-detail">₹${formatPrice(currentProduct.originalPrice)}</span>
                        <span class="price-discount-detail">${currentProduct.discount}% off</span>
                        <span class="savings-badge">You save ₹${formatPrice(savings)}</span>
                    </div>
                </div>
                
                ${stockStatus}
                
                <div class="highlights-section">
                    <h3>Product Highlights</h3>
                    <ul class="highlights-list">
                        <li>${currentProduct.description}</li>
                        <li>Premium quality and authentic product</li>
                        <li>7 days replacement policy</li>
                        <li>Free delivery available</li>
                        <li>Cash on delivery available</li>
                    </ul>
                </div>
                
                <div class="product-actions-detail">
                    <button class="btn-add-cart-large" onclick="addToCart('${currentProduct.id}')" ${currentProduct.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-buy-now" ${currentProduct.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-bolt"></i> Buy Now
                    </button>
                    <button class="btn-wishlist-large">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                
                <div class="delivery-info">
                    <h3>Delivery & Services</h3>
                    <div class="delivery-option">
                        <div class="delivery-icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="delivery-details">
                            <h4>Free Delivery</h4>
                            <p>Delivery by 3-5 days | Free ₹40</p>
                        </div>
                    </div>
                    <div class="delivery-option">
                        <div class="delivery-icon">
                            <i class="fas fa-undo"></i>
                        </div>
                        <div class="delivery-details">
                            <h4>7 Days Replacement</h4>
                            <p>Easy return and replacement policy</p>
                        </div>
                    </div>
                    <div class="delivery-option">
                        <div class="delivery-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div class="delivery-details">
                            <h4>Cash on Delivery</h4>
                            <p>Pay when you receive the product</p>
                        </div>
                    </div>
                </div>
                
                <div class="product-details-section">
                    <div class="details-tabs">
                        <button class="tab active" data-tab="description">Description</button>
                        <button class="tab" data-tab="specifications">Specifications</button>
                    </div>
                    
                    <div class="tab-content active" id="description">
                        <p class="description-text">${currentProduct.description}</p>
                    </div>
                    
                    <div class="tab-content" id="specifications">
                        <ul class="specifications-list">
                            <li class="spec-item">
                                <span class="spec-label">Brand</span>
                                <span class="spec-value">${currentProduct.name.split(' ')[0]}</span>
                            </li>
                            <li class="spec-item">
                                <span class="spec-label">Category</span>
                                <span class="spec-value">${currentProduct.category}</span>
                            </li>
                            <li class="spec-item">
                                <span class="spec-label">Rating</span>
                                <span class="spec-value">${currentProduct.rating} out of 5</span>
                            </li>
                            <li class="spec-item">
                                <span class="spec-label">Stock</span>
                                <span class="spec-value">${currentProduct.stock} units available</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
}

// Load Related Products
async function loadRelatedProducts() {
    if (!currentProduct) return;
    
    try {
        const response = await fetch('tables/products?limit=100');
        const data = await response.json();
        
        let allProducts = data.data && data.data.length > 0 ? data.data : getSampleProducts();
        
        // Filter products from same category, excluding current product
        relatedProducts = allProducts
            .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
            .slice(0, 4);
        
        if (relatedProducts.length > 0) {
            renderRelatedProducts();
            relatedProductsSection.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// Render Related Products
function renderRelatedProducts() {
    relatedProductsGrid.innerHTML = relatedProducts.map(product => `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x400?text=Product'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <span class="rating-badge">
                        ${product.rating} <i class="fas fa-star"></i>
                    </span>
                    <span class="rating-count">(${formatNumber(product.reviews)})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">₹${formatPrice(product.price)}</span>
                    <span class="price-original">₹${formatPrice(product.originalPrice)}</span>
                    <span class="price-discount">${product.discount}% off</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Functions (same as main.js)
function addToCart(productId) {
    const product = currentProduct.id === productId ? currentProduct : null;
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    openCart();
    showToast('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn-primary" onclick="window.location.href='index.html'">Continue Shopping</button>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80?text=Product'">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${formatPrice(item.price)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <button class="btn-remove" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = `₹${formatPrice(total)}`;
        cartFooter.style.display = 'block';
    }
}

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
}

function saveCart() {
    localStorage.setItem('apnadukan_cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('apnadukan_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function setupEventListeners() {
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-IN').format(price);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #388e3c;
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
