// Menu Management (CRUD Operations)

const Menu = {
    items: [],
    currentImage: null,

    // Initialize menu
    init: () => {
        Menu.load();
        Menu.setupEventListeners();
        Menu.render();
    },

    // Load menu items from localStorage
    load: () => {
        const allItems = Storage.get('menuItems', []);
        // Remove specific food items: idly, dosa, vada, poori, milk, coffee
        const itemsToRemove = ['idly', 'dosa', 'vada', 'poori', 'milk', 'coffee'];
        Menu.items = allItems.filter(item => {
            const itemName = item.name ? item.name.toLowerCase().trim() : '';
            return !itemsToRemove.some(removeItem => itemName.includes(removeItem.toLowerCase()));
        });
        // Save the filtered items back to localStorage
        if (Menu.items.length !== allItems.length) {
            Menu.save();
        }
    },

    // Save menu items to localStorage
    save: () => {
        Storage.save('menuItems', Menu.items);
    },

    // Setup event listeners
    setupEventListeners: () => {
        // Add menu item button
        const addBtn = document.getElementById('add-menu-item-btn');
        if (addBtn) {
            addBtn.addEventListener('click', Menu.openAddModal);
        }

        // Menu item form
        const form = document.getElementById('menu-item-form');
        if (form) {
            form.addEventListener('submit', Menu.handleFormSubmit);
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancel-menu-item');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', Menu.closeModal);
        }

        // Close modal buttons
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', Menu.closeModal);
        }

        // Image upload
        const imageUpload = document.getElementById('item-image-upload');
        if (imageUpload) {
            imageUpload.addEventListener('change', Menu.handleImageUpload);
        }

        // Close modal on outside click
        const modal = document.getElementById('menu-item-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    Menu.closeModal();
                }
            });
        }
    },

    // Open add menu item modal
    openAddModal: () => {
        Menu.resetForm();
        document.getElementById('modal-title').textContent = 'Add Menu Item';
        document.getElementById('menu-item-modal').classList.add('active');
    },

    // Open edit menu item modal
    openEditModal: (id) => {
        const item = Menu.items.find(i => i.id === id);
        if (!item) return;

        Menu.resetForm();
        document.getElementById('modal-title').textContent = 'Edit Menu Item';
        document.getElementById('menu-item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-description').value = item.description || '';

        if (item.image) {
            Menu.currentImage = item.image;
            Menu.updateImagePreview(item.image);
        }

        document.getElementById('menu-item-modal').classList.add('active');
    },

    // Close modal
    closeModal: () => {
        document.getElementById('menu-item-modal').classList.remove('active');
        Menu.resetForm();
    },

    // Reset form
    resetForm: () => {
        const form = document.getElementById('menu-item-form');
        if (form) {
            form.reset();
            document.getElementById('menu-item-id').value = '';
            Menu.currentImage = null;
            Menu.updateImagePreview(null);
        }
    },

    // Handle form submit
    handleFormSubmit: async (e) => {
        e.preventDefault();

        const id = document.getElementById('menu-item-id').value;
        const name = document.getElementById('item-name').value.trim();
        const price = parseFloat(document.getElementById('item-price').value);
        const description = document.getElementById('item-description').value.trim();
        
        // Get image from current upload or existing item
        let image = Menu.currentImage;
        if (!image && id) {
            const existingItem = Menu.items.find(i => i.id === id);
            image = existingItem ? existingItem.image : null;
        }

        if (!name || !price || price <= 0) {
            Toast.error('Please fill in all required fields');
            return;
        }

        const itemData = {
            name,
            price,
            description,
            image: image || null
        };

        if (id) {
            // Update existing item
            const index = Menu.items.findIndex(i => i.id === id);
            if (index !== -1) {
                Menu.items[index] = { ...Menu.items[index], ...itemData };
                Toast.success('Menu item updated successfully');
            }
        } else {
            // Add new item
            itemData.id = generateId();
            itemData.createdAt = new Date().toISOString();
            Menu.items.push(itemData);
            Toast.success('Menu item added successfully');
        }

        Menu.currentImage = null;
        Menu.save();
        Menu.render();
        Menu.closeModal();
    },

    // Handle image upload
    handleImageUpload: async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = ImageUpload.validate(file);
        if (!validation.valid) {
            Toast.error(validation.message);
            return;
        }

        try {
            const base64 = await ImageUpload.toBase64(file);
            Menu.currentImage = base64;
            Menu.updateImagePreview(base64);
        } catch (error) {
            Toast.error('Failed to upload image');
            console.error(error);
        }
    },

    // Update image preview
    updateImagePreview: (base64) => {
        const preview = document.getElementById('item-image-preview');
        if (preview) {
            if (base64) {
                preview.innerHTML = `<img src="${base64}" alt="Menu item">`;
            } else {
                preview.innerHTML = '<p>No image selected</p>';
            }
        }
    },

    // Delete menu item
    deleteItem: (id) => {
        if (confirm('Are you sure you want to delete this menu item?')) {
            Menu.items = Menu.items.filter(item => item.id !== id);
            Menu.save();
            Menu.render();
            Toast.success('Menu item deleted successfully');
        }
    },

    // Render menu items
    render: () => {
        const grid = document.getElementById('menu-grid');
        if (!grid) return;

        const items = Menu.items;

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="empty-menu-state">
                    <div class="empty-menu-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <h3>No Food Items Yet</h3>
                    <p>Start by adding your first food item to the menu</p>
                    <button class="btn btn-primary btn-large" onclick="Menu.openAddModal()">
                        <i class="fas fa-plus"></i> Add Food Item
                    </button>
                </div>
            `;
            return;
        }

        const settings = Settings.get();
        const currency = settings.currency || '$';

        grid.innerHTML = items.map(item => `
            <div class="menu-item" onclick="Cart.addItem('${item.id}')">
                <img src="${item.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                     alt="${item.name}" 
                     class="menu-item-image"
                     onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <div class="menu-item-content">
                    <div class="menu-item-header">
                        <div class="menu-item-name">${item.name}</div>
                        <div class="menu-item-price">${formatCurrency(item.price, currency)}</div>
                    </div>
                    ${item.description ? `<p class="menu-item-description">${item.description}</p>` : ''}
                    <div class="menu-item-actions">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); Cart.addItem('${item.id}')">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn btn-secondary" onclick="event.stopPropagation(); Menu.openEditModal('${item.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="event.stopPropagation(); Menu.deleteItem('${item.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

// Initialize menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Menu.init);
} else {
    Menu.init();
}

// Export Menu
window.Menu = Menu;

