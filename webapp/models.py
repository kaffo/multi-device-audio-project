#an initial version of models /pyordanov/

from django.db import models
#from django.db import forms    It is ModelForm. And we don't need it here

class UserAcc(models.Model):

	user_name = models.CharField(max_length=30, unique=True)
	password = models.CharField(max_length=32)#, widget=forms.PasswordInput) 
	email_addres = models.EmailField(max_length=50)
	first_name = models.CharField(max_length=20)
	last_name = models.CharField(max_length=20)
	avatar = models.ImageField('Profile picture')
	date_registered = models.DateTimeField() #Date registered


class Recording(models.Model):

	file_name = models.CharField(max_length=100)
	length = models.CharField() #based on recording start & end time
	rec_time = models.DateTimeField() #recording time
	rec_file = models.FileField() #.ogg file
	owner = models.ManyToMany(UserAcc)
	#event_assoc = models.ManyToMany() #event name and recording association
	#images_assoc = models.ManyToMany()#event and images relationship
	#location = models. location_field /open src on github project>> https://github.com/codasus/django-location-field


class Image(models.Model):
	
	file_name = models.CharField(max_length=100)
	dtime = models.DateTimeField() #time stamp
	#event_assoc = models.ManyToMany() #event name and images association
	recording_assoc = models.ManyToMany(Recording) #event and recording relationship
	#location = models. location_field /open src on github project>> https://github.com/codasus/django-location-field
	
