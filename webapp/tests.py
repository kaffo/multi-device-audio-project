"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
import process_data
import datetime, json
from webapp.models import Event, Recording, Image


class RecordingTestCase(TestCase):
	def setUp(self):
		print "lala"
		
	def export(self):
		self.exportJSONtl()
		print "sss"
		
class RecTestCase(TestCase):
	def setUp(self):
		Rec1 = Recording(file_name="rec1")
		Rec1.save()

	def export(self):
		self.exportJSONtl()
		print "sss"
