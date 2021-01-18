# -*- coding: utf-8 -*-
##############################################################################
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

from openerp.http import request

import logging
_logger = logging.getLogger(__name__)

from openerp.addons.fso_forms.controllers.controller import FsoForms


class FsoFormsCareJahresbericht(FsoForms):

    def _prepare_kwargs_for_form(self, form, record=None, **kwargs):
        kwargs = super(FsoFormsCareJahresbericht, self)._prepare_kwargs_for_form(form, record=record, **kwargs)

        if form and form.model_id and form.model_id.name == "form_jahresbericht.submission":
            _logger.info("_prepare_kwargs_for_form() for form_jahresbericht.submission!")
            if 'emergency_contact_email' not in kwargs:
                if self.is_logged_in():
                    if request.env.user.partner_id and request.env.user.partner_id.email:
                        _logger.info("_prepare_kwargs_for_form(): Append partner email of logged in user!")
                        kwargs['emergency_contact_email'] = request.env.user.partner_id.email

        return kwargs
