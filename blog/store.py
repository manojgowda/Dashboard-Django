import psutil
import random
from blog.constants import *
from blog.models import TwitterCount
import json
from TwitterAPI import TwitterAPI
import ystockquote
from blog.tools.googlefinance import GoogleFinance
from blog.tools.csvtojson import CsvtoJson


class CpuMemory:

	def load(self):
		self.cpu_per = psutil.cpu_percent()
		self.memory_per = psutil.virtual_memory().percent

	def get_data(self):
		return { 'cpuper': self.cpu_per, 'memory': self.memory_per }


class RandomInt:

	def load(self):
		self.random_int = random.randint(1, 100)

	def get_data(self):
		return { 'randint': self.random_int }


class Stocks:
	def __init__(self):
		self.yahoodata=[]
		self.fbdata=[]

	def load(self):
		gofi_obj_yahoo = GoogleFinance(YAHOO, "yahoodata")
		gofi_obj_yahoo.pull_historical_data()
		gofi_obj_fb = GoogleFinance(FB, "fbdata")
		gofi_obj_fb.pull_historical_data()

	def get_data(self):
		yahoodata = CsvtoJson("yahoodata")
		fbdata = CsvtoJson("fbdata")
		print type(yahoodata.convert()[0]['Date'])
		return {'yahoodata':yahoodata.convert(), 'fbdata':fbdata.convert() }


	def __dict_to_list(self, d, dd):
		for key, value in d.iteritems():
			value['Date']=key
			temp = { "id": value }
			dd.append(temp)




class Twitter:
	def __init__(self):
		self.data = []
		self.count = 0

	def __serialize_instance(self, obj, count):
	    d = { '__classname__' : type(obj).__name__ }
	    d.update(vars(obj))
	    del d['_state']
	    del d['time']
	    d['count'] = count
	    return d

	def __serializeandcount(self, some, count) :
		for each in some:
			self.data.append(self.__serialize_instance(each, count))
			count = count+1

	def get_data(self):
		total = TwitterCount.objects.all()
		that = self
		if len(total) > 25 :
			some = total[len(total)-25:]
			self.__serializeandcount(some, that.count)
		else:
			self.__serializeandcount(total, that.count)
		return self.data

class TwitterApi:

	def __init__(self):
		self.api = TwitterAPI(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN_KEY,ACCESS_TOKEN_SECRET)
		self.user_details = self.api.request('users/show', {'user_id': USER_ID, 'screen_name': SCREEN_NAME}).json()
		self.twi_obj = TwitterCount.objects.all()
		self.count = 0


	def store_data(self):
		if len(self.twi_obj) == 0 :
			TwitterCount.objects.create(statuses_count=user_details['statuses_count'], name=SCREEN_NAME, tweets_min = 0)
		else :
			self.twi_obj = self.twi_obj[len(self.twi_obj)-1]
			self.count = self.user_details['statuses_count'] - self.twi_obj.statuses_count
			TwitterCount.objects.create(statuses_count=self.user_details['statuses_count'], name=SCREEN_NAME, tweets_min=self.count)
