#! /home/manoj/django/myvenv/bin/python
import sys
import imp
import os
sys.path.append('/home/manoj/django/')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
from blog import store
from blog.constants import *
from TwitterAPI import TwitterAPI
from blog.models import TwitterCount

def twitterex():
	twi_api = store.TwitterApi()
	twi_api.store_data()




if __name__ == "__main__" :
	twitterex()
