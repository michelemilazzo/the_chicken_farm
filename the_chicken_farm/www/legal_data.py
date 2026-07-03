"""Dati societari per le pagine legali (macro GDPR centralizzato in mmos_brand).

Campi allineati alla signature dei macro mmos_brand
(privacy_policy_shop / cookie_policy_shop): ragione_sociale, sede_legale,
piva_cf, rea, email, pec.

Fonte: DocType Company "BMAS S.r.l." + documenti ufficiali (Statuto, Visura
Ordinaria). La P.IVA 13600510963 compare sui documenti ufficiali ed e' quella
usata nel footer del sito (il DocType Company ha un valore trasposto errato).
"""

COMPANY = {
    "ragione_sociale": "BMAS S.r.l.",
    "sede_legale": "Borgo Giannotti 435, 55100 Lucca (LU)",
    "piva_cf": "13600510963",
    "rea": None,
    "email": "info@thechickenfarm.it",
    "pec": None,
}

ANNO = "3 luglio 2026"
