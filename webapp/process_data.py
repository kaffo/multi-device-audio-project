from django.http import HttpResponse, HttpRequest
import datetime, json
from webapp.models import Event, Recording, Image, Location, UserAcc
from django.core.serializers.json import DjangoJSONEncoder

FFMPEG_BIN = "ffmpeg"
import subprocess as sp
#import numpy
import os


def process(recording_file, image_file, data, user):
    lon_array = data['lon'].split(',')
    lat_array = data['lat'].split(',')
    img_array = data['image'].split(',')
    recording_extn = recording_file.name.split('.')[-1]
    image_extn = image_file.name.split('.')[-1]
    if (recording_extn != "ogg"):
        return  HttpResponse("<h1>Please upload an ogg file!</h1>")
    if (image_extn != "jpg"):
        return HttpResponse("<h1>Please upload a jpg file!</h1>")
    image_title = data['file_name'] + '.' + image_extn
    recording_title = data['file_name'] + '.' + recording_extn
    path = 'static/data/' + recording_title # I modified this from "data/" because django was being a nuisance and not letting me link to things outside /static/ (gadam)
    with open(path, 'wb+') as destination:
        for chunk in recording_file.chunks():
            destination.write(chunk)
    
    rec = Recording(
        file_name = data["file_name"],
        length = 0.01, #we need to grab the time from the metadata, pretty easy.
        start_time = datetime.datetime.today(),
        end_time = datetime.datetime.today(),
        description = data["description"],
        rec_file = path,
        lon = lon_array[0],
        lat = lat_array[0]
    )
    path = 'static/data/' + image_title
    with open(path, 'wb+') as destination:
        for chunk in image_file.chunks():
            destination.write(chunk)
    rec.save()
    lonlat_len = len(lon_array)
    for i in range(1, lonlat_len):
        loc = Location(
            recording_assoc = rec,
            lon = lon_array[i],
            lat = lat_array[i],
            image = img_array[i],
            alt = 0.0, # This is just temporary until we can start uploading data from mobile device
            time = "2000-01-01" # This is just temporary until we can start uploading data from mobile device
        )
        loc.save()

    if user.is_authenticated():
        useracc = UserAcc.objects.filter(user__exact=user)[0]
        useracc.recs.add(rec)
    return HttpResponse('webapp/submitsuccess.html')



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
	fileName = path + fileName
	fileNew = path + os.path.splitext(fileName)[0] + '.ogg'

	p = sp.Popen([FFMPEG_BIN, "-i", fileName, "-acodec", "libvorbis", fileNew], stdout=subprocess.PIPE)



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
