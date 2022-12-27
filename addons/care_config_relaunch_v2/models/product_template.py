# -*- coding: utf-'8' "-*-"
from openerp import api, models, fields


# Product Template
class ProductTemplate(models.Model):
    _inherit = 'product.template'

    website_theme = fields.Selection(selection_add=[('care_multistep', 'Care Multi-Step')])
