from django import forms
from django.contrib.auth.models import User
from webapp.models import UserAcc, Event, Recording, Image

class UploadFileForm(forms.Form):
    json_file = forms.FileField() #metadata
    aac_file = forms.FileField() #audiofile
    images_file = forms.FileField() #images folder

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password')
