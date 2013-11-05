#This is an initial version of models /pyordanov/

from django.db import models
from django.forms import CharField, Form, PasswordInput

class Event(models.Model):

        event_name =  models.CharField(max_length=50)
        event_ID = models.IntegerField()


class Recording(models.Model):

        file_name = models.CharField(max_length=50) #file name
        file_ID = models.IntegerField() #file id
        description = models.CharField(max_length=500)
        length = models.DecimalField(max_digits=2, decimal_places=2) #based on recording start & end time - in hrs or minutes
        start_time = models.DateTimeField() #recording start time
        end_time = models.DateTimeField() #recording time
        rec_file = models.FileField(upload_to='/audio/%Y/%m/%d') #.ogg file uploaded in a directory according to the current date
        event_assoc = models.ManyToManyField(Event, related_name='event+') #event name and recording association /1 event can have mult recordings, 1 rec. of many events       
        #image_assoc = models.OneToMany(Image, related_name = 'IMG_+') #event and images relationship
        #location = models. location_field /open src on github project>> https://github.com/codasus/django-location-field

class User(models.Model):

        user_name = models.CharField('Username', max_length=10) #user name
        user_ID =  models.IntegerField() #user id, can be combined with user name, valid for the other models as well
        password = models.CharField('Password', max_length=32) # will encrypt later
        email_addres = models.EmailField('Email', max_length=50)
        first_name = models.CharField('First', max_length=10)
        last_name = models.CharField('Surname', max_length=10)
        avatar = models.ImageField(upload_to='/audio/%Y/%m/%d') #profile picture
        date_registered = models.DateTimeField() #Date registered
        rec_assoc = models.ManyToManyField(Recording, related_name = 'u+') #user - recording rel. m->m

        #social attributes - to be implemented later


class Image(models.Model):

        file_name = models.CharField(max_length=50) #f. name
        file_ID =  models.IntegerField() #file id
        time_taken = models.DateTimeField() #time stamp
        event_assoc = models.ForeignKey(Event)
        recording_assoc = models.ForeignKey(Recording)
        #event_assoc = models.OneToMany(Event, related_name='event+') #event name and image association/ 1 event mult images
        #location = models. location_field /open src on github project>> https://github.com/codasus/django-location-field


