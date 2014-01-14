from django.conf.urls import patterns, url
from webapp import views
#comment to show that this syncing stuff is working. work local. commit to server
urlpatterns = patterns ('',
    url(r'^$', views.index, name='index'),
    url(r'^about/$', views.about, name='about'),
    url(r'^submit', views.submit, name='submit'),
    url(r'^getdata:(-?[0-9]+.-?[0-9]+):(-?[0-9]+.-?[0-9]+):(-?[0-9]+.-?[0-9])+:(-?[0-9]+.-?[0-9]+)/$', views.getdata, name='getdata'),
    url(r'^settings', views.settings, name='settings'),
    url(r'^user', views.user, name='user'),                    
    #commented out, so it is not lost in case i'm wrong (Gordon Adam)
    #url(r'^settings/$', views.settings, name='settings'),
    #url(r'^user/$', views.user, name='user'),
    #url(r'^submit/$', views.submit, name='submit'),
                        
    #url(r'^$', views.register, name='register'),
    #url(r'^$', views.user_login, name='login'),
    #url(r'^$', views.restricted, name='restricted'),
    #url(r'^$', views.user_logout, name='logout'),
    )
