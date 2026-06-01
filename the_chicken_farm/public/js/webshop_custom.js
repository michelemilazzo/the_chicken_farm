/**
 * The Chicken Farm - Webshop Customizations
 * Pickup time, allergy notes, preparation notes for cart
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        // Add custom fields to cart if on webshop pages
        var cartFooter = document.querySelector('.cart-items-footer, .cart-total-section');
        if (!cartFooter) return;

        // Add pickup time selector
        var pickupDiv = document.createElement('div');
        pickupDiv.className = 'tcf-cart-custom';
        pickupDiv.style.padding = '16px';
        pickupDiv.style.borderTop = '1px solid rgba(196,147,69,.1)';
        pickupDiv.style.marginTop = '12px';
        pickupDiv.innerHTML = '<label style="display:block;color:var(--tcf-cream);margin-bottom:8px;font-size:.85rem">Orario Ritiro</label>'
            + '<select id="tcf-pickup-time" style="width:100%;padding:8px;background:var(--tcf-black);border:1px solid rgba(196,147,69,.2);color:var(--tcf-cream);border-radius:4px">'
            + '<option value="">Seleziona orario</option>'
            + '<option>12:00</option><option>12:30</option><option>13:00</option><option>13:30</option><option>14:00</option>'
            + '<option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option><option>21:00</option>'
            + '</select>'
            + '<label style="display:block;color:var(--tcf-cream);margin:12px 0 8px;font-size:.85rem">Note Allergie</label>'
            + '<textarea id="tcf-allergy-notes" rows="2" style="width:100%;padding:8px;background:var(--tcf-black);border:1px solid rgba(196,147,69,.2);color:var(--tcf-cream);border-radius:4px" placeholder="Allergie, intolleranze..."></textarea>'
            + '<label style="display:block;color:var(--tcf-cream);margin:12px 0 8px;font-size:.85rem">Bambini</label>'
            + '<input type="number" id="tcf-children-count" min="0" max="10" value="0" style="width:100%;padding:8px;background:var(--tcf-black);border:1px solid rgba(196,147,69,.2);color:var(--tcf-cream);border-radius:4px">';

        cartFooter.parentNode.insertBefore(pickupDiv, cartFooter);
    });
})();
