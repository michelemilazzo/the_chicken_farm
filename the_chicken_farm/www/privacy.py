from the_chicken_farm.www.legal_data import COMPANY, LAST_UPDATE


def get_context(context):
    context.no_cache = 1
    context.title = "Informativa sulla privacy"
    context.company = COMPANY
    context.last_update = LAST_UPDATE
