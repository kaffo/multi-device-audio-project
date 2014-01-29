from django import forms

class UploadFileForm(forms.Form):
    file_name = forms.CharField(max_length=50) #file name
    description = forms.CharField(max_length=500)
    rec_file = forms.FileField() #.ogg file uploaded in a directory according to the current date
    #lon = forms.DecimalField(max_digits=50, decimal_places=20)
    #lat = forms.DecimalField(max_digits=50, decimal_places=20)
    lon = forms.CharField(max_length=100)
    lat = forms.CharField(max_length=100)
