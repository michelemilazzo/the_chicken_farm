app_name = "the_chicken_farm"
app_title = "The Chicken Farm"
app_publisher = "BMAS S.r.l."
app_description = "Restaurant operations, HACCP, franchise and academy system"
app_email = "info@thechickenfarm.it"
app_license = "mit"

required_apps = ["frappe", "erpnext", "webshop"]

web_include_css = "/assets/the_chicken_farm/css/tcf_theme.css?v=202606140900"
web_include_js = "/assets/the_chicken_farm/js/tcf_main.js?v=202606140900"
app_include_css = "/assets/the_chicken_farm/css/tcf_theme.css?v=202606140900"
app_include_js = "/assets/the_chicken_farm/js/tcf_main.js?v=202606140900"

website_redirects = [
    {"source": "/franchising", "target": "/franchise"},
    {"source": "/prenota", "target": "/book"},
    {"source": "/contatti", "target": "/contact"},
]

doc_events = {}
scheduler_events = {}

fixtures = [
    {"doctype": "Role", "filters": [["name", "like", "TCF %"]]},
]
