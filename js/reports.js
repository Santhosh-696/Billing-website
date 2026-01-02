// Sales Reports Functionality

const Reports = {
    // Initialize reports
    init: () => {
        Reports.setupEventListeners();
        Reports.update();
    },

    // Setup event listeners
    setupEventListeners: () => {
        const monthSelect = document.getElementById('month-select');
        if (monthSelect) {
            monthSelect.addEventListener('change', Reports.update);
        }
    },

    // Get orders for selected month
    getOrders: () => {
        const allOrders = Storage.get('orders', []);
        const monthSelect = document.getElementById('month-select');
        const selectedMonth = monthSelect ? monthSelect.value : 'current';

        if (selectedMonth === 'current') {
            return allOrders.filter(order => isInCurrentMonth(order.date));
        }

        // Filter by selected month (you can extend this for other months)
        return allOrders;
    },

    // Calculate total sales
    getTotalSales: (orders) => {
        return orders.reduce((sum, order) => sum + order.total, 0);
    },

    // Calculate total orders
    getTotalOrders: (orders) => {
        return orders.length;
    },

    // Calculate average order value
    getAverageOrder: (orders) => {
        if (orders.length === 0) return 0;
        return Reports.getTotalSales(orders) / orders.length;
    },

    // Get top selling items
    getTopItems: (orders, limit = 5) => {
        const itemCounts = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (itemCounts[item.id]) {
                    itemCounts[item.id].quantity += item.quantity;
                    itemCounts[item.id].revenue += item.price * item.quantity;
                } else {
                    itemCounts[item.id] = {
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        revenue: item.price * item.quantity
                    };
                }
            });
        });

        return Object.values(itemCounts)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);
    },

    // Get daily sales breakdown
    getDailySales: (orders) => {
        const dailySales = {};

        orders.forEach(order => {
            const date = new Date(order.date);
            const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            if (dailySales[dateKey]) {
                dailySales[dateKey].total += order.total;
                dailySales[dateKey].orders += 1;
            } else {
                dailySales[dateKey] = {
                    date: dateKey,
                    total: order.total,
                    orders: 1
                };
            }
        });

        return Object.values(dailySales).sort((a, b) => {
            // Sort by date (simple string comparison works for this format)
            return a.date.localeCompare(b.date);
        });
    },

    // Update reports
    update: () => {
        const orders = Reports.getOrders();
        const settings = Settings.get();
        const currency = settings.currency || '$';

        // Update summary cards
        const totalSales = Reports.getTotalSales(orders);
        const totalOrders = Reports.getTotalOrders(orders);
        const averageOrder = Reports.getAverageOrder(orders);

        document.getElementById('total-sales').textContent = formatCurrency(totalSales, currency);
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('average-order').textContent = formatCurrency(averageOrder, currency);

        // Update top items
        const topItems = Reports.getTopItems(orders);
        const topItemsEl = document.getElementById('top-items');
        if (topItemsEl) {
            if (topItems.length === 0) {
                topItemsEl.innerHTML = '<p>No sales data available</p>';
            } else {
                topItemsEl.innerHTML = topItems.map(item => `
                    <div class="top-item">
                        <div>
                            <strong>${item.name}</strong>
                            <div style="font-size: 0.9rem; color: #6c757d;">
                                ${item.quantity} sold
                            </div>
                        </div>
                        <div>
                            <strong>${formatCurrency(item.revenue, currency)}</strong>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Update daily sales
        const dailySales = Reports.getDailySales(orders);
        const dailySalesEl = document.getElementById('daily-sales');
        if (dailySalesEl) {
            if (dailySales.length === 0) {
                dailySalesEl.innerHTML = '<p>No sales data available</p>';
            } else {
                dailySalesEl.innerHTML = dailySales.map(day => `
                    <div class="daily-sale">
                        <div>
                            <strong>${day.date}</strong>
                            <div style="font-size: 0.9rem; color: #6c757d;">
                                ${day.orders} order${day.orders !== 1 ? 's' : ''}
                            </div>
                        </div>
                        <div>
                            <strong>${formatCurrency(day.total, currency)}</strong>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
};

// Initialize reports when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Reports.init);
} else {
    Reports.init();
}

// Export Reports
window.Reports = Reports;

