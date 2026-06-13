# Copyright (c) 2026, BMAS S.r.l. and contributors
# Public website endpoints for The Chicken Farm (reservations, franchise leads).

import frappe
from frappe import _
from frappe.utils import cint, getdate

STAFF_EMAIL = "lucca@thechickenfarm.it"
SENDER = "The Chicken Farm <no-replies@onekeyco.com>"


def _clean(value, maxlen=140):
	if value is None:
		return None
	value = str(value).strip()
	return value[:maxlen]


def _send_staff_reservation(doc):
	"""Avviso prenotazione allo staff."""
	subject = f"🐓 Nuova prenotazione: {doc.customer_name} - {doc.reservation_date}"
	body = f"""<div style="font-family:sans-serif;max-width:600px;padding:24px">
<h2 style="color:#2B1A0F">🐓 Nuova Prenotazione</h2>
<table style="width:100%;border-collapse:collapse">
  <tr><td style="padding:8px;color:#888">Nome</td><td style="padding:8px;font-weight:bold">{doc.customer_name}</td></tr>
  <tr><td style="padding:8px;color:#888">Data</td><td style="padding:8px;font-weight:bold">{doc.reservation_date}</td></tr>
  <tr><td style="padding:8px;color:#888">Ora</td><td style="padding:8px;font-weight:bold">{doc.reservation_time}</td></tr>
  <tr><td style="padding:8px;color:#888">Persone</td><td style="padding:8px;font-weight:bold">{doc.people_count}{f' ({doc.children_count} bambini)' if doc.children_count else ''}</td></tr>
  <tr><td style="padding:8px;color:#888">Telefono</td><td style="padding:8px"><a href="tel:{doc.phone}">{doc.phone}</a></td></tr>
  <tr><td style="padding:8px;color:#888">Email</td><td style="padding:8px">{doc.email or '-'}</td></tr>
  {f'<tr><td style="padding:8px;color:#888">Allergie</td><td style="padding:8px;color:#e0531f">{doc.allergy_notes}</td></tr>' if doc.allergy_notes else ''}
  {f'<tr><td style="padding:8px;color:#888">Note</td><td style="padding:8px">{doc.event_notes}</td></tr>' if doc.event_notes else ''}
</table>
<p style="margin-top:20px"><a href="https://thechickenfarm.it/app/restaurant-reservation/{doc.name}" style="background:#2B1A0F;color:white;padding:10px 20px;border-radius:20px;text-decoration:none">Apri nel gestionale</a></p>
</div>"""
	frappe.sendmail(recipients=[STAFF_EMAIL], sender=SENDER, subject=subject, message=body, delayed=False, retry=2)


def _send_customer_reservation(doc):
	"""Conferma prenotazione al cliente."""
	if not doc.email:
		return
	subject = "Prenotazione confermata – The Chicken Farm 🐓"
	body = f"""<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
<div style="background:#2B1A0F;padding:32px;text-align:center">
  <img src="https://thechickenfarm.it/files/tcf_logo_white.png" alt="The Chicken Farm" style="height:90px">
</div>
<div style="padding:32px;background:#FFF5E0">
  <h2 style="color:#2B1A0F">Ciao {doc.customer_name},<br>la tua prenotazione è ricevuta! 🐓</h2>
  <p style="color:#7a6a55">Ti confermiamo al più presto. Ecco il riepilogo:</p>
  <div style="background:white;border-radius:12px;padding:20px;margin:20px 0">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#888">📅 Data</td><td style="padding:8px 0;font-weight:bold">{doc.reservation_date}</td></tr>
      <tr><td style="padding:8px 0;color:#888">🕐 Ora</td><td style="padding:8px 0;font-weight:bold">{doc.reservation_time}</td></tr>
      <tr><td style="padding:8px 0;color:#888">👥 Persone</td><td style="padding:8px 0;font-weight:bold">{doc.people_count}</td></tr>
      <tr><td style="padding:8px 0;color:#888">📍 Dove</td><td style="padding:8px 0;font-weight:bold">Borgo Giannotti 435, Lucca</td></tr>
    </table>
  </div>
  <p style="color:#7a6a55;font-size:.9rem">Per modifiche o cancellazioni: <a href="tel:+393333727816" style="color:#E0531F;font-weight:bold">+39 333 372 7816</a></p>
  <div style="text-align:center;margin-top:24px">
    <a href="https://thechickenfarm.it/menu" style="background:#E0531F;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:bold">Scopri il menu →</a>
  </div>
</div>
<div style="background:#2B1A0F;padding:16px;text-align:center;color:rgba(255,245,224,.5);font-size:.8rem">
  The Chicken Farm® · Borgo Giannotti 435, Lucca · lucca@thechickenfarm.it
</div>
</div>"""
	frappe.sendmail(recipients=[doc.email], sender=SENDER, subject=subject, message=body, delayed=False, retry=2)


