from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
import datetime, json
from webapp.models import Event, Recording, Image, Location, UserAcc
from django.contrib.auth.models import User
from django.core.serializers.json import DjangoJSONEncoder
from django.template.defaultfilters import slugify
import time

FFMPEG_BIN = "ffmpeg"
import subprocess as sp

import os, tarfile

# This method is called by the upload method in views.py
def process(json_file, aac_file, image_file, data, user):

	# Checks the extension is correct for the audio and metadata
	json_extn = json_file.name.split('.')[-1]
	aac_extn = aac_file.name.split('.')[-1]
	if (json_extn != "json"):
		return HttpResponse("<h1>Please upload an json file!</h1>")
	if (aac_extn != "aac"):
		return HttpResponse("<h1>Please upload an aac file!</h1>")

	# Loads the json into the var data
	data = json.load(json_file)

	# This ensures a filename doesn't cause errors by replacing spaces
	# with "-" and removing special characters also removes trailing spaces
	special_chars = ["!\"$%^&*()-_=+[];'#,./{}:@~<>/?\\|`"]
	temp_file_name = str(data[0]["title"])
	for c in special_chars:
		if c in temp_file_name:
			temp_file_name = temp_file_name.replace(c, "")
	temp_file_name = temp_file_name.replace(" ", "-")
	while temp_file_name.endswith("-"):
		temp_file_name = temp_file_name[:-1]
	temp_file_name = temp_file_name.lower()
	fn = temp_file_name
	fn = slugify(fn)

	# This is the recording object that will get stored in the db
	rec = Recording(
		file_name = temp_file_name,
		description = str(data[0]["description"]),
		length = (int(data[0]["endTime"]) - int(data[0]["startTime"])),
		start_time = datetime.datetime.fromtimestamp(int(data[0]["startTime"])/1000),
		end_time = datetime.datetime.fromtimestamp(int(data[0]["endTime"])/1000),
		rec_file = (""),
		lon = data[1][0]["lon"],
		lat = data[1][0]["lat"]
		)
	rec.save()

	# Creates any folders necessary if it does not exist in the file structure
	# The file structure is explained on the github issue
	date = str(datetime.date.today())
	path = date.replace("-", "/")
	path = "static/data/" + path + "/" + str(rec.pk)
	pathArray = path.split("/")
	tempPath = ""
	for i in pathArray:
		tempPath = tempPath + i
		if(not(os.path.isdir(tempPath))):
			os.mkdir(tempPath)
		tempPath = tempPath + "/"
	
	# Saves the file path in the database
	rec.rec_file = path 
	rec.save()

	# Creates a new entry in the database for each location, and uses the rec object
	# as the foreign key
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
	
	# If the user is logged in ties the recording to the user
	if user.is_authenticated():
		useracc = UserAcc.objects.filter(user__exact=user)[0]
		useracc.recs.add(rec)
	
	# Saves the aac file on the server, before it gets converted
	aacPath = path + "/" + fn + ".aac"
	with open(aacPath, 'wb+') as destination:
		for chunk in aac_file.chunks():
			destination.write(chunk)

	# This function call converts the file from .aac to .ogg
	# below the new file name with an ogg extension is saved to the database
	simplifiedConvert(aacPath)

	# Saves the tar.gz on the server before unpacking
	imagePath = path + "/" + image_file.name
	with open(imagePath, 'wb+') as destination:
		for chunk in image_file.chunks():
			destination.write(chunk)
	
	# extract() unpacks the tar.gz and returns the the number of images unpacked
	number_of_pictures = extract(imagePath, rec.file_name)

	# The path of each images is then saved in the database with the rec as a foreign key 
	for i in range(1, number_of_pictures):
		img = Image(
		recording_assoc = rec,
		file_name = path + "/" + rec.file_name + "_" + str(i) + ".jpg"
		)
		img.save()

	# If it has go this far then success is presumed and submitsuccess page is loaded
	return HttpResponseRedirect('/webapp/submitsuccess')



#JSON export for timeline

'''

	a template for exporting information and
	dynamically load it on the timeline
	
	- depending ont the input parameter username recordings of a specific user are exported 
	or all the database objects are loaded 
	(this is how the script distinguishes between the home page and the user page) 

'''

def export(username):


	RECORDINGS = []
	recs = []
	if(username == 'all'):
		RECORDINGS = Recording.objects.all()
	else:
		user = User.objects.get(username = username)
		useracc = UserAcc.objects.filter(user__exact=user)[0]
		RECORDINGS = useracc.recs.all()
		
	for recording in RECORDINGS:
	
	
		image = '/static/images/tl.jpg'
		images = Image.objects.filter(recording_assoc = recording.file_ID)
		
		
		
		if(images):
			image = images.order_by('?')[0]
			image = '/' + image.file_name
	
		rec_data = {
			"startDate":recording.start_time.strftime("%Y,%m,%d,%H,%M,%S"),
			"endDate":recording.end_time.strftime("%Y,%m,%d,%H,%M,%S"),
			"headline":recording.file_name,
			"text":"<p>"
				+ "<b>Uploaded by:</b> "
				+ str(username)
				+ "<br>"
				+ "<b>Duration:</b> "
				+ str(recording.end_time - recording.start_time)
				+ "<br>"
				#+ "<b>Event:</b> "
				#+ str(recording.event_assoc)
				#+ "<br>"
				+ "<b>Description:</b> "
				+ recording.description
				+ "</p>", #HTML + IMG rec. description
			"asset": {

				"media": image,

				'''
					"media":"https://maps.google.com/?q="
					+ str(recording.lat)
					+ ","
					+ str(recording.lon), #recording.rec_file.url, http://link_to_recording_file_music_player
				'''
				"caption":"ID"
					+ str(recording.file_ID)
			}
		}

		recs.append(rec_data)


		serialized = {
			"timeline": {
				"headline":"MDAP timeline",
				"type":"default",
				"text":"<p>Here is your personal MDAP timeline. You can browse your recordings and play them simultaneously if they overlap.</p>",
				"asset": {
					"media":"/static/images/tl.jpg",
					"caption":"Multi Device Recording System V1.0"
				},
				"date": recs

			}
		}

		with open('./static/scripts/data.json', 'w') as outp:
			json.dump(serialized, outp)

#simplified convert
# using ffmpeg default conversion settings
def simplifiedConvert(path):

	fn = path.replace('.aac','')
	fileNew = fn + '.ogg'

	usageStr = 'avconv -i ' + path + ' -acodec libvorbis ' + fileNew

	sp.call(usageStr, shell=True)



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

# this function extracts all the images from the .tar.gz file  
def extract(tar_url, file_name):
	item_number = 1
	tar = tarfile.open(tar_url, 'r')
	tarPath = tar_url.split("/")
	del tarPath[-1]
	tarPath = "/".join(tarPath)
	for item in tar:
		tar.extract(item, tarPath)
		os.rename(tarPath + "/" + item.name, tarPath + "/" + file_name + "_" + str(item_number) + ".jpg")
		item_number = item_number + 1
	return item_number
	
all = 0
	
def main():
	#export all recordings
	if(all == 0):
		export('all')
		all = 1
	elif(all == 1):
		export(request.user)
		all = 0
	

if __name__ == "__main__": main()
