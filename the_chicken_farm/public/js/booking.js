/**
 * The Chicken Farm - Booking Form Handler
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        var form = document.getElementById('tcf-booking-form');
        if (!form) return;

        // Set min date to today
        var dateInput = form.querySelector('#reservation_date');
        if (dateInput) {
            var today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;
            submitBtn.textContent = 'Invio in corso...';
            submitBtn.disabled = true;

            var formData = new FormData(form);
            var data = {};
            formData.forEach(function(v, k) { data[k] = v; });

            // Ensure privacy consent is checked
            data.privacy_consent = form.querySelector('#privacy_consent')?.checked ? '1' : null;

            fetch('/api/method/the_chicken_farm.api.reservation.create_reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Frappe-CSRF-Token': window.csrf_token || ''
                },
                body: JSON.stringify(data)
            })
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (res.message) {
                    form.innerHTML = '<div style="text-align:center;padding:40px;color:var(--tcf-gold);font-family:Oswald,sans-serif;font-size:1.2rem">'
                        + res.message.status === 'success' ? res.message.message : res.message
                        + '</div>';
                }
            })
            .catch(function(err) {
                alert('Errore nella prenotazione. Riprova o chiamaci direttamente.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });

        // Franchise lead form
        var franchiseForm = document.getElementById('franchise-lead-form');
        if (franchiseForm) {
            franchiseForm.addEventListener('submit', function(e) {
                e.preventDefault();

                var submitBtn = franchiseForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Invio in corso...';
                submitBtn.disabled = true;

                var formData = new FormData(franchiseForm);
                var data = {};
                formData.forEach(function(v, k) { data[k] = v; });
                data.has_restaurant_experience = franchiseForm.querySelector('#has_restaurant_experience')?.checked ? '1' : null;

                fetch('/api/method/the_chicken_farm.api.reservation.create_franchise_lead', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Frappe-CSRF-Token': window.csrf_token || ''
                    },
                    body: JSON.stringify(data)
                })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    franchiseForm.innerHTML = '<div style="text-align:center;padding:40px;color:var(--tcf-gold);font-family:Oswald,sans-serif;font-size:1.2rem">Richiesta inviata con successo! Ti contatteremo presto.</div>';
                })
                .catch(function(err) {
                    alert('Errore nell\'invio. Riprova pi\u00f9 tardi.');
                    submitBtn.textContent = 'Invia Richiesta';
                    submitBtn.disabled = false;
                });
            });
        }
    });
})();
