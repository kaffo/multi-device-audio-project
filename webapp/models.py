#This is an initial version of models /pyordanov/

from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):

    event_name =  models.CharField(max_length=50)
    event_ID = models.AutoField(primary_key=True) #primary key

    def __unicode__(self): # return a sensible unicode value when instance req.
        return self.event_name


class Recording(models.Model):

    file_name = models.CharField(max_length=50) #file name
    file_ID = models.AutoField(primary_key=True) #file id
    description = models.CharField(max_length=500)
    length = models.DecimalField(max_digits=4, decimal_places=2) #based on recording start & end time - in hrs or minutes
    start_time = models.DateTimeField() #recording start time
    end_time = models.DateTimeField() #recording time
    rec_file = models.FileField(upload_to='/audio/%Y/%m/%d') #.ogg file uploaded in a directory according to the current date
    event_assoc = models.ManyToManyField(Event, related_name='event+') #event name and recording association /1 event can have mult recordings, 1 rec. of many events
    lon = models.DecimalField(max_digits=50, decimal_places=20)
    lat = models.DecimalField(max_digits=50, decimal_places=20)
    
    #image_assoc = models.OneToMany(Image, related_name = 'IMG_+') #event and images relationship
    #location = models. location_field /open src on github project>> https://github.com/codasus/django-location-field

    def __unicode__(self): # return a sensible unicode value
        return self.file_name

# class added to allow multiple locations for one recording
class Location(models.Model):
    loc_ID = models.AutoField(primary_key = True)
    loc_name = models.CharField(max_length=30)
    recording_assoc = models.ForeignKey(Recording)
    lon = models.DecimalField(max_digits=50, decimal_places=20) # moved from recording
    lat = models.DecimalField(max_digits=50, decimal_places=20) # moved from recording
    image = models.CharField(max_length=50)
    
    alt = models.DecimalField(max_digits=4, decimal_places=2)
    bearing = models.FloatField(default=0.0)
    speed = models.FloatField(default=0.0)
    time = models.DateTimeField()
    
    def __unicode__(self):
            return self.loc_name

class UserAcc(models.Model):

    user = models.OneToOneField(User)

    recs = models.ManyToManyField(Recording, related_name = 'u+') #user - recording rel. m->m

    def __unicode__(self):
        return self.user.username

class Image(models.Model):

    file_name = models.CharField(max_length=50) #f. name
    file_ID =  models.AutoField(primary_key=True) #file id
    file = models.FileField(upload_to='/images/%Y/%m/%d') #profile picture
    time_taken = models.DateTimeField() #time stamp
    event_assoc = models.ForeignKey(Event)
    recording_assoc = models.ForeignKey(Recording)
    #event_assoc = models.OneToMany(Event, related_name='event+') #event name and image association/ 1 event mult images
    #location = models. location_field /open src on github project>> https://github.com/codasus/django-location-field

    def __unicode__(self):
        return self.file_name
