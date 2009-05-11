# -*- coding: utf-8 -*-

# Use FormBase only if you are using Django < 1.1
# This hotfix is required to wrap help_text in a 
# span element, thus making it skinnable with CSS.
#
# Reference:
# http://code.djangoproject.com/ticket/8426

from testproject.forms import PatchedForm

from django import forms
from testproject.testapp.models import *

class TestForm(PatchedForm):
    boolean        = forms.BooleanField(label=u"Boolean")
    char           = forms.CharField(label=u"Char field", required=True,  max_length=50, min_length=3, help_text="required, max length: 50, min length: 3")
    date           = forms.DateField(label="Date", required="false")
    datetime       = forms.DateTimeField(label="DateTime")
    decimal        = forms.DecimalField(label="Decimal", decimal_places=3, max_digits=3, help_text="Decimal places: 3, max digits: 3", required="false")
    email          = forms.EmailField(label=u"Email", required="false")
    float          = forms.FloatField(label="Float", required="false")
    integer        = forms.IntegerField(label="Integer", required="false")
    ipAddress      = forms.IPAddressField(label="IP address", required="false")
    slug           = forms.CharField(label="Slug", max_length=15, help_text="Max length: 15", required="false")
    time           = forms.TimeField(label="Time", required="false")
    url            = forms.URLField(label=u"URL", required="false")

    def clean_name(self):
        if not self.cleaned_data['name'][0].isalnum():
            raise forms.ValidationError(u"Name must begin with a letter or a number.")
        return self.cleaned_data['name']

    def _save(self, user, client=None):
        if self.is_valid():
            client.name        = self.cleaned_data['name']
            client.phone       = self.cleaned_data['phone']
            client.fax         = self.cleaned_data['fax']
            client.email       = self.cleaned_data['email']
            client.website     = self.cleaned_data['website']
            client.notes       = self.cleaned_data['notes']
            client.address     = self.cleaned_data['address']
            client.city        = self.cleaned_data['city']
            client.state       = self.cleaned_data['state']
            client.country     = self.cleaned_data['country']
            client.owner       = user.id
            print client.owner
            client.zipcode = self.cleaned_data['zipcode']
            client.save()
            return u'Added client: "%s" ' % self.cleaned_data['name']
        else:
            return u"Please correct the following errors"

    def create(self, user):
        return self._save(user, Test())

    def update(self, user, test):
        return self._save(user, test)


