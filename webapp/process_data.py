from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
import datetime, json
from webapp.models import Event, Recording, Image, Location, UserAcc
from django.core.serializers.json import DjangoJSONEncoder
import time

FFMPEG_BIN = "ffmpeg"
import subprocess as sp
#import numpy
import os


def process(json_file, threeGP_file, data, user):

    json_extn = json_file.name.split('.')[-1]
    threeGP_extn = threeGP_file.name.split('.')[-1]

    if (json_extn != "json"):
        return  HttpResponse("<h1>Please upload an json file!</h1>")
    if (threeGP_extn != "3gp"):
        return HttpResponse("<h1>Please upload a 3gp file!</h1>")

    data = json.load(json_file)

    path = 'static/data/' + str(data[0]["title"]) + ".3gp"
    
    with open(path, 'wb+') as destination:
        for chunk in threeGP_file.chunks():
            destination.write(chunk)

    rec = Recording(
        file_name = str(data[0]["title"]),
        description = str(data[0]["description"]),
        length = (int(data[0]["endTime"]) - int(data[0]["startTime"])),
        start_time = datetime.datetime.fromtimestamp(int(data[0]["startTime"])/1000),
        end_time = datetime.datetime.fromtimestamp(int(data[0]["endTime"])/1000),
        rec_file = (str(data[0]["title"]) + ".ogg"),
        lon = data[1][0]["lon"],
        lat = data[1][0]["lat"]
    )

    rec.save()

    for i in range(1, len(data[1])):
        loc = Location(
            recording_assoc = rec,
            lon = data[1][i]["lon"],
            lat = data[1][i]["lat"],
            image = "",
            alt = data[1][i]["altitude"],
            time = datetime.datetime.fromtimestamp(int(data[1][i]["time"])/1000)
        )

        loc.save()

    if user.is_authenticated():
        useracc = UserAcc.objects.filter(user__exact=user)[0]
        useracc.recs.add(rec)
        
    #this function call converts the file from .3gp to .ogg
    #below the new file name with an ogg extension is saved to the database
    simplifiedConvert(threeGP_file)

    return HttpResponseRedirect('/webapp/submitsuccess')



#hurts

def test():
	#json_serializer = serializers.get_serializer("json")()
	json_serializer = serializers.get_serializer("json")()
	with open("../static/scripts/data.json", "w") as out:
			json_serializer.serialize(Recording.objects.all(), stream=out)
			#HttpResponse(simplejson.dumps(items_list),'application/json'))


#JSON export for timeline

def export(data):
	recs = []

	for recording in Recording.objects.all():

		rec_data = {
			"startDate":recording.start_time.strftime("%Y,%m,%d %H,%M"),
			"endDate":recording.end_time.strftime("%Y,%m,%d %H,%M"),
			"headline":recording.file_name,
			"text":"<button id='play' class='pure-button pure-button-primary' onclick='playS(10);'>Play</button><p>Length: " + str(recording.length) + "\n" + "Event: " + str(recording.event_assoc) + "\n" + recording.description + "</p>", #HTML + IMG rec. description
			"asset": {
				"media":"https://maps.google.com/?q=" + str(recording.lat) + "," + str(recording.lon), #recording.rec_file.url, http://link_to_recording_file_music_player
				"caption":"ID" + str(recording.file_ID)
			}
		}

		recs.append(rec_data)


	serialized = {
		"timeline":
		{
			"headline":"MDAP timeline",
			"type":"default",
			"text":"<p>Here is your personal MDAP timeline.</p>",
			"asset": {
				"media":"http://mdap.org/images/icon.png",
				"caption":"Multi Device Recording System"
			},
			"date": recs

		}
	}

	with open('./static/scripts/data.json', 'w') as outp:
		json.dump(serialized, outp)

#simplified convert
# using ffmpeg default conversion settings
def simplifiedConvert(fileName):
	path = "../static/data/"
	fileName = path + os.path.splitext(fileName)[0] + '.tar.gz'
	fileNew = path + os.path.splitext(fileName)[0] + '.ogg'

	p = sp.Popen(["curl", "tar -xvf", fileName,"|" ,FFMPEG_BIN, "-i", fileName, "-acodec", "libvorbis", fileNew], stdout=subprocess.PIPE)



#more complex function with parameters for configuring quality:
#bitrate, audio channels, Hz, etc

def convertOGG(fileName):

	path = "../static/data/"
	fileName = path + fileName
	fileNew = path + os.path.splitext(fileName)[0] + '.ogg'

	data = sp.Popen([ FFMPEG_BIN,
        '-i', fileName,
        '-f', 's16le',
        '-acodec', 'libamr_nb',
        '-ar', '44100', # o 44100 Hz
        '-ac', '2', # channels
        '-'],
        stdin=sp.PIPE, stdout=sp.PIPE, stderr=sp.PIPE)

	raw = data.proc.stdout.read(88200*4) #save audio
	audio = numpy.fromstring(raw, dtype="int16")
	audio = audio.reshape((len(audio)/2,2)) #reorganize

	data = sp.Popen([ FFMPEG_BIN,
       '-y', # overwrite if such name exists
       "-f", 's16le', # 16bit
       "-acodec", "libamr_nb", # raw
       '-r', "44100", # 44100 Hz
       '-ac','2', #2 channels
       '-i', '-', # pipe input
       '-vn', # no video
       '-acodec', "libvorbis" # output audio codec
       '-b', "3000k", # output bitrate (=quality). Here, 3000kb/second
       fileNew ],
        stdin=sp.PIPE,stdout=sp.PIPE, stderr=sp.PIPE)

	audio.astype("int16").tofile(self.proc.stdin)

'''
OLD PYMEDIA METHOD

def convertOGG(fileName):
	sample_rate = 16000;
	params = {
 		'id': acodec.getCodecID('ogg'),
		'bitrate': 16000,
		'sample_rate': sample_rate,
		'ext': 'ogg',
		'channels': 1
	}

	ENCODE = acodec.Encoder(params)

	D = ''
	# fill D with encoded vorbis.ogg object
	#D = OGG()
	F= ENCODE.encode(D)
	FILE = file('./static/data/'+fileName+'.ogg', 'rb') # read binary file under linux
	for frame in F: FILE.write(frame)
	FILE.close()

'''
