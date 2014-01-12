import datetime, json
from django.core import serializers
from django.http import HttpResponse, HttpRequest
from django.template import RequestContext
from django.shortcuts import render_to_response
from .form import UploadFileForm
from .process_data import process
from webapp.models import Recording

def getRecording(lat1, lon1, lat2, lon2):
    data = Recording.objects
    data = data.filter(lat__gte=lat1)
    data = data.filter(lon__gte=lon1)
    data = data.filter(lat__lte=lat2)
    data = data.filter(lon__lte=lon2)
    return data

def index(request):
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/index.html', context_dict, context)

def settings(request):
    return HttpResponse("<h3>This is MDRS' settings page.</h3>")

def about(request):
   return HttpResponse("<h3>This is MDRS' about page.</h3>")

def user(request):
    rec = Recording(file_name = "test.ogg", length = 0.01, start_time = datetime.datetime.today(), end_time = datetime.datetime.today(), description = "Hello", rec_file = "file/path", lon = 5.0, lat = 5.0)
    rec.save()
    return HttpResponse("<h3>This is a user's account page.</h3>")

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

def getdata(request, lat1, lon1, lat2, lon2):
    context = RequestContext(request)
    if request.method == 'GET':
        data = getRecording(lat1, lon1, lat2, lon2)
        data = serializers.serialize("json", Recording.objects.all())
        return HttpResponse(data, "application/json")
