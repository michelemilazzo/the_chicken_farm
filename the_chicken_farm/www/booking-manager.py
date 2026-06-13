no_cache = 1

def get_context(context):
	import frappe
	if frappe.session.user == "Guest":
		frappe.local.flags.redirect_location = "/login?redirect-to=/booking-manager"
		raise frappe.Redirect
	context.no_breadcrumbs = 1
	context.title = "Booking Manager – TCF"
