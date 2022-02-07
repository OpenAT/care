# -*- coding: utf-'8' "-*-"
from openerp import api, models, fields

__author__ = 'Joachim Grubelnik'


# Product Template
class ProductTemplate(models.Model):
    _inherit = 'product.template'

    website_theme = fields.Selection(selection_add=[('care_inline', 'Care Inline')])
