/* TCF v4 — active on all web pages */
(function(){
  var LOGO='/files/tcf-logo.svg';
  var path=window.location.pathname;

  // Pages where we DON'T inject (Desk, login internal, print)
  var skipRx=/^\/(app|login|api|assets|print|__)/;
  if(skipRx.test(path)) return;

  // Determine current page for active link
  var app=document.getElementById('tcf-app');
  var page=app?app.getAttribute('data-page'):'';
  if(!page){
    var pm=path.replace(/\/$/,'').split('/').pop()||'home';
    if(path==='/'||path==='') pm='home';
    page=pm;
  }

  // Apply dark theme to body always
  document.body.classList.add('tcf-on');

  /* ---------- i18n ---------- */
  function setLang(l){
    document.documentElement.setAttribute('data-tcf-lang',l);
    try{localStorage.setItem('tcf_lang',l)}catch(e){}
    var b=document.getElementById('tcf-lang');
    if(b) b.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-l')===l)});
  }
  var lang='it'; try{lang=localStorage.getItem('tcf_lang')||'it'}catch(e){}

  /* ---------- nav ---------- */
  var NL=[
    ['/','Home','Home'],
    ['/menu','Menu','Menu'],
    ['/shop','<span class="it">Ordina</span><span class="en">Order</span>',''],
    ['/book','<span class="it">Prenota</span><span class="en">Book</span>',''],
    ['/franchise','Franchise','Franchise'],
    ['/blog','<span class="it">Storie</span><span class="en">Stories</span>',''],
    ['/contact','<span class="it">Contatti</span><span class="en">Contact</span>','']
  ];
  // cart shortcut
  var isShop=['/all-products','/cart','/checkout','/wishlist','/addresses','/orders','/me'].some(function(p){return path.startsWith(p)});
  var lh=NL.map(function(l){
    var active=(l[0]==='/'&&page==='home')||(l[0]!=='/'&&path.startsWith(l[0]))?'active':'';
    var lb=l[2]?('<span class="it">'+l[1]+'</span><span class="en">'+l[2]+'</span>'):l[1];
    return '<a class="'+active+'" href="'+l[0]+'">'+lb+'</a>';
  }).join('');

  var nav=document.createElement('header'); nav.id='tcf-nav';
  nav.innerHTML='<div class="bar">'+
    '<a class="brand" href="/"><img src="'+LOGO+'" alt="TCF"><div><div class="bname">The Chicken Farm</div><span class="bsub">Griglia &amp; Spiedo · Lucca</span></div></a>'+
    '<button id="tcf-burger">&#9776;</button>'+
    '<nav class="links">'+lh+
      '<a class="'+(isShop?'ncta active':'ncta')+'" href="/all-products"><span class="it">🛒 Ordina</span><span class="en">🛒 Order</span></a>'+
      '<a href="/cart" style="color:var(--crm2);padding:8px 10px;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase"><span class="it">Carrello</span><span class="en">Cart</span></a>'+
      '<span id="tcf-lang"><button data-l="it">&#127470;&#127481; IT</button><button data-l="en">&#127468;&#127463; EN</button></span>'+
    '</nav>'+
  '</div>';
  document.body.insertBefore(nav,document.body.firstChild);

  window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>50)},{passive:true});
  if(scrollY>50) nav.classList.add('scrolled');
  document.getElementById('tcf-burger').addEventListener('click',function(){nav.querySelector('.links').classList.toggle('open')});
  setLang(lang);
  document.getElementById('tcf-lang').addEventListener('click',function(e){var b=e.target.closest('button');if(b)setLang(b.getAttribute('data-l'))});

  /* ---------- footer ---------- */
  var foot=document.createElement('footer'); foot.id='tcf-foot';
  foot.innerHTML='<div class="fi">'+
    '<div class="fb"><img src="'+LOGO+'" alt=""><div class="fn">The Chicken Farm</div><span class="fs">Griglia &amp; Spiedo</span>'+
      '<p class="it">Pollo marinato 6 ore, panatura segreta e salsa della fattoria. Cotto al momento, mai precotto.</p>'+
      '<p class="en">Chicken marinated 6 hours, secret breading and farm sauce. Always fresh, never pre-cooked.</p>'+
    '</div>'+
    '<div><h5><span class="it">Esplora</span><span class="en">Explore</span></h5>'+
      '<a href="/menu">Menu</a><a href="/all-products"><span class="it">Ordina online</span><span class="en">Order online</span></a>'+
      '<a href="/book"><span class="it">Prenota</span><span class="en">Book a table</span></a>'+
      '<a href="/franchise">Franchise</a><a href="/blog"><span class="it">Storie</span><span class="en">Stories</span></a>'+
    '</div>'+
    '<div><h5><span class="it">Vieni a trovarci</span><span class="en">Find us</span></h5>'+
      '<a href="https://maps.google.com/?q=Borgo+Nuovo+Lucca" target="_blank">Borgo Nuovo, Lucca</a>'+
      '<a href="tel:+393333727816">+39 333 372 7816</a>'+
      '<a href="mailto:info@thechickenfarm.it">info@thechickenfarm.it</a>'+
      '<h5 style="margin-top:20px"><span class="it">Orari</span><span class="en">Hours</span></h5>'+
      '<address class="it">Mar–Dom 12:00–15:00 · 19:00–23:00<br>Lunedì chiuso</address>'+
      '<address class="en">Tue–Sun 12:00–15:00 · 19:00–23:00<br>Closed Monday</address>'+
    '</div>'+
  '</div><div class="fc">© 2026 The Chicken Farm® · BMAS S.r.l.</div>';
  document.body.appendChild(foot);

  /* ---------- webshop page title ---------- */
  if(isShop){
    var titles={
      '/all-products':'<span class="it">Ordina online</span><span class="en">Order online</span>',
      '/cart':'<span class="it">Il tuo carrello</span><span class="en">Your cart</span>',
      '/checkout':'Checkout',
      '/wishlist':'Wishlist',
      '/orders':'<span class="it">I tuoi ordini</span><span class="en">Your orders</span>',
      '/me':'<span class="it">Il tuo profilo</span><span class="en">Your profile</span>'
    };
    var titleKey=Object.keys(titles).find(function(k){return path.startsWith(k)});
    if(titleKey){
      var hdr=document.createElement('div'); hdr.className='ws-page-hdr';
      hdr.innerHTML='<div class="ws-hdr-inner"><span class="ey">The Chicken Farm</span><h1 class="h2" style="font-size:clamp(2.4rem,6vw,5rem)">'+titles[titleKey]+'</h1></div>';
      var main=document.querySelector('main,.page_content');
      if(main) main.insertBefore(hdr,main.firstChild);
    }
  }

  /* ---------- forms ---------- */
  document.querySelectorAll('form.tcf-form').forEach(function(f){
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var m=f.getAttribute('data-method'),msg=f.querySelector('.tcf-msg'),btn=f.querySelector('[type=submit]');
      var d={}; new FormData(f).forEach(function(v,k){d[k]=v});
      if(btn){btn.disabled=true;btn._t=btn.textContent;btn.textContent='…'}
      fetch('/api/method/'+m,{method:'POST',headers:{'Content-Type':'application/json','X-Frappe-CSRF-Token':(window.frappe&&frappe.csrf_token)||''},body:JSON.stringify(d)})
        .then(function(r){return r.json().then(function(j){return{ok:r.ok,j:j}})})
        .then(function(res){
          if(res.ok&&res.j.message&&res.j.message.ok){
            f.reset(); msg.className='tcf-msg ok';
            msg.innerHTML='<span class="it">Inviato! Rif: '+res.j.message.name+'</span><span class="en">Sent! Ref: '+res.j.message.name+'</span>';
          } else { msg.className='tcf-msg err'; msg.innerHTML='<span class="it">Errore. Controlla i campi.</span><span class="en">Error. Check fields.</span>'; }
        }).catch(function(){msg.className='tcf-msg err';msg.textContent='Network error'})
        .finally(function(){if(btn){btn.disabled=false;btn.textContent=btn._t}});
    });
  });

  /* ---------- shop grid (our /shop page) ---------- */
  var sg=document.getElementById('tcf-shop-grid');
  if(sg){
    fetch('/api/method/webshop.webshop.api.get_product_filter_data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query_args:{field_filters:{},attribute_filters:{},start:0,item_group:sg.getAttribute('data-group')||null}})})
      .then(function(r){return r.json()}).then(function(j){
        var items=(j.message&&j.message.items)||[];
        sg.innerHTML=items.slice(0,9).map(function(it){
          var img=it.website_image?'style="background-image:url(\''+it.website_image+'\')"':'';
          return '<a class="prod" href="/'+it.route+'"><div class="ph" '+img+'></div><div class="bd"><b>'+it.web_item_name+'</b><div style="flex:1"></div><div class="pr">'+(it.formatted_price||'')+'</div></div></a>';
        }).join('')||'<p style="padding:32px;color:var(--mut)">—</p>';
      }).catch(function(){});
  }

  /* ---------- reveal ---------- */
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(ee){ee.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.1});
    document.querySelectorAll('.reveal').forEach(function(el,i){el.style.transitionDelay=(i%5*80)+'ms';obs.observe(el)});
  }
})();

