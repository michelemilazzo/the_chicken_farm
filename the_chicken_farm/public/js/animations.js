/**
 * The Chicken Farm - Animations
 * Lightweight scroll, parallax, and reveal animations
 */
(function() {
    'use strict';

    // Scroll reveal
    function initScrollReveal() {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('tcf-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.tcf-card, .tcf-section-header, .tcf-form-group, .tcf-hero-content').forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });
    }

    // Add revealed state
    var style = document.createElement('style');
    style.textContent = '.tcf-revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // Parallax on hero
    function initParallax() {
        var hero = document.querySelector('.tcf-hero');
        if (!hero) return;

        window.addEventListener('scroll', function() {
            var scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                hero.style.backgroundPositionY = (scroll * 0.4) + 'px';
            }
        });
    }

    // Counter animation
    function initCounters() {
        var counters = document.querySelectorAll('.tcf-counter');
        counters.forEach(function(counter) {
            var target = parseInt(counter.getAttribute('data-target') || counter.textContent, 10);
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function animate(ts) {
                if (!startTime) startTime = ts;
                var progress = Math.min((ts - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(animate);
            }

            var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(animate);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            obs.observe(counter);
        });
    }

    // Lazy load images
    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) return;
        var images = document.querySelectorAll('img[loading="lazy"]');
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    img.src = img.dataset.src || img.src;
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(function(img) { observer.observe(img); });
    }

    // Init
    document.addEventListener('DOMContentLoaded', function() {
        initScrollReveal();
        initParallax();
        initCounters();
        initLazyLoading();
    });
})();
