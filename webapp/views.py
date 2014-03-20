import os
import datetime, json
from django.core import serializers
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext
from django.shortcuts import render_to_response
from form import UploadFileForm, UserForm
from process_data import process, export, simplifiedConvert
from webapp.models import Recording, Location, UserAcc, Image

# Get recording with a specific start and end time.
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

# Get the location of a recording based on its id.
def getLocation(id):
    data = Location.objects
    data = data.filter(recording_assoc__file_ID=id)
    return data.order_by('loc_ID')

# Get a recording's file based on its id.
def getRecId(id):
    data = Recording.objects
    r = data.filter(file_ID = id)
    return r

# Render the index page, exporting all recordings to JSON for the page to show.
def index(request):
    context = RequestContext(request)
    context_dict = {}
    export('all')
    return render_to_response('webapp/index.html', context_dict, context)

###########################################################
def tester(request):
	context = RequestContext(request)
	context_dict = {'boldmessage': "I am from context"}
	return render_to_response('webapp/tester.html')
#   return HttpResponse("<h3>This is MDRS' testing page.</h3>")
############################################################

# Render settings page
def settings(request):
    context = RequestContext(request)
    context_dict = {}
    return render_to_response('webapp/settings.html', context_dict, context)

# Render the about page. Just a straight HttpResonse. Low priority.
def about(request):
   return HttpResponse("<h3>This is MDRS' about page.</h3>")

# Render the user's page, checking if a user is currently logged in.
def user(request):
    if request.user.is_authenticated():
        export(request.user)
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/user.html', context_dict, context)

# Takes a file name and converts it from .AAC to .OGG
def convert(request, fN):
    context = RequestContext(request)
    ext = os.path.splitext(fN)[1]
    response = HttpResponse()
    if(fN == 'aac' and os.path.isfile("../static/data/" + fN)):
        simplifiedConvert(fN)
        response.write("Success!")
    else:
	    response.write("Error!")
    return response


def submit(request):
    context = RequestContext(request)
    if request.method == 'GET':
        form = UploadFileForm()
    if request.method == 'POST':
        form = UploadFileForm(request.POST,request.FILES)

        name = form['aac_file']

        if form.is_valid():

            #convert(request, name)

            return process(request.FILES['json_file'], request.FILES['aac_file'], request.POST, request.user)

    return render_to_response('webapp/submit.html', {'form': form}, context)

def submit_success(request):
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/submitsuccess.html', context_dict, context)

@csrf_exempt
def upload(request):
    context = RequestContext(request)

    uploaded = False

    #If the request is a POST
    if request.method == 'POST':
        print("Recieved POST request")

        upload_form = UploadFileForm(data=request.POST)

        #Checking validity of form and if files are there.
        if upload_form.is_valid():
            print("Upload form is valid")

            upload = upload_form.save(commit=False)

            if 'aac_file' in request.FILES:
              print("Audio file detected in POST. Adding to upload_form")
              upload.aac_file = request.FILES['aac_file']

            if 'json_file' in request.FILES:
              print("JSON file detected in POST. Adding to upload_form")
              upload.json_file = request.FILES['json_file']

            if 'images_file' in request.FILES:
              print("Images file detected in POST. Adding to upload_form")
              upload.images_file = request.FILES['images_file']

            print("Entering process() from upload()")
            # A function to process the 3 files and save them to the database.
            process(request.FILES['json_file'],
                    request.FILES['aac_file'],
                    request.FILES['images_file'],
                    request.POST,
                    request.user)

            upload.save()

            uploaded = True

        else:
          print upload_form.errors

    else:
      print("Not a POST request. Returning blank forms.")
      upload_form = UploadFileForm()

    if (uploaded == True):
      return render_to_response("webapp/submitsuccess.html",
                                {'uploaded':uploaded},
                                context)

    return render_to_response('webapp/upload.html', {}, context)

def getdata(request, lat1, lon1, lat2, lon2):
    context = RequestContext(request)
    if request.method == 'GET':
        data = getRecording(lat1, lon1, lat2, lon2)
        #export(data)
        data = serializers.serialize("json", data)
        return HttpResponse(data, "application/json")

# Get path of a recording with id in params
def getroute(request, id):
    context = RequestContext(request)
    if request.method == 'GET':
        data = getLocation(id)
        data = serializers.serialize("json", data)
        return HttpResponse(data, "application/json")

# Get all recordings
def getRecs(request):
    context = RequestContext(request)
    if request.method == 'GET':
        data = Recording.objects.all()
        data = serializers.serialize("json", data)
        return HttpResponse(data,"application/json")

# Get all images associated by particular id
def getImagesByID(request, id):
    context = RequestContext(request)
    if request.method == 'GET':
        data = Image.objects.all()
        exp = data.filter(recording_assoc__file_ID=id)
        exp = serializers.serialize("json", exp)
        return HttpResponse(exp, "application/json")

# Get specific recording by its id
def getrecbyid(request, id):
    context = RequestContext(request)
    if request.method == 'GET':
        data = getRecId(id)
        data = serializers.serialize("json", data)
        return HttpResponse(data,"application/json")

# Get all of a specific user's recordings
def getUserRecs(request, username):
    context = RequestContext(request)
    if request.method == 'GET':
        user = User.objects.get(username = username)
        useracc = UserAcc.objects.filter(user__exact=user)[0]
        userrecs = useracc.recs.all()
        data = serializers.serialize("json", userrecs)
        return HttpResponse(data, "application/json")

# Self-explanitory
def playSound(request, id):
    context = RequestContext(request)
    if request.method == 'GET':
        rec = getRecId(id)
        rec = serializers.serialize("json", rec)
        return HttpResponse(rec, "application/json")

# Delete recording
def deleteRec(request, id):
    context = RequestContext(request)
    if request.method == 'GET':
        if request.user.is_authenticated() == False:
            return HttpResponse("<h1>Error, please log in!</h1>")
        username = request.user.username
        rec = getRecId(id)
        if rec.count() < 1:
            return HttpResponse("<h1>No Recording With this ID</h1>")
        user = User.objects.get(username = username)
        useracc = UserAcc.objects.filter(user__exact=user)[0]
        print useracc
        userrecs = useracc.recs.filter(file_ID__exact=rec[0].file_ID)
        print userrecs
        if userrecs.count() > 0 or user.is_superuser:
            rec.delete()
            return HttpResponse("<h1>Recording Deleted</h1>")
        return HttpResponse("<h1>Error, you are not the owner of this file!</h1>")

# Registration
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

# User login
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

# User logout
@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/webapp/')
