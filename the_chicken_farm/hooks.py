app_name = "the_chicken_farm"
app_title = "The Chicken Farm"
app_publisher = "BMAS S.r.l."
app_description = "Restaurant operations, HACCP, franchise and academy system"
app_email = "info@thechickenfarm.it"
app_license = "mit"

required_apps = ["frappe", "erpnext", "webshop"]

web_include_css = ["/assets/the_chicken_farm/css/tcf_theme.css"]
web_include_js = ["/assets/the_chicken_farm/js/tcf_main.js"]

doc_events = {}

doctype_js = {}

scheduler_events = {}

website_redirects = [
    {"source": "/franchising", "target": "/franchise"},
    {"source": "/prenota", "target": "/book"},
    {"source": "/contatti", "target": "/contact"},
]

fixtures = []

has_website_permission = False
