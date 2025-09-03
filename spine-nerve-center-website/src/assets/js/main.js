/**
 * Main JavaScript for Spine and Nerve Center Riverview
 * Handles mobile menu, sticky header, smooth scrolling, Swiper carousels, and video modals
 */
    
    // ==================================================
    // Mobile Menu Toggle
    // ==================================================
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
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // ==================================================
    // Smooth Scrolling for Anchor Links
    // ==================================================
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

    // ==================================================
    // Sticky Header Effects
    // ==================================================
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

    // ==================================================
    // Treatment Carousel Initialization (Swiper)
    // ==================================================
    if (document.querySelector(".treatment-slider")) {
        // Initialize Swiper carousel for treatment sections
        const treatmentSwiper = new Swiper(".treatment-slider", {
            loop: true,
            speed: 800,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            breakpoints: {
                0: {
                    slidesPerView: 1.2,
                    spaceBetween: 20,
                },
                640: {
                    slidesPerView: 2.2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3.5,
                    spaceBetween: 30,
                },
                1280: {
                    slidesPerView: 3.5,
                    spaceBetween: 50,
                },
            },
        });
    }

    // ==================================================
    // Hero/Testimonial Carousel (if exists)
    // ==================================================
    if (document.querySelector(".hero-slider")) {
        const heroSwiper = new Swiper(".hero-slider", {
            loop: true,
            speed: 1000,
            effect: 'fade',
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // ==================================================
    // Video Modal Functionality
    // ==================================================
    const videoModal = document.getElementById('video-modal');
    const closeModalButton = document.getElementById('close-video-modal');
    const videoPlayer = document.getElementById('modal-video-player');
    
    // Handle video play buttons in carousels
    const videoPlayButtons = document.querySelectorAll('.video-overlay button, button[id="play-video-button"]');
    
    videoPlayButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if this is the main video with data attribute
            const videoContainer = document.getElementById('video-container');
            if (videoContainer) {
                const videoUrl = videoContainer.getAttribute('data-video-url');
                if (videoUrl && videoUrl.trim() !== '' && videoUrl !== '[VIDEO_S3_URL]') {
                    openVideoModal(videoUrl);
                }
            } else {
                // For carousel videos, you might want to get the URL from a data attribute
                const videoUrl = this.getAttribute('data-video-url');
                if (videoUrl) {
                    openVideoModal(videoUrl);
                } else {
                    console.log('Video URL not found');
                }
            }
        });
    });

    function openVideoModal(videoUrl) {
        if (videoModal && videoPlayer) {
            videoPlayer.src = videoUrl;
            videoModal.classList.remove('hidden');
            videoModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeVideoModal() {
        if (videoModal && videoPlayer) {
            videoModal.classList.add('hidden');
            videoModal.classList.remove('flex');
            videoPlayer.pause();
            videoPlayer.src = '';
            document.body.style.overflow = '';
        }
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', function(event) {
            if (event.target === videoModal) {
                closeVideoModal();
            }
        });
    }

     // ==================================================
    // Video Sliders
    // ==================================================


   // src/assets/js/video-slider.js (new file)
let videoLibrary = null;

// Load video library once
async function loadVideoLibrary() {
    if (videoLibrary) return videoLibrary;
    
    try {
        const response = await fetch('/assets/data/video-library.json');
        const data = await response.json();
        videoLibrary = data.videos;
        return videoLibrary;
    } catch (error) {
        console.error('Failed to load video library:', error);
        return {};
    }
}

// Initialize all video sliders on the page
async function initializeVideoSliders() {
    const videos = await loadVideoLibrary();
    const sliders = document.querySelectorAll('[data-video-ids]');
    
    sliders.forEach(slider => {
        const videoIds = slider.getAttribute('data-video-ids').split(',').map(id => id.trim());
        const swiperWrapper = slider.querySelector('.swiper-wrapper');
        
        // Clear loading placeholder
        swiperWrapper.innerHTML = '';
        
        // Build slides from video IDs
        videoIds.forEach(videoId => {
            const video = videos[videoId];
            if (video) {
                const slide = createVideoSlide(video);
                swiperWrapper.appendChild(slide);
            } else {
                console.warn(`Video not found: ${videoId}`);
            }
        });
        
        // Initialize Swiper
        new Swiper(slider, {
            loop: true,
            speed: 800,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            breakpoints: {
                0: { slidesPerView: 1.2, spaceBetween: 20 },
                640: { slidesPerView: 2.2, spaceBetween: 20 },
                1024: { slidesPerView: 3.5, spaceBetween: 30 },
                1280: { slidesPerView: 3.5, spaceBetween: 50 }
            }
        });
    });
}

function createVideoSlide(video) {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'swiper-slide';
    
    slideDiv.innerHTML = `
        <div class="bg-white/10 backdrop-blur rounded-2xl overflow-hidden">
            <div class="relative">
                <img class="w-full h-48 object-cover" 
                     src="${video.thumbnail}" 
                     alt="${video.title} - Educational video"
                     loading="lazy" />
                <a href="${video.detailPageUrl}" 
                   class="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
                   aria-label="Watch ${video.title} video">
                    <div class="p-3 rounded-full bg-white/90 backdrop-blur border-2 border-white shadow-xl hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 36 37" fill="none">
                            <path d="M25.9808 13.9933C29.9808 16.3027 31.9808 17.4574 31.9808 19.1895C31.9808 20.9215 29.9808 22.0762 25.9808 24.3856L18 28.9933C14 31.3027 12 32.4574 10.5 31.5914C9 30.7254 9 28.416 9 23.7972L9 14.5818C9 9.96296 9 7.65356 10.5 6.78753C12 5.92151 14 7.07621 18 9.38561L25.9808 13.9933Z" 
                                  class="fill-primary-500"/>
                        </svg>
                    </div>
                </a>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-white mb-3">${video.title}</h3>
                <p class="text-gray-300 text-sm leading-relaxed mb-4">${video.description}</p>
                <a href="${video.detailPageUrl}" 
                   class="text-secondary-400 font-medium hover:text-secondary-300 transition flex items-center text-sm group">
                    <span>Learn More</span>
                    <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </div>
    `;
    
    return slideDiv;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initializeVideoSliders);

    // ==================================================
    // Form Validation (if needed)
    // ==================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Add your form validation logic here
            console.log('Form submitted');
        });
    }

    // ==================================================
    // Accordion/FAQ Functionality (if needed)
    // ==================================================
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');
            
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                if (icon) icon.classList.add('rotate-180');
            } else {
                content.classList.add('hidden');
                if (icon) icon.classList.remove('rotate-180');
            }
        });
    });

    // ==================================================
    // Lazy Loading Images (optional enhancement)
    // ==================================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ==================================================
    // Debug: Log to confirm script is loaded
    // ==================================================
    console.log('Spine and Nerve Center Riverview - Main JS Loaded');
    
    // Log if Swiper is available
    if (typeof Swiper !== 'undefined') {
        console.log('Swiper library loaded successfully');
    } else {
        console.warn('Swiper library not found - carousels will not work');
    }
;