/* ---- WEBSHOP: force grid view + cleanup ---- */
(function wsEnhance(){
  var isWS = ['/all-products','/cart','/wishlist'].some(function(p){return location.pathname.startsWith(p)});
  if(!isWS) return;
  function enhance(){
    // force grid/image view
    var gridBtn=document.getElementById('image-view');
    if(gridBtn && !gridBtn.classList.contains('btn-primary')) gridBtn.click();
    // hide "Item Code : XXX" text via text node removal
    document.querySelectorAll('.product-category,.product-description').forEach(function(el){
      el.innerHTML=el.innerHTML.replace(/\s*\|\s*Item Code\s*:\s*[A-Z0-9\-]+/g,'');
    });
    // translate button text
    document.querySelectorAll('.btn-add-to-cart-list,.btn-add-to-cart').forEach(function(btn){
      if(btn.textContent.trim().toLowerCase().includes('quote')||btn.textContent.trim().toLowerCase().includes('add')){
        var lang=document.documentElement.getAttribute('data-tcf-lang')||'it';
        btn.innerHTML='<span>'+(lang==='it'?'Aggiungi al carrello':'Add to cart')+'</span>';
      }
    });
    document.querySelectorAll('.go-to-cart-grid,.go-to-cart-list').forEach(function(btn){
      var lang=document.documentElement.getAttribute('data-tcf-lang')||'it';
      btn.textContent=lang==='it'?'Vai al carrello':'Go to cart';
    });
  }
  // run after webshop JS renders products
  setTimeout(enhance,1500);
  setTimeout(enhance,3500);
  // observe DOM changes (products loaded via AJAX)
  if(typeof MutationObserver!=='undefined'){
    var mo=new MutationObserver(function(){setTimeout(enhance,400)});
    var pl=document.getElementById('product-listing')||document.getElementById('products-list-area');
    if(pl) mo.observe(pl,{childList:true,subtree:true});
  }
})();


