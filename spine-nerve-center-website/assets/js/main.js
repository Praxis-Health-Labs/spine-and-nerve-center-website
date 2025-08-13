// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    // Open mobile menu
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Sticky header effects
    const header = document.getElementById('main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add subtle shadow and background opacity change when scrolled
        if (currentScroll > 50) {
            header.style.background = 'linear-gradient(to right, rgba(7, 65, 99, 0.98), rgba(7, 65, 99, 0.98))';
            header.style.backdropFilter = 'blur(10px)';
            header.classList.add('shadow-xl');
        } else {
            header.style.background = '';
            header.style.backdropFilter = 'none';
            header.classList.remove('shadow-xl');
        }
        
        // Optional: Hide header on scroll down, show on scroll up
        // Uncomment if you want this behavior
        /*
        if (currentScroll > lastScroll && currentScroll > 150) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        */

        lastScroll = currentScroll;
    });
});