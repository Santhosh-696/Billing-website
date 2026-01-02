# Restaurant Billing System

A professional restaurant billing website built with HTML, CSS, and JavaScript. Features menu management, cart functionality, QR code payments, bill printing, and sales reports.

## Features

### 1. Menu Management (CRUD Operations)
- Add menu items with name, price, description, category, and image
- Edit existing menu items
- Delete menu items
- Filter menu items by category (Appetizers, Main Course, Desserts, Beverages)
- Image upload for food items

### 2. Cart & Billing
- Click on menu items to add them to cart
- View cart items with quantity controls
- Update item quantities
- Remove items from cart
- Clear entire cart
- Automatic bill calculation (subtotal, tax, total)
- Real-time cart updates

### 3. Payment & QR Code
- "Pay Now" button in cart
- QR code display modal after clicking "Pay Now"
- Upload QR code image in Settings
- Payment confirmation
- Order history tracking

### 4. Bill Printing
- Print-friendly bill format
- Includes restaurant name, date, items, and totals
- Professional bill layout
- Print button in payment modal

### 5. Monthly Sales Report
- Total sales for current month
- Number of orders
- Average order value
- Top-selling items
- Daily sales breakdown

### 6. Settings
- Restaurant name and contact information
- Tax rate configuration
- Currency symbol setting
- QR code upload for payments
- All settings saved to browser localStorage

## Installation

1. Download or clone the repository
2. Open `index.html` in a web browser
3. No server or backend required - everything runs in the browser!

## Usage

### Adding Menu Items
1. Click "Add Menu Item" button
2. Fill in item details (name, price, category, description)
3. Upload an image (optional)
4. Click "Save Item"

### Managing Cart
1. Click on any menu item or use "Add to Cart" button
2. Items are automatically added to cart
3. Use quantity controls to increase/decrease quantities
4. Click "Remove" to delete items from cart
5. Click "Clear Cart" to remove all items

### Processing Payment
1. Add items to cart
2. Review cart and totals
3. Click "Pay Now" button
4. QR code will be displayed (if uploaded in Settings)
5. Click "Confirm Payment" to complete order
6. Click "Print Bill" to print the receipt

### Viewing Reports
1. Navigate to "Reports" section
2. View total sales, orders, and top-selling items
3. See daily sales breakdown for the current month

### Configuring Settings
1. Navigate to "Settings" section
2. Enter restaurant name and contact information
3. Set tax rate (percentage)
4. Set currency symbol
5. Upload QR code image for payments
6. Click "Save Settings"

## Data Storage

All data is stored in the browser's localStorage, which means:
- Data persists between browser sessions
- Data is specific to each browser
- No server or database required
- Data can be cleared by clearing browser data

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- localStorage API
- FileReader API (for image uploads)
- Print API (for bill printing)
- Font Awesome (for icons)

## File Structure

```
billing 3/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styling
├── js/
│   ├── app.js         # Main application logic
│   ├── menu.js        # Menu management
│   ├── cart.js        # Cart and billing
│   ├── reports.js     # Sales reports
│   ├── settings.js    # Settings management
│   └── utils.js       # Utility functions
└── README.md          # This file
```

## Features in Detail

### Image Upload
- Supports JPEG, PNG, GIF, and WebP formats
- Maximum file size: 5MB
- Images are converted to base64 and stored in localStorage
- Images are displayed in menu items and QR code modal

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Mobile-friendly navigation menu
- Responsive grid layout for menu items
- Touch-friendly buttons and controls

### Professional UI/UX
- Modern gradient background
- Smooth animations and transitions
- Toast notifications for user feedback
- Professional color scheme
- Card-based layouts
- Hover effects on interactive elements

## Notes

- All data is stored locally in the browser
- To reset all data, clear browser localStorage
- QR code must be uploaded in Settings before using payment feature
- Tax rate is applied as a percentage of subtotal
- Reports show data for the current month only

## Future Enhancements

- Export reports to CSV/PDF
- Multiple month selection for reports
- Table management
- Order status tracking
- Customer management
- Inventory management
- Multi-language support

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please check the code comments or contact the developer.

