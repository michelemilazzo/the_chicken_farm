no_cache = 1

def get_context(context):
	import frappe
	frappe.local.flags.redirect_location = "/desk/booking-manager"
	raise frappe.Redirect
