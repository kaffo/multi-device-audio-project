from django.http import HttpResponse, HttpRequest
from django.template import RequestContext
from django.shortcuts import render_to_response
from .form import UploadFileForm

def index(request):
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/index.html', context_dict, context)

def about(request):
   return HttpResponse("<h3>This is MDRS' about page.</h3>")

def submit(request):
    context = RequestContext(request)
    if request.method == 'GET':
        form = UploadFileForm()
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        print("Recieved File")
        if form.is_valid():
            return HttpResponse("<h1>Upload Success!</h1>")
    return render_to_response('webapp/submit.html', {'form': form}, context)

