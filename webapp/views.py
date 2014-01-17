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
    data = data.filter(
                lat__gte=lat1
            ).filter(
                lon__gte=lon1
            ).filter(
                lat__lte=lat2
            ).filter(lon__lte=lon2)

    return data

def index(request):
    context = RequestContext(request)
    context_dict = {'boldmessage': "I am from context"}
    return render_to_response('webapp/index.html')

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
            process(request.FILES['rec_file'], request.POST)
            return HttpResponse("<h1>UPLOAD SUCCESS, BUT MAKE ME A DAMN HTML PAGE PLEASE</h1>")
    return render_to_response('webapp/submit.html', {'form': form}, context)

def getdata(request, lat1, lon1, lat2, lon2):
    context = RequestContext(request)
    if request.method == 'GET':
        data = getRecording(lat1, lon1, lat2, lon2)
        data = serializers.serialize("json", data)
        return HttpResponse(data, "application/json")
		
#hurts

def saveJSON():
	#json_serializer = serializers.get_serializer("json")()
	json_serializer = serializers.get_serializer("json")()
	with open("../static/scripts/data.json", "w") as out:
			json_serializer.serialize(Recording.objects.all(), stream=out)
			#HttpResponse(simplejson.dumps(items_list),'application/json'))
			

'''

def saveJSON():
	
	
	#template
	
	serialized = [{

"timeline":

{

"date": [
            {
                "startDate":Recording.start_time,
                "endDate":Recording.end_time,
                "headline":Recording.file_name,
                "text":Recording.description,
                #"tag":"This is Optional",
                #"classname":"optionaluniqueclassnamecanbeaddedhere",
                "asset": {
                    #"media":Recording.image_assoc,
                    #"thumbnail":"optional-32x32px.jpg",
                    #"credit":"Credit Name Goes Here",
                    #"caption":"Caption text goes here"
                }
            }
        ],
		
        "era": [
            {
                "startDate":Recording.start_time,
                "endDate":Recording.end_time,
                "headline":Recording.file_name,
                "text":Recording.description, #+ html <img />
                #"tag":"This is Optional",
            }

        ]

}

}]
	
	
	json_serializer = serializers.get_serializer("json")()
	with open("../static/scripts/data.json", "w") as out:
			json_serializer.serialize(serialized, stream=out)
			#HttpResponse(simplejson.dumps(items_list),'application/json'))
			
'''