document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('tcf-app');
    if (!app) return;

    // i18n: IT di default, EN solo se esplicitamente selezionato
    const lang = localStorage.getItem('tcf-lang') || 'it';
    app.setAttribute('data-lang', lang);

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
