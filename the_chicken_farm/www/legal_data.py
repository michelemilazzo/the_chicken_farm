"""Dati societari per le pagine legali (macro GDPR centralizzato in mmos_brand).

Campi allineati alla signature dei macro mmos_brand
(privacy_policy_shop / cookie_policy_shop): ragione_sociale, sede_legale,
piva_cf, rea, email, pec.

Fonte: Visura Ordinaria CCIAA Milano Monza Brianza Lodi (doc. n. L
ZG0RCNRJGMTHBQXHXR, estratta 23/01/2026). Sede legale a Milano; il locale
di Lucca (Borgo Giannotti 435) e' la sede operativa del ristorante.
REA (MI-2733365) e PEC (bmas@arubapec.it) noti ma non riportati per scelta.
"""

COMPANY = {
    "ragione_sociale": "BMAS S.r.l.",
    "sede_legale": "Viale Andrea Doria 56, 20124 Milano (MI)",
    "piva_cf": "13600510963",
    "rea": None,
    "email": "info@thechickenfarm.it",
    "pec": None,
}

ANNO = "3 luglio 2026"
