// Settings Management

const Settings = {
    // Default settings
    defaults: {
        restaurantName: 'Restaurant Billing',
        restaurantContact: '',
        taxRate: 0,
        currency: '$',
        qrCode: null
    },

    // Initialize settings
    init: () => {
        Settings.load();
        Settings.setupEventListeners();
        Settings.updateUI();
    },

    // Load settings from localStorage
    load: () => {
        const savedSettings = Storage.get('settings', Settings.defaults);
        Settings.current = { ...Settings.defaults, ...savedSettings };
    },

    // Save settings to localStorage
    save: () => {
        Settings.current = {
            restaurantName: document.getElementById('restaurant-name-input').value || Settings.defaults.restaurantName,
            restaurantContact: document.getElementById('restaurant-contact').value || '',
            taxRate: parseFloat(document.getElementById('tax-rate-input').value) || 0,
            currency: document.getElementById('currency-input').value || '$',
            qrCode: Settings.current.qrCode || null
        };

        if (Storage.save('settings', Settings.current)) {
            Toast.success('Settings saved successfully');
            Settings.updateUI();
            // Update restaurant name in navbar
            document.getElementById('restaurant-name').textContent = Settings.current.restaurantName;
        } else {
            Toast.error('Failed to save settings');
        }
    },

    // Get current settings
    get: () => {
        return Settings.current;
    },

    // Setup event listeners
    setupEventListeners: () => {
        // Save settings button
        const saveBtn = document.getElementById('save-settings-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', Settings.save);
        }

        // QR code upload
        const qrUpload = document.getElementById('qr-code-upload');
        if (qrUpload) {
            qrUpload.addEventListener('change', Settings.handleQRUpload);
        }
    },

    // Handle QR code upload
    handleQRUpload: async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = ImageUpload.validate(file);
        if (!validation.valid) {
            Toast.error(validation.message);
            return;
        }

        try {
            const base64 = await ImageUpload.toBase64(file);
            Settings.current.qrCode = base64;
            Settings.updateQRPreview(base64);
            Toast.success('QR code uploaded successfully');
        } catch (error) {
            Toast.error('Failed to upload QR code');
            console.error(error);
        }
    },

    // Update QR code preview
    updateQRPreview: (base64) => {
        const preview = document.getElementById('qr-preview');
        if (preview && base64) {
            preview.innerHTML = `<img src="${base64}" alt="QR Code">`;
        }
    },

    // Update UI with current settings
    updateUI: () => {
        // Update input fields
        const nameInput = document.getElementById('restaurant-name-input');
        const contactInput = document.getElementById('restaurant-contact');
        const taxInput = document.getElementById('tax-rate-input');
        const currencyInput = document.getElementById('currency-input');

        if (nameInput) nameInput.value = Settings.current.restaurantName;
        if (contactInput) contactInput.value = Settings.current.restaurantContact;
        if (taxInput) taxInput.value = Settings.current.taxRate;
        if (currencyInput) currencyInput.value = Settings.current.currency;

        // Update QR preview
        if (Settings.current.qrCode) {
            Settings.updateQRPreview(Settings.current.qrCode);
        } else {
            const preview = document.getElementById('qr-preview');
            if (preview) {
                preview.innerHTML = '<p>No QR code uploaded</p>';
            }
        }

        // Update restaurant name in navbar
        const restaurantNameEl = document.getElementById('restaurant-name');
        if (restaurantNameEl) {
            restaurantNameEl.textContent = Settings.current.restaurantName;
        }
    }
};

// Initialize settings when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Settings.init);
} else {
    Settings.init();
}

// Export Settings
window.Settings = Settings;

