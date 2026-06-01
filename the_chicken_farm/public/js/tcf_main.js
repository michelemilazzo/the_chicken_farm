document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.tcf-navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.padding = '8px 0';
                navbar.style.background = 'rgba(9,9,9,.98)';
            } else {
                navbar.style.padding = '14px 0';
                navbar.style.background = 'rgba(9,9,9,.97)';
            }
        });
    }
    
    // Mobile menu toggle
    const toggle = document.querySelector('.tcf-nav-toggle');
    const links = document.querySelector('.tcf-nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', function() {
            if (links.style.display === 'flex') {
                links.style.display = 'none';
            } else {
                links.style.display = 'flex';
                links.style.flexDirection = 'column';
                links.style.position = 'absolute';
                links.style.top = '100%';
                links.style.left = '0';
                links.style.width = '100%';
                links.style.background = 'rgba(9,9,9,.98)';
                links.style.padding = '20px';
            }
        });
    }
    
    // Scroll reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.tcf-card, .tcf-section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});
