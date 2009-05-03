# -*- coding: utf-8 -*-

from django import forms

from testproject.testapp.models import *

class TestForm(forms.Form):
    name        = forms.CharField(label=u"Name",    required=True,  max_length=50)
    phone       = forms.CharField(label=u"Phone",   required=False, max_length=50)
    fax         = forms.CharField(label=u"Fax",     required=False, max_length=50)
    email       = forms.EmailField(label=u"Email",  required=False, max_length=75)
    website     = forms.URLField(label=u"Website",  required=False, max_length=200)
    notes       = forms.CharField(label=u"Notes",   required=False, widget=forms.Textarea)
    address     = forms.CharField(label=u"Address", required=False, max_length=200)
    city        = forms.CharField(label=u"City",    required=False, max_length=100)
    state       = forms.CharField(label=u"State/Province", required=False, max_length=100)
    country     = forms.CharField(label=u"Country", required=False, max_length=100)
    zipcode     = forms.CharField(label=u"Postal/Zip code", required=False, max_length=10)

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


