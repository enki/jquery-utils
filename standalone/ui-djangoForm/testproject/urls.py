from django.conf.urls.defaults import *

from django.contrib import admin
from django.conf import settings
admin.autodiscover()

urlpatterns = patterns('',
    (r'^', include('testproject.testapp.urls')),
    (r'^admin/(.*)', admin.site.root),
)

# Serving static content in development mode.
if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^media/(.*)$', 'django.views.static.serve', {'document_root': 'media', 'show_indexes': True}),
    )

