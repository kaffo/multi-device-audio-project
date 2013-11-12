from django.http import HttpRequest

def process(file, data):
    extn = file.name.split('.')[-1]
    title = data['title'] + extn
    with open('data/' + title, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
