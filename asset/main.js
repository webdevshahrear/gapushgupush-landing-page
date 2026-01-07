
        $(document).ready(function () {
            // Hide loader
            setTimeout(() => {
                $('#loader').addClass('hidden');
            }, 1000);

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

            // Smooth scrolling for anchor links
            $('a[href^="#"]').on('click', function (e) {
                if (this.hash !== '' && $(this.hash).length) {
                    e.preventDefault();
                    const hash = this.hash;
                    const target = $(hash);
                    
                    if (target.length) {
                        $('html, body').animate({
                            scrollTop: target.offset().top - 100
                        }, 800);
                    }
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
            $(window).on('scroll.backToTop', function() {
                if ($(this).scrollTop() > 400) {
                    $backToTop.addClass('show');
                } else {
                    $backToTop.removeClass('show');
                }
            });

            // Smooth scroll to top on click / keyboard
            $('body').on('click', '#backToTop', function() {
                $('html, body').animate({ scrollTop: 0 }, 600);
            }).on('keydown', '#backToTop', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    $(this).trigger('click');
                }
            });

            // Ensure initial visibility state
            if ($(window).scrollTop() > 400) {
                $backToTop.addClass('show');
            }

        });