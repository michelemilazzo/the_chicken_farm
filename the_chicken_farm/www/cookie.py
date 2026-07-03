from the_chicken_farm.www.legal_data import COMPANY, ANNO


def get_context(context):
    context.no_cache = 1
    context.title = "Cookie Policy"
    context.company = COMPANY
    context.anno = ANNO
