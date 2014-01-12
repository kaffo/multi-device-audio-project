from django.http import HttpRequest
import datetime, json
from webapp.models import Recording

def process(file, data):
    extn = file.name.split('.')[-1]
    title = data['file_name'] + '.' + extn
    path = 'data/' + title
    with open(path, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    rec = Recording(file_name = data["file_name"], length = 0.01, start_time = datetime.datetime.today(), end_time = datetime.datetime.today(), description = data["description"], rec_file = path, lon = data['lon'], lat = data['lat'])
    rec.save()
