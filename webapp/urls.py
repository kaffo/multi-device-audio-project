from django.conf.urls import patterns, url
from webapp import views
#comment to show that this syncing stuff is working. work local. commit to server
urlpatterns = patterns ('',
    url(r'^$', views.index, name='index'),
    url(r'^$', views.submit, name='submit'),
    #url(r'^$', views.register, name='register'),
    #url(r'^$', views.user_login, name='login'),
    #url(r'^$', views.restricted, name='restricted'),
    #url(r'^$', views.user_login, name='login'),
    #url(r'^$', views.user_logout, name='logout'),
    )
