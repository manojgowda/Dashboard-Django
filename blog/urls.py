from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^index$', views.index_view, name='index_view'),
    url(r'^cpudata$', views.cpu_memory, name="cpu_memory"),
    url(r'^tweetdata$', views.twitter, name="twitter"),
    url(r'^stockdata$', views.stock, name="stock"),
    url(r'^randomdata', views.random_int, name="random_int")
]
