from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^index$', views.index_view, name='index_view'),
    url(r'^cpudata$', views.cpujson, name="cpu_json"),
    url(r'^tweetdata$', views.twiter, name="twiter"),
]
