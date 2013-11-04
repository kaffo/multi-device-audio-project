from django.http import HttpResponse
from django.http import HttpRequest
from django.template import RequestContext
from django.shortcuts import render_to_response

def index(request):
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/index.html', context_dict, context)

def about(request):
   return HttpResponse("<h3>This is MDRS' about page.</h3>")

def submit(request):
    if request.method == 'GET':
	return HttpResponse("Invalid page request")
    if request.method == 'POST':
	return HttpResponse("Submit test message")
        return request.FILES
