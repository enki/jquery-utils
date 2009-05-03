from django.conf.urls.defaults import *
from testapp.views import *

urlpatterns = patterns('',
    url(r'^$', index, name='testproject-index'),
)

