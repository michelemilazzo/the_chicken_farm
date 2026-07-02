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
  // Settings > head_html), che include i link legali. Qui non iniettiamo un
  // secondo footer per evitare il doppione.

  var CONSENT_KEY = "tcf-cookie-consent";

  var BANNER =
    '<div id="tcf-cookie-banner" role="dialog" aria-label="Preferenze cookie" aria-live="polite">' +
    '<div class="tcf-cc-inner">' +
    '<div class="tcf-cc-text">Utilizziamo cookie tecnici necessari al funzionamento del negozio online e, previo consenso, cookie analitici. ' +
    'Consulta la <a href="/cookie">Cookie policy</a> e l\'<a href="/privacy">Informativa privacy</a>.</div>' +
    '<div class="tcf-cc-actions">' +
    '<button type="button" class="tcf-cc-btn tcf-cc-reject" data-choice="reject">Rifiuta</button>' +
    '<button type="button" class="tcf-cc-btn tcf-cc-accept" data-choice="accept">Accetta</button>' +
    '</div></div></div>';

  var STYLE =
    '#tcf-cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:linear-gradient(180deg,rgba(18,18,18,.98),rgba(8,8,8,.99));border-top:1px solid rgba(200,155,60,.28);box-shadow:0 -14px 40px rgba(0,0,0,.5);transform:translateY(100%);transition:transform .35s ease}' +
    '#tcf-cookie-banner.show{transform:translateY(0)}' +
    '.tcf-cc-inner{max-width:1180px;margin:0 auto;padding:18px 22px;display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:space-between}' +
    '.tcf-cc-text{color:#c3bcb1;font-size:.9rem;line-height:1.6;max-width:70ch;flex:1 1 320px}' +
    '.tcf-cc-text a{color:#c89b3c;text-decoration:underline}' +
    '.tcf-cc-actions{display:flex;gap:10px;flex:0 0 auto}' +
    '.tcf-cc-btn{padding:11px 22px;border-radius:999px;font-weight:800;text-transform:uppercase;letter-spacing:1.1px;font-size:.72rem;cursor:pointer;border:1px solid rgba(200,155,60,.32);background:transparent;color:#f6efe4}' +
    '.tcf-cc-accept{background:#c89b3c;color:#111;border-color:#c89b3c}' +
    '.tcf-cc-btn:hover{filter:brightness(1.08)}' +
    '.tf-legal-links{opacity:.85;font-size:.85rem}';

  function saveConsent(choice) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice: choice, ts: Date.now() })); } catch (e) {}
  }
  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function hideBanner() {
    var b = document.getElementById("tcf-cookie-banner");
    if (b) b.classList.remove("show");
  }
  function showBanner() {
    var b = document.getElementById("tcf-cookie-banner");
    if (b) requestAnimationFrame(function () { b.classList.add("show"); });
  }

  function mountBanner() {
    if (document.getElementById("tcf-cookie-banner")) return;
    var s = document.createElement("style");
    s.textContent = STYLE;
    document.head.appendChild(s);
    document.body.insertAdjacentHTML("beforeend", BANNER);
    var banner = document.getElementById("tcf-cookie-banner");
    banner.addEventListener("click", function (e) {
      var btn = e.target.closest(".tcf-cc-btn");
      if (!btn) return;
      saveConsent(btn.getAttribute("data-choice"));
      hideBanner();
    });
  }

  // API pubblica per riaprire il banner (usata dalla Cookie policy e dal footer)
  window.tcfOpenCookie = function () {
    mountBanner();
    showBanner();
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("tcf-nav")) {
      document.body.insertAdjacentHTML("afterbegin", NAV);
      document.body.classList.add("tcf-injected-nav");
    }
    mountBanner();
    if (!getConsent()) showBanner();

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
