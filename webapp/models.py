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
    location_assoc = models.OneToMany(Location, related_name = 'loc+')
    #lon = models.DecimalField(max_digits=50, decimal_places=20) # Commented this out so it is not lost in case I happen to be retarded 
    #lat = models.DecimalField(max_digits=50, decimal_places=20) # and this
    #image_assoc = models.OneToMany(Image, related_name = 'IMG_+') #event and images relationship
    #location = models. location_field /open src on github project>> https://github.com/codasus/django-location-field

    def __unicode__(self): # return a sensible unicode value
        return self.file_name

# class added to allow multiple locations for one recording
class Location(models.Model):
    loc_ID = models.AutoField(primary_Key=True) # I copied the idea for these ["loc_ID", "event_assoc" and "recording_assoc"] from the class Image, I hope they work for Location. 
    event_assoc = models.ForeignKey(Event)
    recording_assoc = models.ForeignKey(Recording)
    lon = models.DecimalField(max_digits=50, decimal_places=20) # moved from recording
    lat = models.DecimalField(max_digits=50, decimal_places=20) # moved from recording

#class UserAcc(models.Model):
#
#    user = models.OneToOneField(User)
#
#    website = models.URLField(blank=True)
#    user_ID =  models.AutoField(primary_key=True) #user id, can be combined with user name, valid for the other models as well
#    avatar = models.ImageField(blank=True,upload_to='/images/avatars/%Y/%m/%d') #profile picture
#    date_registered = models.DateTimeField(auto_now_add=True, blank=True) #Date registered
#    rec_assoc = models.ManyToManyField(Recording, related_name = 'u+') #user - recording rel. m->m
#
#    #social attributes - to be implemented later
#
#    def __unicode__(self):
#        return self.user_name
#
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
