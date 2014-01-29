import datetime, json
from django.core import serializers
from django.http import HttpResponse, HttpRequest
from django.template import RequestContext
from django.shortcuts import render_to_response
from .form import UploadFileForm
from .process_data import process
from webapp.models import Recording
from webapp.models import Location
from process_data import export

def getRecording(lat1, lon1, lat2, lon2):
    data = Recording.objects
    data = data.filter(
                lat__gte=lat1
            ).filter(
                lon__gte=lon1
            ).filter(
                lat__lte=lat2
            ).filter(
                lon__lte=lon2
                )

    return data

def getLocation(fn):
    data = Location.objects
    data = data.filter(recording_assoc__file_name=fn)
    return data.order_by('loc_ID')

def getRecId(id):
    data = Recording.objects
    r = data.filter(file_ID = id)
    return r

def index(request):
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/index.html')
    
###########################################################
def tester(request):
	context = RequestContext(request)
	context_dict = {'boldmessage': "I am from context"}
	return render_to_response('webapp/tester.html')
#   return HttpResponse("<h3>This is MDRS' testing page.</h3>")
############################################################

def settings(request):
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/settings.html')

def about(request):
   return HttpResponse("<h3>This is MDRS' about page.</h3>")

def user(request):
#Hilarious code for deleteing stuff from the database since it's hard yo
    #data = Recording.objects
    #data = data.filter(file_name__exact="Basstest")
    #data.delete()
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/user.html', context_dict, context)

def submit(request):
    context = RequestContext(request)
    if request.method == 'GET':
        form = UploadFileForm()
    if request.method == 'POST':
        form = UploadFileForm(request.POST,request.FILES)
        if form.is_valid():
            return process(request.FILES['rec_file'], request.POST)
    return render_to_response('webapp/submit.html', {'form': form}, context)

def getdata(request, lat1, lon1, lat2, lon2):
    context = RequestContext(request)
    if request.method == 'GET':
        data = getRecording(lat1, lon1, lat2, lon2)
        export(data)
        data = serializers.serialize("json", data)
        return HttpResponse(data, "application/json")

def getroute(request, fn):
    context = RequestContext(request)
    if request.method == 'GET':
        data = getLocation(fn)
        data = serializers.serialize("json", data)
        return HttpResponse(data, "application/json")

def playSound(request, id):
    context = RequestContext(request)
    if request.method == 'GET':
        rec = getRecId(id)
        rec = serializers.serialize("json", rec)
        return HttpResponse(rec, "application/json")

