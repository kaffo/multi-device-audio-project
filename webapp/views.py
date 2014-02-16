import datetime, json
from django.core import serializers
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.shortcuts import render_to_response
from .form import UploadFileForm, UserForm
from .process_data import process
from webapp.models import Recording, Location, UserAcc
from process_data import export
from process_data import simplifiedConvert
import os

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
    return render_to_response('webapp/index.html', context_dict, context)

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
    return render_to_response('webapp/settings.html', context_dict, context)

def about(request):
   return HttpResponse("<h3>This is MDRS' about page.</h3>")

def user(request):
#Hilarious code for deleteing stuff from the database since it's hard yo
#    data = Recording.objects
#    data = data.filter(file_name__exact="Test")
#    print data
#    print UserAcc.objects
#    user = UserAcc.objects.filter(user__exact=request.user)[0]
#    print user
#    user.recs.add(data[0])
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
            return process(request.FILES['json_file'], request.FILES['threeGP_file'], request.POST, request.user)

    return render_to_response('webapp/submit.html', {'form': form}, context)

def submit_success(request):
    return render_to_response('webapp/submitsuccess.html')

def mobile_upload(request):
    context = RequestContext(request)
    if request.method == 'GET':
        form = UploadFileForm()
    if request.method == 'POST':
        form = UploadFileForm(request.POST,request.FILES)
        print(form)
        if form.is_valid():
            return process(request.FILES['json_file'], request.FILES['threeGP_file'], request.POST, request.user)
    return render_to_response('webapp/mobile_upload.html', {'form': form}, context)

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

def getRecs(request):
    context = RequestContext(request)
    if request.method == 'GET':
        data = Recording.objects.all()
        data = serializers.serialize("json", data)
        return HttpResponse(data,"application/json")

def getUserRecs(request, username):
    context = RequestContext(request)
    if request.method == 'GET':
        user = User.objects.get(username = username)
        useracc = UserAcc.objects.filter(user__exact=user)[0]
        userrecs = useracc.recs.all()
        data = []
        for item in userrecs:
            data = data + [item.file_name]
        #data = serializers.serialize("json", data)
        return HttpResponse(data)

def playSound(request, id):
    context = RequestContext(request)
    if request.method == 'GET':
        rec = getRecId(id)
        rec = serializers.serialize("json", rec)
        return HttpResponse(rec, "application/json")

def convert(request, fN):
    context = RequestContext(request)
    ext = os.path.splitext(fN)[1]
    response = HttpResponse()
    if(fN == '3gp' and os.path.isfile("../static/data/" + fN)):
        simplifiedConvert(fN)
        response.write("Success!")
    else:
	    response.write("Error!")
    return response


def register(request):
    context = RequestContext(request)

    registered = False

    if request.method == 'POST':
        user_form = UserForm(data=request.POST)

        if user_form.is_valid():
            user = user_form.save()

            user.set_password(user.password)
            user.save()

            useracc = UserAcc(user = user)

            useracc.save()

            registered = True

        else:
            print user_form.errors

    else:
        user_form = UserForm()

    return render_to_response(
            'webapp/register.html',
            {'user_form': user_form, 'registered': registered},
            context)

def user_login(request):
    context = RequestContext(request)

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/webapp/')
            else:
                return HttpResponse("<center><h1>Your account has been disabled!</h1></center>")
        else:
            print "Invalide login details: '{0}', '{1}'".format(username, password)
            return HttpResponse("Invalid Login Details supplied.")

    else:
        return render_to_response('webapp/login.html', {}, context)

@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/webapp/')
