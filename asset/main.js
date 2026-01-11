$(document).ready(function () {
    // Hide loader after full page load (fade out smoothly, then hide)
    $(window).on('load', function() {
        // trigger CSS fade and move
        $('#loader').addClass('fade-out');
        // after fade completes, mark hidden to remove from accessibility/interaction
        setTimeout(function() {
            $('#loader').addClass('hidden');
        }, 800);
    });

    // Theme Toggle Functionality
    const themeToggle = $('#themeToggle, #themeToggleMobile');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or prefer color scheme
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    if (currentTheme === 'dark') {
        $('html').attr('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    
    // Theme toggle click handler
    themeToggle.click(function() {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        showNotification(`Switched to ${newTheme} mode`);
    });

    // Initialize Hero Swiper
    const heroSwiper = new Swiper('.heroSwiper', {
        direction: 'horizontal',
        loop: true,
        speed: 600,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            init: function() {
                console.log('Swiper initialized successfully');
            }
        }
    });

    // Header scroll effect
    $(window).scroll(function () {
        const header = $('#mainHeader');
        if ($(window).scrollTop() > 50) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }

        // Animate elements on scroll
        animateOnScroll();
    });

    // Animated stats counter
    function animateStats() {
        $('.stat-number').each(function () {
            const $this = $(this);
            const countTo = parseInt($this.attr('data-count'));

            $({ countNum: 0 }).animate({
                countNum: countTo
            }, {
                duration: 1500,
                easing: 'swing',
                step: function () {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function () {
                    $this.text(this.countNum);
                }
            });
        });
    }

    // Check when elements are in view
    function animateOnScroll() {
        const windowHeight = $(window).height();
        const scrollPos = $(window).scrollTop();
        const windowBottom = scrollPos + windowHeight;

        // Animate stats (only once)
        const statsSection = $('.animated-stats');
        if (statsSection.length && !statsSection.hasClass('animated')) {
            const statsPos = statsSection.offset().top;
            if (windowBottom > statsPos + 100) {
                animateStats();
                statsSection.addClass('animated');
            }
        }

        // Animate timeline items
        $('.timeline-item').each(function () {
            if ($(this).hasClass('visible')) return;
            
            const itemPos = $(this).offset().top;
            const itemHeight = $(this).outerHeight();
            
            if (windowBottom > itemPos + (itemHeight * 0.3)) {
                $(this).addClass('visible');
            }
        });

        // Animate menu cards
        $('.menu-card').each(function () {
            if ($(this).hasClass('animated')) return;
            
            const cardPos = $(this).offset().top;
            if (windowBottom > cardPos + 100) {
                $(this).addClass('animate-fadeInUp');
                $(this).addClass('animated');
            }
        });

        // Animate price cards
        $('.price-card').each(function () {
            if ($(this).hasClass('animated')) return;
            
            const cardPos = $(this).offset().top;
            if (windowBottom > cardPos + 100) {
                $(this).addClass('animate-fadeInUp');
                $(this).addClass('animated');
            }
        });
        
        // Animate offer cards
        $('.offer-card').each(function () {
            if ($(this).hasClass('animated')) return;
            
            const cardPos = $(this).offset().top;
            if (windowBottom > cardPos + 100) {
                $(this).addClass('animate-fadeInUp');
                $(this).addClass('animated');
            }
        });
    }

    // Initial animation check
    animateOnScroll();

    // Highlight nav link based on section in view
    function updateActiveNav() {
        const headerHeight = $('#mainHeader').outerHeight();
        const scrollPos = $(window).scrollTop();

        // Remove existing active classes
        $('.desktop-nav .nav-link, .offcanvas .nav-link').removeClass('active');

        // Find the section currently in view
        $('a[href^="#"]').each(function() {
            const hash = this.hash;
            if (!hash || $(hash).length === 0) return;

            const sectionTop = $(hash).offset().top - headerHeight - 10;
            const sectionBottom = sectionTop + $(hash).outerHeight();

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                $(`a.nav-link[href="${hash}"]`).addClass('active');
            }
        });
    }

    // Run on init and on scroll/resize
    updateActiveNav();
    $(window).on('scroll.updateActive resize.updateActive', updateActiveNav);

    // Menu Tab System
    function initializeMenuTabs() {
        const menuTabs = $('.menu-tab');
        const tabIndicator = $('.tab-indicator');
        
        // Accessibility: set roles and initial aria-pressed
        menuTabs.attr('role', 'tab').attr('aria-pressed', 'false').each(function() {
            if ($(this).hasClass('active')) $(this).attr('aria-pressed', 'true');
        });
        
        // Initialize tab indicator position
        const activeTab = menuTabs.filter('.active');
        if (activeTab.length) {
            updateTabIndicator(activeTab, tabIndicator);
        }
        
        // Tab click handler
        menuTabs.click(function() {
            const tabId = $(this).data('tab');
            const clickedTab = $(this);
            
            // Update active tab and aria state
            menuTabs.removeClass('active').attr('aria-pressed', 'false');
            clickedTab.addClass('active').attr('aria-pressed', 'true');
            
            // Update tab indicator
            updateTabIndicator(clickedTab, tabIndicator);
            
            // On small screens, scroll the tab into center view
            if (window.matchMedia('(max-width: 767px)').matches) {
                const container = $('.menu-tabs');
                const containerWidth = container.width();
                const tabCenter = clickedTab.position().left + clickedTab.outerWidth() / 2;
                const scrollLeft = Math.max(0, tabCenter - containerWidth / 2 + container.scrollLeft());
                container.animate({ scrollLeft }, 250);
            }
            
            // Show corresponding content
            $('.tab-content').removeClass('active');
            $(`#tab-${tabId}`).addClass('active');
            
            // Animate menu items
            setTimeout(() => {
                $(`#tab-${tabId} .menu-card`).each(function(index) {
                    $(this).css('--card-index', index + 1);
                });
            }, 50);
        });
    }
    
    function updateTabIndicator(tab, indicator) {
        const tabWidth = tab.outerWidth();
        const tabPosition = tab.position().left;
        
        indicator.css({
            left: tabPosition,
            width: tabWidth
        });
    }
    
    // Initialize menu tabs
    initializeMenuTabs();

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function (e) {
        if (this.hash !== '' && $(this.hash).length) {
            e.preventDefault();
            const hash = this.hash;
            const target = $(hash);
            
            if (target.length) {
                // Calculate header height for offset
                const headerHeight = $('#mainHeader').outerHeight();
                const targetPosition = target.offset().top - headerHeight;
                
                // Close mobile menu if open (hide first to prevent layout shift)
                if ($('#mobileMenu').hasClass('show')) {
                    bootstrap.Offcanvas.getInstance($('#mobileMenu')).hide();
                }

                // Use native smooth scroll when available, otherwise fallback to jQuery animate
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    setTimeout(function() {
                        try { history.replaceState(null, '', hash); } catch (err) {}
                        updateActiveNav();
                    }, 700);
                } else {
                    $('html, body').animate({ scrollTop: targetPosition }, 700, function() {
                        try { history.replaceState(null, '', hash); } catch (err) {}
                        updateActiveNav();
                    });
                }
            }
        }
    });

    // Make dropdown toggles with hashes also perform smooth scroll after dropdown opens
    $('.dropdown-toggle[href^="#"]').on('click', function(e) {
        const hash = this.hash;
        if (hash && $(hash).length) {
            // Allow bootstrap dropdown to open then scroll to section
            setTimeout(() => {
                const headerHeight = $('#mainHeader').outerHeight();
                const targetPosition = $(hash).offset().top - headerHeight;

                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    setTimeout(function() {
                        try { history.replaceState(null, '', hash); } catch (err) {}
                        updateActiveNav();
                    }, 700);
                } else {
                    $('html, body').animate({ scrollTop: targetPosition }, 700, function() {
                        try { history.replaceState(null, '', hash); } catch (err) {}
                        updateActiveNav();
                    });
                }
            }, 120);
        }
    });

    // Form submission
    $('#reservationForm').submit(function (e) {
        e.preventDefault();
        
        // Form validation
        let isValid = true;
        $(this).find('.form-input[required]').each(function() {
            if ($(this).val().trim() === '') {
                $(this).addClass('error');
                isValid = false;
            } else {
                $(this).removeClass('error');
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Show success message
        const submitBtn = $(this).find('.form-submit');
        const originalText = submitBtn.html();

        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...');
        submitBtn.prop('disabled', true);

        setTimeout(() => {
            submitBtn.html('<i class="fas fa-check"></i> Reservation Confirmed!');
            submitBtn.css('background', 'var(--gradient-warm)');

            // Show success notification
            showNotification('Reservation confirmed! We will contact you shortly.');

            // Reset form
            $(this)[0].reset();

            // Revert button after 3 seconds
            setTimeout(() => {
                submitBtn.html(originalText);
                submitBtn.css('background', '');
                submitBtn.prop('disabled', false);
            }, 3000);
        }, 1500);
    });

    // Notification function
    function showNotification(message, type = 'success') {
        const notification = $(`
            <div class="notification ${type === 'error' ? 'error' : ''}">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}
            </div>
        `);

        $('body').append(notification);

        setTimeout(() => {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // Newsletter subscription
    $('.newsletter-subscribe').click(function (e) {
        e.preventDefault();
        const emailInput = $(this).siblings('.newsletter-email');
        const email = emailInput.val();
        
        if (email && validateEmail(email)) {
            showNotification('Thank you for subscribing!');
            emailInput.val('');
        } else {
            showNotification('Please enter a valid email address', 'error');
        }
    });

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Add animation to footer heart
    setInterval(() => {
        $('.footer-heart').css('animation', 'none');
        setTimeout(() => {
            $('.footer-heart').css('animation', 'heartbeat 1.5s infinite');
        }, 10);
    }, 1500);
    
    // Menu card order button click
    $('.menu-card-btn').click(function(e) {
        e.preventDefault();
        const card = $(this).closest('.menu-card');
        const title = card.find('.menu-card-title').text();
        showNotification(`Added ${title} to cart!`);
    });
    
    // Offer card button click
    $('.offer-card .menu-card-btn').click(function(e) {
        e.preventDefault();
        const card = $(this).closest('.offer-card');
        const title = card.find('.offer-title').text();
        showNotification(`Activated offer: ${title}!`);
    });

    // Back to top button functionality
    const $backToTop = $('#backToTop');

    // Show earlier on mobile and ensure visibility updates on resize
    function updateBackToTopVisibility() {
        const width = $(window).width();
        const docHeight = $(document).height();
        const winHeight = $(window).height();
        const scrollTop = $(window).scrollTop();

        // Lower threshold for mobile so it appears sooner
        const threshold = width <= 576 ? 120 : 400;

        // Only show if the page is scrollable and the user scrolled past threshold
        if (docHeight > winHeight + 50 && scrollTop > threshold) {
            $backToTop.addClass('show');
        } else {
            $backToTop.removeClass('show');
        }
    }

    $(window).on('scroll.backToTop resize.backToTop', updateBackToTopVisibility);

    // Smooth scroll to top on click / keyboard
    $('body').on('click', '#backToTop', function() {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(function() {
                try { history.replaceState(null, '', '#home'); } catch (err) {}
                updateActiveNav();
            }, 600);
        } else {
            $('html, body').animate({ scrollTop: 0 }, 600, function() {
                try { history.replaceState(null, '', '#home'); } catch (err) {}
                updateActiveNav();
            });
        }
    }).on('keydown', '#backToTop', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });

    // Initial check
    updateBackToTopVisibility();

    // Enhanced mobile menu behavior - FIXED
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    let bsMobileMenu = null;

    if (mobileMenu) {
        // Initialize Bootstrap Offcanvas
        bsMobileMenu = new bootstrap.Offcanvas(mobileMenu, {
            backdrop: true,
            scroll: false,
            keyboard: true
        });

        // Toggle menu button
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle menu
                if (bsMobileMenu) {
                    bsMobileMenu.toggle();
                }
                
                // Toggle button state
                this.classList.toggle('is-open');
                this.setAttribute('aria-expanded', 
                    this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
                );
                
                // Prevent rapid clicks
                this.disabled = true;
                setTimeout(() => {
                    this.disabled = false;
                }, 400);
            });
        }

        // Handle menu show event
        mobileMenu.addEventListener('show.bs.offcanvas', function () {
            // Add class to body
            $('body').addClass('menu-open');
            
            // Update button state
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.add('is-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            }
            
            // Lock body scroll
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        });

        // Handle menu hide event
        mobileMenu.addEventListener('hide.bs.offcanvas', function () {
            // Remove class from body
            $('body').removeClass('menu-open');
            
            // Update button state
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('is-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            
            // Unlock body scroll
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        });

        // Close menu when clicking on links
        $('.offcanvas .nav-link, .offcanvas .dropdown-item').on('click', function(e) {
            if (bsMobileMenu) {
                // Small delay for smooth transition
                setTimeout(() => {
                    bsMobileMenu.hide();
                }, 300);
            }
        });

        // Handle escape key to close menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && bsMobileMenu && mobileMenu.classList.contains('show')) {
                bsMobileMenu.hide();
            }
        });
    }

    // Fix for dropdowns in mobile menu
    $('.offcanvas .dropdown-toggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $this = $(this);
        const $dropdownMenu = $this.next('.dropdown-menu');
        
        // Close other open dropdowns
        $('.offcanvas .dropdown-menu').not($dropdownMenu).removeClass('show');
        
        // Toggle current dropdown
        $dropdownMenu.toggleClass('show');
        
        // Update aria-expanded
        const isExpanded = $dropdownMenu.hasClass('show');
        $this.attr('aria-expanded', isExpanded);
        
        // Close dropdown when clicking outside
        $(document).on('click.menu-dropdown', function(event) {
            if (!$(event.target).closest('.dropdown').length) {
                $dropdownMenu.removeClass('show');
                $this.attr('aria-expanded', 'false');
                $(document).off('click.menu-dropdown');
            }
        });
    });

    // Fix for mobile menu closing on backdrop click
    $('.offcanvas-backdrop').on('click', function() {
        if (bsMobileMenu) {
            bsMobileMenu.hide();
        }
    });

    // Window resize handler for responsive adjustments
    $(window).resize(function() {
        // Update tab indicator on resize
        const activeTab = $('.menu-tab.active');
        if (activeTab.length) {
            updateTabIndicator(activeTab, $('.tab-indicator'));
        }
    });

    // Initialize with current theme
    console.log('Website initialized with:', currentTheme, 'mode');
});