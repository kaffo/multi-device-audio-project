from django import forms

class UploadFileForm(forms.Form):
    title = forms.CharField(max_length=50)
    disc = forms.CharField(max_length=150)
    data_file = forms.FileField()
