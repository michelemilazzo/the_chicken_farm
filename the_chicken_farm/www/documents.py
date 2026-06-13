from collections import defaultdict


def _item(file_name, file_url, category, kind='pdf', featured=False):
    label = file_name.replace('.pdf', '').replace('.docx', '').replace('_', ' ').replace('-', ' ').strip()
    label = ' '.join(part.capitalize() for part in label.split())
    return {
        'file_name': file_name,
        'file_url': file_url,
        'label': label,
        'category': category,
        'kind': kind,
        'featured': featured,
    }


def get_context(context):
    context.no_cache = 1
    context.title = 'Document Archive'

    photos = [
        _item(f'tcf_photo_{i:02d}.jpeg', f'/files/foto/tcf_photo_{i:02d}.jpeg', 'Visual Archive', 'photo', featured=(i in {1, 8, 9}))
        for i in range(1, 10)
    ]

    docs = [
        _item('ef5b840d_Menu rinominato.pdf', '/files/documents/ef5b840d_Menu%20rinominato.pdf', 'Brand & Menu', featured=True),
        _item('2398d008_organigramma the chicken farm.pdf', '/files/documents/2398d008_organigramma%20the%20chicken%20farm.pdf', 'Brand & Governance', featured=True),
        _item('b9f0d258_13600510963-STatuto.pdf', '/files/documents/b9f0d258_13600510963-STatuto.pdf', 'Brand & Governance'),
        _item('70a0b5ea_manuale etico.pdf', '/files/documents/70a0b5ea_manuale%20etico.pdf', 'Brand & Governance'),
        _item('65f87227_Contracta.pdf', '/files/documents/65f87227_Contracta.pdf', 'Brand & Governance'),
        _item('c4c3d9f9_Bilancio 2025 BMAS.pdf', '/files/documents/c4c3d9f9_Bilancio%202025%20BMAS.pdf', 'Finance & Compliance', featured=True),
        _item('e4091035_Bilancio 2024 BMAS.pdf', '/files/documents/e4091035_Bilancio%202024%20BMAS.pdf', 'Finance & Compliance'),
        _item('029fccc2_cis bmas srl.pdf', '/files/documents/029fccc2_cis%20bmas%20srl.pdf', 'Finance & Compliance'),
        _item('9b53c864_cis bmas srl.pdf', '/files/documents/9b53c864_cis%20bmas%20srl.pdf', 'Finance & Compliance'),
        _item('3e76d05c_schede operative sala.pdf', '/files/documents/3e76d05c_schede%20operative%20sala.pdf', 'Operations', featured=True),
        _item('cec433a5_manuale unità operativa.pdf', '/files/documents/cec433a5_manuale%20unit%C3%A0%20operativa.pdf', 'Operations', featured=True),
        _item('f03af7d2_schede cucina.pdf', '/files/documents/f03af7d2_schede%20cucina.pdf', 'Operations', featured=True),
        _item('78d8aaaa_13600510963_VISUORD_20260123.pdf', '/files/documents/78d8aaaa_13600510963_VISUORD_20260123.pdf', 'Operations'),
        _item('2d6f8552_KAZQQQS4Z2KAGPGAAAAM3EFGT4EBFA_page-0001.pdf', '/files/documents/2d6f8552_KAZQQQS4Z2KAGPGAAAAM3EFGT4EBFA_page-0001.pdf', 'Archive & Attachments'),
        _item('fcf576ea_13600510963-A01-860291181_20240606.pdf', '/files/documents/fcf576ea_13600510963-A01-860291181_20240606.pdf', 'Archive & Attachments'),
        _item('bdf864dc_VA 2026 04 27 BMAS bil2025.docx', '/files/documents/bdf864dc_VA%202026%2004%2027%20BMAS%20bil2025.docx', 'Archive & Attachments', kind='docx'),
    ]

    context.photos = photos
    context.docs = docs
    context.featured_docs = [d for d in docs if d['featured']]
    context.brand_docs = [d for d in docs if d['category'] == 'Brand & Governance']
    context.operation_docs = [d for d in docs if d['category'] == 'Operations']
    context.finance_docs = [d for d in docs if d['category'] == 'Finance & Compliance']
    context.archive_docs = [d for d in docs if d['category'] == 'Archive & Attachments']
    context.stats = {
        'photos': len(photos),
        'docs': len(docs),
        'featured': len(context.featured_docs),
    }
