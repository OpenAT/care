# -*- coding: utf-8 -*-
from datetime import timedelta
import re

from openerp import models, fields, api
from openerp.exceptions import ValidationError
from openerp.tools import DEFAULT_SERVER_DATETIME_FORMAT


class FormJahresberichtSubmission(models.Model):
    _name = 'form_jahresbericht.submission'

    # FIELDS
    # ------
    # Partner (defaults to the partner of the logged in user)
    partner_id = fields.Many2one(comodel_name="res.partner",
                                 string="Partner",
                                 required=True,
                                 default=lambda self: self.env.user.partner_id)

    # Form Input Fields
    jahresbericht_paper = fields.Boolean("in gedruckter Form per Post")
    jahresbericht_email = fields.Boolean("als Online-Version (Link wird zugeschickt)")

    emergency_contact_optin = fields.Boolean("E-Mail im Notfall erlauben")
    emergency_contact_email = fields.Char("Notfall E-Mail Adresse")

    # Groups to assign for the computed fields (subscriptions)
    # (This is just a helper and should be set by the fso_form by default values)
    jahresbericht_paper_group = fields.Many2one(comodel_name="frst.zgruppedetail",
                                                string="Gruppe fuer Jahresbericht per Post",
                                                required=True)
    jahresbericht_email_group = fields.Many2one(comodel_name="frst.zgruppedetail",
                                               string="Gruppe fuer Jahresbericht per E-Mail",
                                               required=True)
    emergency_contact_group = fields.Many2one(comodel_name="frst.zgruppedetail",
                                              string="Gruppe fuer E-Mail im Notfall",
                                              required=True)

    # Computed Fields (generated or linked subscriptions)
    jahresbericht_paper_persongruppe = fields.Many2one(comodel_name="frst.persongruppe",
                                                       string="Anmeldung: Jahresbericht Papier",
                                                       compute="compute_jahresbericht_paper_persongruppe",
                                                       compute_sudo=True,
                                                       store=True)
    jahresbericht_email_persongruppe = fields.Many2one(comodel_name="frst.persongruppe",
                                                       string="Anmeldung: Jahresbericht E-Mail",
                                                       compute="compute_jahresbericht_email_persongruppe",
                                                       compute_sudo=True,
                                                       store=True)
    emergency_contact_personemailgruppe = fields.Many2one(comodel_name="frst.personemailgruppe",
                                                          string="Anmeldung: Notfall E-Mail",
                                                          compute="compute_emergency_contact_personemailgruppe",
                                                          compute_sudo=True,
                                                          store=True)

    # CONSTRAINS AND VALIDATIONS
    # --------------------------
    @api.constrains('partner_id', 'jahresbericht_paper', 'jahresbericht_email', 'emergency_contact_optin',
                    'emergency_contact_email', 'jahresbericht_paper_persongruppe', 'jahresbericht_email_persongruppe',
                    'emergency_contact_personemailgruppe')
    def _constrain_data_and_subscriptions(self):
        for r in self:
            if r.jahresbericht_paper:
                if not r.jahresbericht_paper_group:
                    raise ValidationError("Gruppe für 'jahresbericht_paper' fehlt!")
            if r.jahresbericht_email:
                if not r.jahresbericht_email_group:
                    raise ValidationError("Gruppe für 'jahresbericht_email' fehlt!")
            if r.emergency_contact_optin:
                if not r.emergency_contact_group:
                    raise ValidationError("Gruppe für 'emergency_contact_optin' fehlt!")
                if not r.emergency_contact_email:
                    raise ValidationError("Bitte geben Sie die E-Mail Adresse an!")
                if not re.match(r"[^@]+@[^@]+\.[^@]+", r.emergency_contact_email):
                    raise ValidationError("Die E-Mail Adresse scheint ungültig zu sein!")

    @api.multi
    def post_data_check(self):
        for r in self:
            # Computed subscriptions partner must match form submission partner
            if r.jahresbericht_paper:
                if not r.jahresbericht_paper_persongruppe:
                    raise ValidationError("Anmeldung 'jahresbericht_paper_persongruppe' fehlt!")
                if not r.jahresbericht_paper_persongruppe.partner_id.id == r.partner_id.id:
                    raise ValidationError("Die Person stimmt nicht mit 'jahresbericht_paper_persongruppe' überein!")
            if r.jahresbericht_email:
                if not r.jahresbericht_email_persongruppe:
                    raise ValidationError("Anmeldung 'jahresbericht_email_persongruppe' fehlt!")
                if not r.jahresbericht_email_persongruppe.partner_id.id == r.partner_id.id:
                    raise ValidationError("Die Person stimmt nicht mit 'jahresbericht_email_persongruppe' überein!")
            if r.emergency_contact_optin:
                if not r.emergency_contact_personemailgruppe:
                    raise ValidationError("Anmeldung 'emergency_contact_personemailgruppe' fehlt!")
                if not r.emergency_contact_personemailgruppe.frst_personemail_id.partner_id.id == r.partner_id.id:
                    raise ValidationError("Die Person stimmt nicht mit 'emergency_contact_personemailgruppe' überein!")

    # HELPER
    # ------
    @api.model
    def new_personemail(self, email, partner, replace_main_email=False):
        personemail_vals = {
            'email': email,
            'partner_id': partner.id,
        }
        if not replace_main_email and partner.main_personemail_id and partner.main_personemail_id.last_email_update:
            me_last_update = fields.datetime.strptime(partner.main_personemail_id.last_email_update,
                                                      DEFAULT_SERVER_DATETIME_FORMAT)
            personemail_vals['last_email_update'] = me_last_update - timedelta(days=1)
        return self.env['frst.personemail'].sudo().create(personemail_vals)

    # COMPUTED FIELDS
    # ---------------
    @api.depends('jahresbericht_paper', 'partner_id', 'jahresbericht_paper_group')
    def compute_jahresbericht_paper_persongruppe(self):
        for r in self:
            subscription = None
            # Subscription Exists
            if r.partner_id and r.jahresbericht_paper_group:
                subscription = self.env['frst.persongruppe'].sudo().search([
                    ('partner_id', '=', r.partner_id.id),
                    ('zgruppedetail_id', '=', r.jahresbericht_paper_group.id)],
                    limit=1, order='id')

            # SUBSCRIBE
            if r.jahresbericht_paper and r.partner_id and r.jahresbericht_paper_group:
                # Create Subscription
                if not subscription:
                    subscription = self.env['frst.persongruppe'].sudo().create({
                        'partner_id': r.partner_id.id,
                        'zgruppedetail_id': r.jahresbericht_paper_group.id,
                    })
                # Reactivate Subscription
                if subscription.state in ('unsubscribed', 'expired'):
                    subscription.activate()
                # Assign Subscription
                r.jahresbericht_paper_persongruppe = subscription.id

            # UNSUBSCRIBE
            if not r.jahresbericht_paper and subscription:
                if subscription.state not in ('unsubscribed', 'expired'):
                    subscription.write({'gueltig_bis': fields.datetime.now() - timedelta(days=1)})
                # Assign Subscription
                r.jahresbericht_paper_persongruppe = subscription.id

    @api.depends('jahresbericht_email', 'partner_id', 'jahresbericht_email_group')
    def compute_jahresbericht_email_persongruppe(self):
        for r in self:
            subscription = None
            # Subscription Exists
            if r.partner_id and r.jahresbericht_email_group:
                subscription = self.env['frst.persongruppe'].sudo().search([
                    ('partner_id', '=', r.partner_id.id),
                    ('zgruppedetail_id', '=', r.jahresbericht_email_group.id)],
                    limit=1, order='id')

            # SUBSCRIBE
            if r.jahresbericht_email and r.partner_id and r.jahresbericht_email_group:
                # Create Subscription
                if not subscription:
                    subscription = self.env['frst.persongruppe'].sudo().create({
                        'partner_id': r.partner_id.id,
                        'zgruppedetail_id': r.jahresbericht_email_group.id,
                    })
                # Reactivate Subscription
                if subscription.state in ('unsubscribed', 'expired'):
                    subscription.activate()
                # Assign Subscription
                r.jahresbericht_email_persongruppe = subscription.id

            # UNSUBSCRIBE
            if not r.jahresbericht_email and subscription:
                if subscription.state not in ('unsubscribed', 'expired'):
                    subscription.write({'gueltig_bis': fields.datetime.now() - timedelta(days=1)})
                # Assign Subscription
                r.jahresbericht_email_persongruppe = subscription.id

    @api.depends('emergency_contact_optin', 'emergency_contact_email', 'partner_id', 'emergency_contact_group')
    def compute_emergency_contact_personemailgruppe(self):
        for r in self:
            pemail = None
            if r.emergency_contact_email and r.partner_id:
                # Get frst.personemail
                pemail = self.env['frst.personemail'].sudo().search([('email', '=ilike', r.emergency_contact_email),
                                                                     ('partner_id', '=', r.partner_id.id)])
                assert len(pemail) < 2, "Mehr als eine Email gefunden für %s %s!" % (
                    r.partner_id.id, r.emergency_contact_email)

            # Subscription Exists
            subscription = None
            if pemail and r.emergency_contact_group:
                subscription = self.env['frst.personemailgruppe'].sudo().search([
                    ('frst_personemail_id', '=', pemail.id),
                    ('zgruppedetail_id', '=', r.emergency_contact_group.id)],
                    limit=1, order='id')

            # SUBSCRIBE
            if r.emergency_contact_optin and r.emergency_contact_email and r.partner_id and r.emergency_contact_group:
                # Create Personemail
                if not pemail:
                    pemail = self.new_personemail(r.emergency_contact_email, r.partner_id, replace_main_email=False)
                # Create Subscription
                if not subscription:
                    subscription = self.env['frst.personemailgruppe'].sudo().create({
                        'frst_personemail_id': pemail.id,
                        'zgruppedetail_id': r.emergency_contact_group.id,
                    })
                # Reactivate Subscription
                if subscription.state in ('unsubscribed', 'expired'):
                    subscription.activate()
                # Assign Subscription
                r.emergency_contact_personemailgruppe = subscription.id

            # UNSUBSCRIBE
            if not r.emergency_contact_optin and subscription:
                if subscription.state not in ('unsubscribed', 'expired'):
                    subscription.write({'gueltig_bis': fields.datetime.now() - timedelta(days=1)})
                # Assign Subscription
                r.emergency_contact_personemailgruppe = subscription.id

    # ----
    # CRUD
    # ----
    @api.model
    def create(self, vals):
        record = super(FormJahresberichtSubmission, self).create(vals)

        # To check the data AFTER the computed fields we do it here
        record.post_data_check()

        return record

    @api.multi
    def write(self, vals):
        res = super(FormJahresberichtSubmission, self).write(vals)

        # To check the data AFTER the computed fields we do it here
        if res:
            self.post_data_check()

        return res
