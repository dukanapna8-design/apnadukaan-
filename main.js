// Global State
let products = [];
let cart = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentSort = 'relevance';
let searchQuery = '';
let priceFilter = { min: null, max: null };
let ratingFilter = null;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const cartFooter = document.getElementById('cartFooter');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const navLinks = document.querySelectorAll('.nav-links a');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const applyPriceFilterBtn = document.getElementById('applyPriceFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const cartIcon = document.getElementById('cartIcon');
const closeCartBtn = document.getElementById('closeCart');
const closeCartBtnEmpty = document.getElementById('closeCartBtn');

// Initialize App
async function init() {
    // Load products from API
    await loadProducts();
    
    // Render products
    renderProducts();
    
    // Load cart from localStorage
    loadCart();
    
    // Update cart UI
    updateCartUI();
    
    // Setup event listeners
    setupEventListeners();
}

// Load Products from API
async function loadProducts() {
    try {
        const response = await fetch('tables/products?limit=100');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            products = data.data;
            filteredProducts = [...products];
        } else {
            // Use sample products if no data in database
            products = getSampleProducts();
            filteredProducts = [...products];
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Use sample products as fallback
        products = getSampleProducts();
        filteredProducts = [...products];
    }
}

// Sample Products (fallback data)
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
            image: 'https://images.unsplash.com/photo-1696446702183-cbd0674e0c99?w=400&h=400&fit=crop'
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
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop'
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
            image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop'
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
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
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
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
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
            image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400&h=400&fit=crop'
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
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
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
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'
        },
        {
            id: '9',
            name: 'LG 7 Kg 5 Star Fully-Automatic Front Loading Washing Machine',
            category: 'appliances',
            price: 28990,
            originalPrice: 36990,
            discount: 22,
            rating: 4.3,
            reviews: 1876,
            image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop'
        },
        {
            id: '10',
            name: 'The Psychology of Money by Morgan Housel',
            category: 'books',
            price: 249,
            originalPrice: 399,
            discount: 38,
            rating: 4.7,
            reviews: 8932,
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop'
        },
        {
            id: '11',
            name: 'LEGO City Police Station Building Set',
            category: 'toys',
            price: 4999,
            originalPrice: 6999,
            discount: 29,
            rating: 4.6,
            reviews: 432,
            image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop'
        },
        {
            id: '12',
            name: 'Philips Air Fryer HD9252/90 (4.1 Liter, Black)',
            category: 'appliances',
            price: 7999,
            originalPrice: 12995,
            discount: 38,
            rating: 4.5,
            reviews: 3421,
            image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop'
        },
        {
            id: '13',
            name: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
            category: 'electronics',
            price: 31990,
            originalPrice: 36995,
            discount: 14,
            rating: 4.5,
            reviews: 2145,
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop'
        },
        {
            id: '14',
            name: 'Wooden Study Table with Storage (Walnut Finish)',
            category: 'home',
            price: 8999,
            originalPrice: 14999,
            discount: 40,
            rating: 4.2,
            reviews: 678,
            image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop'
        },
        {
            id: '15',
            name: 'Adidas Performance Gym Bag (Black)',
            category: 'sports',
            price: 1299,
            originalPrice: 2499,
            discount: 48,
            rating: 4.4,
            reviews: 891,
            image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&h=400&fit=crop'
        },
        {
            id: '16',
            name: 'Men\'s Formal Leather Shoes (Brown)',
            category: 'fashion',
            price: 1899,
            originalPrice: 3999,
            discount: 53,
            rating: 4.1,
            reviews: 1567,
            image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=400&fit=crop'
        }
    ];
}

// Render Products
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-box-open"></i>
                <p>No products found</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div onclick="window.location.href='product.html?id=${product.id}'" style="cursor: pointer;">
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
            <div class="product-actions">
                <button class="btn-cart" onclick="addToCart('${product.id}'); event.stopPropagation();">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn-wishlist" title="Add to Wishlist" onclick="event.stopPropagation();">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Products
function filterProducts() {
    filteredProducts = products.filter(product => {
        // Category filter
        const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
        
        // Search filter
        const searchMatch = !searchQuery || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Price filter
        const priceMatch = (!priceFilter.min || product.price >= priceFilter.min) &&
            (!priceFilter.max || product.price <= priceFilter.max);
        
        // Rating filter
        const ratingMatch = !ratingFilter || product.rating >= ratingFilter;
        
        return categoryMatch && searchMatch && priceMatch && ratingMatch;
    });
    
    sortProducts();
    renderProducts();
}

// Sort Products
function sortProducts() {
    switch(currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            // Assuming products are already sorted by newest
            break;
        default:
            // Relevance - sort by rating and reviews
            filteredProducts.sort((a, b) => {
                const scoreA = a.rating * Math.log(a.reviews + 1);
                const scoreB = b.rating * Math.log(b.reviews + 1);
                return scoreB - scoreA;
            });
    }
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
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
    
    // Show cart sidebar
    openCart();
    
    // Visual feedback
    showToast('Product added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update Quantity
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

// Update Cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn-primary" id="closeCartBtn">Continue Shopping</button>
            </div>
        `;
        cartFooter.style.display = 'none';
        
        // Re-attach event listener
        document.getElementById('closeCartBtn').addEventListener('click', closeCart);
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
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = `₹${formatPrice(total)}`;
        cartFooter.style.display = 'block';
    }
}

// Cart Functions
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
}

// Save Cart to localStorage
function saveCart() {
    localStorage.setItem('apnadukan_cart', JSON.stringify(cart));
}

// Load Cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('apnadukan_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Category navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCategory = link.dataset.category;
            filterProducts();
        });
    });
    
    // Search
    searchBtn.addEventListener('click', () => {
        searchQuery = searchInput.value;
        filterProducts();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchQuery = searchInput.value;
            filterProducts();
        }
    });
    
    // Sort
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortProducts();
        renderProducts();
    });
    
    // Price filter
    applyPriceFilterBtn.addEventListener('click', () => {
        priceFilter.min = minPriceInput.value ? parseInt(minPriceInput.value) : null;
        priceFilter.max = maxPriceInput.value ? parseInt(maxPriceInput.value) : null;
        filterProducts();
    });
    
    // Rating filter
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            ratingFilter = e.target.checked ? parseFloat(e.target.value) : null;
            filterProducts();
        });
    });
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', () => {
        currentCategory = 'all';
        searchQuery = '';
        priceFilter = { min: null, max: null };
        ratingFilter = null;
        currentSort = 'relevance';
        
        searchInput.value = '';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        sortSelect.value = 'relevance';
        document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
        
        navLinks.forEach(l => l.classList.remove('active'));
        navLinks[0].classList.add('active');
        
        filterProducts();
    });
    
    // Cart
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

// Utility Functions
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
    // Simple toast notification
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

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
