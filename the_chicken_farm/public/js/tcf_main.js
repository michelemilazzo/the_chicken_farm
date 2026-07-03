(function () {
  // Non iniettare su desk/app Frappe (login, /app, ecc.)
  if (document.getElementById("app") || document.querySelector(".frappe-app")) return;

  var LOGO = "/assets/the_chicken_farm/images/tcf_logo_circle.svg";

  var NAV =
    '<nav id="tcf-nav"><div class="nav-logo"><a href="/"><img src="' + LOGO + '" alt="The Chicken Farm"></a></div>' +
    '<ul class="nav-links">' +
    '<li><a href="/menu">Menu</a></li>' +
    '<li><a href="/shop">Ordina Online</a></li>' +
    '<li><a href="/franchise">Franchise</a></li>' +
    '<li><a href="/contact">Contatti</a></li>' +
    '</ul><div class="nav-right"><a href="/book" class="nav-cta">Prenota</a></div></nav>';

  // Il footer del sito e' fornito globalmente da #tcf-global-footer (Website
  // Settings > head_html), che include i link legali. Il banner cookie e' quello
  // centralizzato di mmos_brand.js (auto-iniettato dove esiste un link /privacy).
  // Qui gestiamo solo la nav locale e piccole animazioni.

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("tcf-nav")) {
      document.body.insertAdjacentHTML("afterbegin", NAV);
      document.body.classList.add("tcf-injected-nav");
    }

    var app = document.getElementById("tcf-app");
    if (app) app.setAttribute("data-lang", localStorage.getItem("tcf-lang") || "it");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) en.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    var path = window.location.pathname.replace(/\/$/, "");
    document.querySelectorAll("#tcf-nav .nav-links a").forEach(function (el) {
      var href = el.getAttribute("href").replace(/\/$/, "");
      if (path === href || (href !== "" && path.startsWith(href))) el.classList.add("active");
    });
  });
})();
