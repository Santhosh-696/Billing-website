// Utility Functions

// LocalStorage Management
const Storage = {
    // Save data to localStorage
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Get data from localStorage
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    // Remove data from localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all localStorage
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Image Upload Handler
const ImageUpload = {
    // Convert image file to base64
    toBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    },

    // Validate image file
    validate: (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            return { valid: false, message: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' };
        }

        if (file.size > maxSize) {
            return { valid: false, message: 'Image size should be less than 5MB' };
        }

        return { valid: true };
    }
};

// Toast Notification
const Toast = {
    show: (message, duration = 3000) => {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }
    },

    success: (message) => {
        Toast.show(`✓ ${message}`, 3000);
    },

    error: (message) => {
        Toast.show(`✗ ${message}`, 4000);
    },

    info: (message) => {
        Toast.show(`ℹ ${message}`, 3000);
    }
};

// Format Currency
const formatCurrency = (amount, currency = '$') => {
    return `${currency}${parseFloat(amount).toFixed(2)}`;
};

// Format Date
const formatDate = (date = new Date()) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Generate Unique ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get Current Month Start and End
const getMonthRange = (date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return { start, end };
};

// Check if date is in current month
const isInCurrentMonth = (date) => {
    const now = new Date();
    const d = new Date(date);
    return d.getMonth() === now.getMonth() && 
           d.getFullYear() === now.getFullYear();
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Export utilities
window.Storage = Storage;
window.ImageUpload = ImageUpload;
window.Toast = Toast;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.generateId = generateId;
window.getMonthRange = getMonthRange;
window.isInCurrentMonth = isInCurrentMonth;
window.debounce = debounce;

