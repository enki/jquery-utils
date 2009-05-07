from django.template import RequestContext
from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.shortcuts import get_object_or_404, render_to_response

from testapp.models import Test
from testapp.forms import TestForm
def view_form(request, type):
    message = None
    if request.method == 'POST':
        test_form = TestForm(request.POST)
        message = test_form.create(request.user)
        if test_form.is_valid():
            url = reverse('client_list')
            return HttpResponseRedirect(url)
    else:
        test_form = TestForm()
    return render_to_response('test/form-as-%s.html' % type,
                              {'form': test_form,
                               'message': message,
                              }, context_instance=RequestContext(request))


def index(request):
    return render_to_response('test/edit.html',{}, context_instance=RequestContext(request))

