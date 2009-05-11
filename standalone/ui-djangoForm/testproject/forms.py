# Use FormBase only if you are using Django < 1.1
# This hotfix is required to wrap help_text in a 
# span element, thus making it skinnable with CSS.
#
# Reference:
# http://code.djangoproject.com/ticket/8426

from django import forms

class PatchedForm(forms.Form):
    def as_ul(self):
        return self._html_output(u'<li>%(errors)s%(label)s %(field)s<span class="helptext">%(help_text)s</span></div>', u'<li>%s</li>', '</li>', u'%s', False)           

    def as_table(self): 
        return self._html_output(u'<tr><th>%(label)s</th><td>%(errors)s%(field)s<span class="helptext">%(help_text)s</span></td></tr>', u'<tr><td colspan="2">%s</td></tr>', '</td></tr>', u'%s', False) 

    def as_p(self): 
        return self._html_output(u'<p>%(label)s %(field)s<span class="helptext">%(help_text)s</span></p>', u'%s', '</p>', u'%s', True)
