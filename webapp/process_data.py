from django.http import HttpRequest

def process(file, data):
    title = data['title']
    with open('data/' + title, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
