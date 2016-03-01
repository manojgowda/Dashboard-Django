import psutil
import random
from blog.models import Cpuandmemeory, Twittercounts
import json
from TwitterAPI import TwitterAPI
import threading

da={}
api = TwitterAPI("upMQ9Txt1xo6VhngkDqEMrF3a", "YwNGsIdD7vioSJjomLdyS2nk85E0lVUUw0ex6WJWyfSs5rGvFo", "1529709536-ss3rL01Mdkphph5RByZBd0x0y3zriutoU8O5lWQ","xl7q1VeHQIpBdpqQD4tfoqzSoKa7wID9fy6igsjlr2KhA")
name=""

def serialize_instance(obj, count):
    d = { '__classname__' : type(obj).__name__ }
    d.update(vars(obj))
    del d['_state']
    d['count'] = count
    return d

def getsavevalues():
	cpuperv = psutil.cpu_percent()
	memoryv = psutil.virtual_memory().percent
	integerv = random.randint(1,100)

	Cpuandmemeory.objects.create(cpuper=cpuperv, memory=memoryv)
	da['cpuper'] = cpuperv
	da['memory'] = memoryv
	da['randint'] = integerv
	return da

def serializeandcount() :
	for each in some:
		data.append(serialize_instance(each, count))
		count = count+1

def twitter():
	data=[]
	total = Twittercounts.objects.all()
	count=0
	if len(total) > 25 :
		some = total[len(total)-25:]
		serializeandcount()
	else:
		serializeandcount()
	return data

def twitterex():

	global name
	global api
	value = api.request('trends/place', {'id':1})
	jsondata = value.json()
	for each in jsondata[0]['trends']:
		if name == "":
			print "hwlelwjfeahsdfjhljdsh---"
			name = jsondata[0]['trends'][0]['name']
			tweetcount = jsondata[0]['trends'][0]['tweet_volume']
			twicouobj = Twittercounts.objects.all()
			if len(twicouobj) != 0 :
				twicouobj = twicouobj[len(twicouobj)-1:]
				totalcounts = each['tweet_volume'] - twicouobj[0].twittercount
				Twittercounts.objects.create(name=name, twittercount=each['tweet_volume'], totalcounts=totalcounts)
			else:
				Twittercounts.objects.create(name=name, twittercount=tweetcount, totalcounts=0)
				break
		else:
			if each['name'] == name :
				twicouobj = Twittercounts.objects.all()
				twicouobj = twicouobj[len(twicouobj)-1:]
				totalcounts = each['tweet_volume'] - twicouobj[0].twittercount
				Twittercounts.objects.create(name=name, twittercount=each['tweet_volume'], totalcounts=totalcounts)
				break


	threading.Timer(10, twitterex).start()

twitterex()
