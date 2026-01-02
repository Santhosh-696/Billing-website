// Main Application Logic

const App = {
    // Initialize application
    init: () => {
        App.setupNavigation();
        App.setupMobileMenu();
        App.showSection('menu');
        
        // Initialize all modules
        if (typeof Settings !== 'undefined') {
            Settings.init();
        }
        if (typeof Menu !== 'undefined') {
            Menu.init();
        }
        if (typeof Cart !== 'undefined') {
            Cart.init();
        }
        if (typeof Reports !== 'undefined') {
            Reports.init();
        }

        // Update reports when switching to reports section
        document.querySelectorAll('.nav-link[data-section="reports"]').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    if (typeof Reports !== 'undefined' && Reports.update) {
                        Reports.update();
                    }
                }, 100);
            });
        });
    },

    // Setup navigation
    setupNavigation: () => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                App.showSection(section);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    },

    // Show section
    showSection: (sectionName) => {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update cart count when switching to cart
        if (sectionName === 'cart' && typeof Cart !== 'undefined') {
            Cart.render();
        }

        // Update reports when switching to reports
        if (sectionName === 'reports' && typeof Reports !== 'undefined') {
            Reports.update();
        }

        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    },

    // Setup mobile menu toggle
    setupMobileMenu: () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}

// Export App
window.App = App;

