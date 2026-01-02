// Cart and Billing Functionality

const Cart = {
    items: [],

    // Initialize cart
    init: () => {
        Cart.load();
        Cart.setupEventListeners();
        Cart.render();
        Cart.updateCartCount();
    },

    // Load cart from localStorage
    load: () => {
        Cart.items = Storage.get('cart', []);
    },

    // Save cart to localStorage
    save: () => {
        Storage.save('cart', Cart.items);
    },

    // Setup event listeners
    setupEventListeners: () => {
        // Clear cart button
        const clearBtn = document.getElementById('clear-cart-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', Cart.clear);
        }

        // Pay now button
        const payNowBtn = document.getElementById('pay-now-btn');
        if (payNowBtn) {
            payNowBtn.addEventListener('click', Cart.openPaymentModal);
        }

        // Close QR modal buttons
        const closeQRModal = document.getElementById('close-qr-modal');
        if (closeQRModal) {
            closeQRModal.addEventListener('click', Cart.closePaymentModal);
        }

        const cancelPayment = document.getElementById('cancel-payment');
        if (cancelPayment) {
            cancelPayment.addEventListener('click', Cart.closePaymentModal);
        }

        // Confirm payment button
        const confirmPayment = document.getElementById('confirm-payment');
        if (confirmPayment) {
            confirmPayment.addEventListener('click', Cart.confirmPayment);
        }

        // Print bill button
        const printBillBtn = document.getElementById('print-bill-btn');
        if (printBillBtn) {
            printBillBtn.addEventListener('click', Cart.printBill);
        }

        // Close modal on outside click
        const modal = document.getElementById('qr-payment-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    Cart.closePaymentModal();
                }
            });
        }
    },

    // Add item to cart
    addItem: (itemId) => {
        const menuItem = Menu.items.find(item => item.id === itemId);
        if (!menuItem) {
            Toast.error('Menu item not found');
            return;
        }

        const existingItem = Cart.items.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            Cart.items.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1
            });
        }

        Cart.save();
        Cart.render();
        Cart.updateCartCount();
        Toast.success(`${menuItem.name} added to cart`);
    },

    // Update item quantity
    updateQuantity: (itemId, change) => {
        const item = Cart.items.find(i => i.id === itemId);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            Cart.removeItem(itemId);
        } else {
            Cart.save();
            Cart.render();
            Cart.updateCartCount();
        }
    },

    // Remove item from cart
    removeItem: (itemId) => {
        Cart.items = Cart.items.filter(item => item.id !== itemId);
        Cart.save();
        Cart.render();
        Cart.updateCartCount();
        Toast.info('Item removed from cart');
    },

    // Clear cart
    clear: () => {
        if (Cart.items.length === 0) {
            Toast.info('Cart is already empty');
            return;
        }

        if (confirm('Are you sure you want to clear the cart?')) {
            Cart.items = [];
            Cart.save();
            Cart.render();
            Cart.updateCartCount();
            Toast.info('Cart cleared');
        }
    },

    // Calculate subtotal
    getSubtotal: () => {
        return Cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Calculate tax
    getTax: () => {
        const settings = Settings.get();
        const taxRate = settings.taxRate || 0;
        return (Cart.getSubtotal() * taxRate) / 100;
    },

    // Calculate total
    getTotal: () => {
        return Cart.getSubtotal() + Cart.getTax();
    },

    // Render cart
    render: () => {
        const cartItemsEl = document.getElementById('cart-items');
        if (!cartItemsEl) return;

        if (Cart.items.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            Cart.updateSummary();
            return;
        }

        const settings = Settings.get();
        const currency = settings.currency || '$';

        cartItemsEl.innerHTML = Cart.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatCurrency(item.price, currency)} each</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="Cart.updateQuantity('${item.id}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="Cart.updateQuantity('${item.id}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">${formatCurrency(item.price * item.quantity, currency)}</div>
                    <button class="remove-item-btn" onclick="Cart.removeItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        Cart.updateSummary();
    },

    // Update cart summary
    updateSummary: () => {
        const settings = Settings.get();
        const currency = settings.currency || '$';
        const taxRate = settings.taxRate || 0;

        const subtotal = Cart.getSubtotal();
        const tax = Cart.getTax();
        const total = Cart.getTotal();

        document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal, currency);
        document.getElementById('cart-tax').textContent = formatCurrency(tax, currency);
        document.getElementById('cart-total').textContent = formatCurrency(total, currency);
        document.getElementById('tax-rate-display').textContent = taxRate;

        // Enable/disable pay now button
        const payNowBtn = document.getElementById('pay-now-btn');
        if (payNowBtn) {
            payNowBtn.disabled = Cart.items.length === 0;
        }
    },

    // Update cart count badge
    updateCartCount: () => {
        const count = Cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartBadge = document.getElementById('cart-count');
        if (cartBadge) {
            if (count > 0) {
                cartBadge.textContent = count;
                cartBadge.style.display = 'inline-block';
            } else {
                cartBadge.style.display = 'none';
            }
        }
    },

    // Open payment modal
    openPaymentModal: () => {
        if (Cart.items.length === 0) {
            Toast.error('Cart is empty');
            return;
        }

        const settings = Settings.get();
        const currency = settings.currency || '$';
        const total = Cart.getTotal();

        // Update payment amount
        document.getElementById('payment-amount').textContent = formatCurrency(total, currency);

        // Display QR code
        const qrDisplay = document.getElementById('qr-code-display');
        if (settings.qrCode) {
            qrDisplay.innerHTML = `<img src="${settings.qrCode}" alt="QR Code">`;
        } else {
            qrDisplay.innerHTML = '<p>No QR code uploaded. Please upload QR code in Settings.</p>';
        }

        // Show modal
        document.getElementById('qr-payment-modal').classList.add('active');
    },

    // Close payment modal
    closePaymentModal: () => {
        document.getElementById('qr-payment-modal').classList.remove('active');
    },

    // Confirm payment
    confirmPayment: () => {
        if (Cart.items.length === 0) {
            Toast.error('Cart is empty');
            return;
        }

        // Create order record
        const order = {
            id: generateId(),
            items: [...Cart.items],
            subtotal: Cart.getSubtotal(),
            tax: Cart.getTax(),
            total: Cart.getTotal(),
            date: new Date().toISOString()
        };

        // Save order to history
        const orders = Storage.get('orders', []);
        orders.push(order);
        Storage.save('orders', orders);

        // Clear cart
        Cart.items = [];
        Cart.save();
        Cart.render();
        Cart.updateCartCount();

        // Close modal
        Cart.closePaymentModal();

        // Show success message
        Toast.success('Payment confirmed! Order placed successfully.');

        // Update reports if on reports page
        if (typeof Reports !== 'undefined' && Reports.update) {
            Reports.update();
        }
    },

    // Print bill
    printBill: () => {
        if (Cart.items.length === 0) {
            Toast.error('Cart is empty');
            return;
        }

        const settings = Settings.get();
        const currency = settings.currency || '$';

        // Update bill header
        document.getElementById('bill-restaurant-name').textContent = settings.restaurantName;
        document.getElementById('bill-restaurant-contact').textContent = settings.restaurantContact || '';
        document.getElementById('bill-date').textContent = formatDate();

        // Update bill items
        const billItemsEl = document.getElementById('bill-items-list');
        billItemsEl.innerHTML = Cart.items.map(item => `
            <div class="bill-item">
                <div>
                    <strong>${item.name}</strong> x ${item.quantity}
                </div>
                <div>${formatCurrency(item.price * item.quantity, currency)}</div>
            </div>
        `).join('');

        // Update bill totals
        document.getElementById('bill-subtotal').textContent = formatCurrency(Cart.getSubtotal(), currency);
        document.getElementById('bill-tax').textContent = formatCurrency(Cart.getTax(), currency);
        document.getElementById('bill-total').textContent = formatCurrency(Cart.getTotal(), currency);

        // Print
        window.print();
    }
};

// Initialize cart when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Cart.init);
} else {
    Cart.init();
}

// Export Cart
window.Cart = Cart;

