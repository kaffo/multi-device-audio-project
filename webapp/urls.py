from django.conf.urls import patterns, url, include
from django.contrib import admin
from webapp import views
#comment to show that this syncing stuff is working. work local. commit to server
urlpatterns = patterns ('',
    url(r'^$', views.index, name='index'),
    url(r'^about/$', views.about, name='about'),
    url(r'^submit/$', views.submit, name='submit'),
    url(r'^getdata:(-?[0-9]+.-?[0-9]+):(-?[0-9]+.-?[0-9]+):(-?[0-9]+.-?[0-9])+:(-?[0-9]+.-?[0-9]+)/$', views.getdata, name='getdata'),
    url(r'^convert:*/$',views.convert, name='convert'),
    url(r'^playSound:(-?[0-9]+)/$', views.playSound, name='playSound'),
    url(r'^settings/$', views.settings, name='settings'),
    url(r'^user/$', views.user, name='user'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^getroute:([a-z|A-Z]+)/$', views.getroute, name='getroute'),
	url(r'^getRecs', views.getRecs, name='getRecs'),
    url(r'^register/$', views.register, name='register'),
    url(r'^login/$', views.user_login, name='login'),
    url(r'^logout/$', views.user_logout, name='logout'),

    #commented out, so it is not lost in case i'm wrong (Gordon Adam)
    #url(r'^settings/$', views.settings, name='settings'),
    #url(r'^user/$', views.user, name='user'),
    #url(r'^submit/$', views.submit, name='submit'),

    #url(r'^$', views.register, name='register'),
    #url(r'^$', views.user_login, name='login'),
    #url(r'^$', views.restricted, name='restricted'),
    #url(r'^$', views.user_logout, name='logout'),
    url(r'^tester/$', views.tester, name='tester')
    )
