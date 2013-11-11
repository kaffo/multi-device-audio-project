# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Event'
        db.create_table(u'webapp_event', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('event_name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('event_ID', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'webapp', ['Event'])

        # Adding model 'Recording'
        db.create_table(u'webapp_recording', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('file_name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('file_ID', self.gf('django.db.models.fields.IntegerField')()),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=2000)),
            ('length', self.gf('django.db.models.fields.DecimalField')(max_digits=2, decimal_places=2)),
            ('start_time', self.gf('django.db.models.fields.DateTimeField')()),
            ('end_time', self.gf('django.db.models.fields.DateTimeField')()),
            ('rec_file', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
        ))
        db.send_create_signal(u'webapp', ['Recording'])

        # Adding M2M table for field event_assoc on 'Recording'
        m2m_table_name = db.shorten_name(u'webapp_recording_event_assoc')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('recording', models.ForeignKey(orm[u'webapp.recording'], null=False)),
            ('event', models.ForeignKey(orm[u'webapp.event'], null=False))
        ))
        db.create_unique(m2m_table_name, ['recording_id', 'event_id'])

        # Adding model 'User'
        db.create_table(u'webapp_user', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user_name', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('user_ID', self.gf('django.db.models.fields.IntegerField')()),
            ('password', self.gf('django.db.models.fields.CharField')(max_length=32)),
            ('email_address', self.gf('django.db.models.fields.EmailField')(max_length=50)),
            ('first_name', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('last_name', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('avatar', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('date_registered', self.gf('django.db.models.fields.DateTimeField')()),
        ))
        db.send_create_signal(u'webapp', ['User'])

        # Adding M2M table for field rec_assoc on 'User'
        m2m_table_name = db.shorten_name(u'webapp_user_rec_assoc')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('user', models.ForeignKey(orm[u'webapp.user'], null=False)),
            ('recording', models.ForeignKey(orm[u'webapp.recording'], null=False))
        ))
        db.create_unique(m2m_table_name, ['user_id', 'recording_id'])

        # Adding model 'Image'
        db.create_table(u'webapp_image', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('file_name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('file_ID', self.gf('django.db.models.fields.IntegerField')()),
            ('time_taken', self.gf('django.db.models.fields.DateTimeField')()),
            ('event_assoc', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['webapp.Event'])),
            ('recording_assoc', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['webapp.Recording'])),
        ))
        db.send_create_signal(u'webapp', ['Image'])


    def backwards(self, orm):
        # Deleting model 'Event'
        db.delete_table(u'webapp_event')

        # Deleting model 'Recording'
        db.delete_table(u'webapp_recording')

        # Removing M2M table for field event_assoc on 'Recording'
        db.delete_table(db.shorten_name(u'webapp_recording_event_assoc'))

        # Deleting model 'User'
        db.delete_table(u'webapp_user')

        # Removing M2M table for field rec_assoc on 'User'
        db.delete_table(db.shorten_name(u'webapp_user_rec_assoc'))

        # Deleting model 'Image'
        db.delete_table(u'webapp_image')


    models = {
        u'webapp.event': {
            'Meta': {'object_name': 'Event'},
            'event_ID': ('django.db.models.fields.IntegerField', [], {}),
            'event_name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'webapp.image': {
            'Meta': {'object_name': 'Image'},
            'event_assoc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['webapp.Event']"}),
            'file_ID': ('django.db.models.fields.IntegerField', [], {}),
            'file_name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'recording_assoc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['webapp.Recording']"}),
            'time_taken': ('django.db.models.fields.DateTimeField', [], {})
        },
        u'webapp.recording': {
            'Meta': {'object_name': 'Recording'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '2000'}),
            'end_time': ('django.db.models.fields.DateTimeField', [], {}),
            'event_assoc': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'event+'", 'symmetrical': 'False', 'to': u"orm['webapp.Event']"}),
            'file_ID': ('django.db.models.fields.IntegerField', [], {}),
            'file_name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'length': ('django.db.models.fields.DecimalField', [], {'max_digits': '2', 'decimal_places': '2'}),
            'rec_file': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'start_time': ('django.db.models.fields.DateTimeField', [], {})
        },
        u'webapp.user': {
            'Meta': {'object_name': 'User'},
            'avatar': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'date_registered': ('django.db.models.fields.DateTimeField', [], {}),
            'email_address': ('django.db.models.fields.EmailField', [], {'max_length': '50'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '32'}),
            'rec_assoc': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'u+'", 'symmetrical': 'False', 'to': u"orm['webapp.Recording']"}),
            'user_ID': ('django.db.models.fields.IntegerField', [], {}),
            'user_name': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        }
    }

    complete_apps = ['webapp']