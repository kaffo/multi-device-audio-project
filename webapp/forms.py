from webapp.models import UserProfile
from django.contrib.auth.models import User

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

class UserProfileForm(forms.ModelForm):

    class Meta:
        model = UserAcc
        fields = ('website', 'avatar')

class UploadFileForm(forms.Form):
    json_file = forms.FileField() #metadata
    aac_file = forms.FileField() #audiofile
    images_file = forms.FileField() #images folder

    class Meta:
      fields = ('aac_file', 'json_file', 'images_file')
