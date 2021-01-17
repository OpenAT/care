# -*- coding: utf-8 -*-

{
    'name': "form_jahresbericht",
    'summary': """care form_jahresbericht Web Form to collect information about the care jahresbericht delivery""",
    'description': """
care form_jahresbericht Web Form to collect information about the care jahresbericht delivery
    
    """,
    'author': "Michael Karrer",
    'website': "http://www.datadialog.net",
    'installable': True,
    'category': 'Uncategorized',
    'version': '0.2',
    'depends': [
        'fsonline'
    ],
    'data': [
        'security/ir.model.access.csv',
        'security/access_rules.xml',
        'views/form_jahresbericht_submission.xml',
    ],
}