def _send_franchise_lead(doc):
	"""Avviso nuovo lead franchise."""
	subject = f"🚀 Nuovo interesse franchise: {doc.lead_name} - {doc.city or 'N/A'}"
	body = f"""<div style="font-family:sans-serif;max-width:600px;padding:24px">
<h2 style="color:#2B1A0F">🚀 Nuovo Lead Franchise</h2>
<table style="width:100%;border-collapse:collapse">
  <tr><td style="padding:8px;color:#888">Nome</td><td style="padding:8px;font-weight:bold">{doc.lead_name}</td></tr>
  <tr><td style="padding:8px;color:#888">Città</td><td style="padding:8px">{doc.city or '-'}{f' ({doc.region})' if doc.region else ''}</td></tr>
  <tr><td style="padding:8px;color:#888">Email</td><td style="padding:8px"><a href="mailto:{doc.email}">{doc.email}</a></td></tr>
  <tr><td style="padding:8px;color:#888">Telefono</td><td style="padding:8px">{doc.phone or '-'}</td></tr>
  {f'<tr><td style="padding:8px;color:#888">Budget</td><td style="padding:8px">€{doc.available_budget}</td></tr>' if doc.available_budget else ''}
  {f'<tr><td style="padding:8px;color:#888">Esperienza ristoraz.</td><td style="padding:8px">Sì</td></tr>' if doc.has_restaurant_experience else ''}
  {f'<tr><td style="padding:8px;color:#888">Messaggio</td><td style="padding:8px">{doc.message}</td></tr>' if doc.message else ''}
</table>
<p style="margin-top:20px"><a href="https://thechickenfarm.it/app/franchise-lead/{doc.name}" style="background:#E0531F;color:white;padding:10px 20px;border-radius:20px;text-decoration:none">Apri nel gestionale</a></p>
</div>"""
	frappe.sendmail(recipients=[STAFF_EMAIL], sender=SENDER, subject=subject, message=body, delayed=False, retry=2)


@frappe.whitelist(allow_guest=True)
def submit_reservation(customer_name=None, phone=None, email=None, reservation_date=None,
		reservation_time=None, people_count=None, children_count=None, allergy_notes=None,
		event_notes=None):
	"""Create a Restaurant Reservation from the public /book form."""
	customer_name = _clean(customer_name)
	phone = _clean(phone, 40)
	if not customer_name or not phone:
		frappe.throw(_("Name and phone are required."))
	if not reservation_date or not reservation_time or not cint(people_count):
		frappe.throw(_("Date, time and number of people are required."))

	doc = frappe.get_doc({
		"doctype": "Restaurant Reservation",
		"customer_name": customer_name,
		"phone": phone,
		"email": _clean(email),
		"source": "Website",
		"reservation_date": getdate(reservation_date) if reservation_date else None,
		"reservation_time": _clean(reservation_time, 20),
		"people_count": cint(people_count) or None,
		"children_count": cint(children_count) or None,
		"allergy_notes": _clean(allergy_notes, 500),
		"event_notes": _clean(event_notes, 500),
	})
	doc.flags.ignore_permissions = True
	doc.insert(ignore_permissions=True)
	frappe.db.commit()

	# Email staff + cliente (non bloccare la response se l'invio fallisce)
	try:
		_send_staff_reservation(doc)
	except Exception:
		frappe.log_error(frappe.get_traceback(), "TCF: errore email staff prenotazione")
	try:
		_send_customer_reservation(doc)
	except Exception:
		frappe.log_error(frappe.get_traceback(), "TCF: errore email cliente prenotazione")

	return {"ok": True, "name": doc.name}


@frappe.whitelist(allow_guest=True)
def submit_franchise_lead(lead_name=None, email=None, phone=None, city=None, region=None,
		available_budget=None, has_restaurant_experience=None, message=None):
	"""Create a Franchise Lead from the public /franchise form."""
	lead_name = _clean(lead_name)
	email = _clean(email)
	if not lead_name or not (email or phone):
		frappe.throw(_("Name and an email or phone are required."))

	doc = frappe.get_doc({
		"doctype": "Franchise Lead",
		"lead_name": lead_name,
		"email": email,
		"phone": _clean(phone, 40),
		"city": _clean(city),
		"region": _clean(region),
		"available_budget": available_budget or 0,
		"has_restaurant_experience": 1 if cint(has_restaurant_experience) else 0,
		"message": _clean(message, 2000),
	})
	doc.flags.ignore_permissions = True
	doc.insert(ignore_permissions=True)
	frappe.db.commit()

	try:
		_send_franchise_lead(doc)
	except Exception:
		frappe.log_error(frappe.get_traceback(), "TCF: errore email lead franchise")

	return {"ok": True, "name": doc.name}
