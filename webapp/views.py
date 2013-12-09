from django.http import HttpResponse, HttpRequest
from django.template import RequestContext
from django.shortcuts import render_to_response
from .form import UploadFileForm
from .process_data import process

def index(request):
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/index.html', context_dict, context)

def settings(request):
    return HttpResponse("<h3>This is MDRS' settings page.</h3>")
    
def about(request):
   return HttpResponse("<h3>This is MDRS' about page.</h3>")

def submit(request):
    context = RequestContext(request)
    if request.method == 'GET':
        form = UploadFileForm()
    if request.method == 'POST':
        form = UploadFileForm(request.POST,request.FILES)
        if form.is_valid():
            process(request.FILES['data_file'], request.POST)
            return HttpResponse("<h1>Upload Success!</h1>")
    return render_to_response('webapp/submit.html', {'form': form}, context)

