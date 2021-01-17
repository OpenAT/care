# -*- coding: utf-8 -*-

from openerp.tests import common
from openerp.tools.safe_eval import safe_eval
from openerp import fields
from datetime import datetime
from datetime import timedelta
from openerp.exceptions import ValidationError

import logging
logger = logging.getLogger(__name__)


class TestFormJahresberichtSubmission(common.TransactionCase):
    def setUp(self):
        super(TestFormJahresberichtSubmission, self).setUp()

        # Default test email address
        # ATTENTION: Must not match any existing e-mail in the database!
        self.email = u'test.email.djkeiu388hhja8h3rh8asdefh@test.com'

        # Group Folder for Person Groups
        self.group_folder_person = self.env['frst.zgruppe'].create({
            'tabellentyp_id': '100100',         # Person
            'gruppe_kurz': 'TestGroupFolder Person',
            'gruppe_lang': 'TestGroupFolder Person',
            'geltungsbereich': 'local',
        })
        # jahresbericht_paper_group
        self.jahresbericht_paper_group = self.env['frst.zgruppedetail'].create({
            'zgruppe_id': self.group_folder_person.id,
            'gruppe_lang': 'jahresbericht_paper_group',
            'gruppe_kurz': 'jahresbericht_paper_group',
            'geltungsbereich': 'local',
        })
        # jahresbericht_email_group
        self.jahresbericht_email_group = self.env['frst.zgruppedetail'].create({
            'zgruppe_id': self.group_folder_person.id,
            'gruppe_lang': 'jahresbericht_email_group',
            'gruppe_kurz': 'jahresbericht_email_group',
            'geltungsbereich': 'local',
        })

        # Group Folder for E-Mail Groups
        self.group_folder_email = self.env['frst.zgruppe'].create({
            'tabellentyp_id': '100110',         # Email
            'gruppe_kurz': 'TestGroupFolder Email',
            'gruppe_lang': 'TestGroupFolder Email',
            'geltungsbereich': 'local',
        })
        # emergency_contact_group
        self.emergency_contact_group = self.env['frst.zgruppedetail'].create({
            'zgruppe_id': self.group_folder_email.id,
            'gruppe_lang': 'emergency_contact_group',
            'gruppe_kurz': 'emergency_contact_group',
            'geltungsbereich': 'local',
        })

        # Create a new public user.
        public_group_id = self.ref("base.group_public")
        self.public_user = self.env['res.users'].create({
            'login': self.email,
            'name': u'Public Test User',
            "groups_id": [(6, 0, [public_group_id])]
        })
        self.assertTrue(self.public_user.has_group('base.group_public'))
        self.assertFalse(self.public_user.has_group('base.group_user'))
        self.public_user_partner = self.public_user.partner_id

        # Create a new public user environment for 'form_jahresbericht.submission'
        self.public_user_env = self.env['form_jahresbericht.submission'].sudo(user=self.public_user.id)
        self.assertTrue(self.public_user_partner.id == self.public_user_env.env.user.partner_id.id)

    def test_01_create_submission_all_new(self):
        # Create a new form submission as the public user
        submission = self.public_user_env.create({
            # Form Input Fields
            'jahresbericht_paper': True,
            'jahresbericht_email': True,
            'emergency_contact_optin': True,
            'emergency_contact_email': 'submission@email.com',
            # Groups to assign the subscriptions to
            'jahresbericht_paper_group': self.jahresbericht_paper_group.id,
            'jahresbericht_email_group': self.jahresbericht_email_group.id,
            'emergency_contact_group': self.emergency_contact_group.id,
        })

        pup_id = self.public_user_env.env.user.partner_id.id
        self.assertTrue(pup_id == self.public_user_partner.id)

        # Check the linked partner
        self.assertTrue(submission.create_uid.partner_id.id == pup_id)
        self.assertTrue(submission.partner_id.id == pup_id)

        # Check the computed fields
        self.assertTrue(submission.jahresbericht_paper_persongruppe.partner_id.id == pup_id)
        self.assertTrue(submission.jahresbericht_paper_persongruppe.zgruppedetail_id.id == self.jahresbericht_paper_group.id)

        self.assertTrue(submission.jahresbericht_email_persongruppe.partner_id.id == pup_id)
        self.assertTrue(submission.jahresbericht_email_persongruppe.zgruppedetail_id.id == self.jahresbericht_email_group.id)

        self.assertTrue(submission.emergency_contact_personemailgruppe.frst_personemail_id.partner_id.id == pup_id)
        self.assertTrue(submission.emergency_contact_personemailgruppe.zgruppedetail_id.id == self.emergency_contact_group.id)

    def test_02_create_submission_all_existing_email(self):
        # Create a new form submission as the public user
        submission = self.public_user_env.create({
            # Form Input Fields
            'jahresbericht_paper': True,
            'jahresbericht_email': True,
            'emergency_contact_optin': True,
            'emergency_contact_email': self.email,
            # Groups to assign the subscriptions to
            'jahresbericht_paper_group': self.jahresbericht_paper_group.id,
            'jahresbericht_email_group': self.jahresbericht_email_group.id,
            'emergency_contact_group': self.emergency_contact_group.id,
        })

        self.assertTrue(self.public_user_partner.main_personemail_id.email == submission.emergency_contact_email)
        self.assertTrue(submission.emergency_contact_personemailgruppe.frst_personemail_id.id == self.public_user_partner.main_personemail_id.id)

    def test_03_update_submission_with_new_email(self):
        # Create a new form submission as the public user
        submission = self.public_user_env.create({
            # Form Input Fields
            'jahresbericht_paper': True,
            'jahresbericht_email': True,
            'emergency_contact_optin': True,
            'emergency_contact_email': self.email,
            # Groups to assign the subscriptions to
            'jahresbericht_paper_group': self.jahresbericht_paper_group.id,
            'jahresbericht_email_group': self.jahresbericht_email_group.id,
            'emergency_contact_group': self.emergency_contact_group.id,
        })

        submission.write({
            'emergency_contact_email': 'another@email.com'
        })
