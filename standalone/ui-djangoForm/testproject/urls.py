from django.conf.urls.defaults import *

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', include('testproject.testapp.urls')),
    (r'^admin/(.*)', admin.site.root),
)