/* REBUILD product cards — debounced, always fresh */
(function rebuildCards(){
  var rebuildTimer=null;
  function rebuild(){
    clearTimeout(rebuildTimer);
    rebuildTimer=setTimeout(function(){
      var rows=document.querySelectorAll('#products-list-area .list-row');
      if(!rows.length) return;
      var lang=document.documentElement.getAttribute('data-tcf-lang')||'it';
      var btnTxt=lang==='it'?'+ Carrello':'+ Cart';
      rows.forEach(function(row){
        // extract data from original Bootstrap HTML
        var imgEl=row.querySelector('img.website-image');
        var imgSrc=imgEl?imgEl.getAttribute('src'):'';
        // if already rebuilt (no img.website-image), skip
        if(!imgSrc && row.querySelector('.tcf-rb')) return;
        var linkEl=row.querySelector('.col-8 a, .col-10>div .col-8 a');
        var name=linkEl?linkEl.textContent.trim():'';
        var href=linkEl?linkEl.getAttribute('href'):'#';
        var priceEl=row.querySelector('.product-price');
        var price=priceEl?priceEl.textContent.trim():'';
        var cartBtn=row.querySelector('.btn-add-to-cart-list');
        if(!name || !price) return; // not ready yet
        var imgStyle=imgSrc?'background-image:url("'+imgSrc+'");background-size:cover;background-position:center':'background:#1c1610';
        row.innerHTML=
          '<div class="tcf-rb" style="display:flex;flex-direction:column;height:100%">'+
            '<a href="'+href+'" style="display:block;aspect-ratio:4/3;'+imgStyle+';background-color:var(--drk2);flex-shrink:0"></a>'+
            '<div style="padding:14px 16px;flex:1;display:flex;flex-direction:column;gap:6px;background:var(--drk)">'+
              '<a href="'+href+'" style="font-family:Oswald,sans-serif;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;color:#f2e8d8;line-height:1.2;display:block">'+name+'</a>'+
              '<div style="color:#c85a1e;font-family:Oswald,sans-serif;font-size:1.05rem;font-weight:600;flex:1;display:flex;align-items:flex-end;padding-bottom:4px">'+price+'</div>'+
            '</div>'+
          '</div>';
        if(cartBtn){
          var code=cartBtn.getAttribute('data-item-code');
          if(code) row.setAttribute('data-item-code',code);
        }
      });
    }, 300);
  }
  setTimeout(rebuild,1200);
  setTimeout(rebuild,2500);
  setTimeout(rebuild,5000);
  if('MutationObserver' in window){
    var mo=new MutationObserver(rebuild);
    var container=document.getElementById('product-listing');
    if(container) mo.observe(container,{childList:true,subtree:true});
  }
})();
