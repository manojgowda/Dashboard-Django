from django.shortcuts import render
import json
from django.http import HttpResponse
from store import *

# Create your views here.

def index_view(request):
	return render(request, 'blog/index.html', {})

def cpu_memory(request):
	cpu_obj = CpuMemory()
	cpu_obj.load()
	data = cpu_obj.get_data()
	return HttpResponse(json.dumps(data), content_type='application/json')

def random_int(request):
	rand_obj = RandomInt()
	rand_obj.load()
	data = rand_obj.get_data()
	return HttpResponse(json.dumps(data), content_type='application/json')

def twitter(request):
	twi_obj = Twitter()
	data = twi_obj.get_data()
	return HttpResponse(json.dumps(data), content_type='application/json')

def stock(request):
	stock_obj = Stocks()
	stock_obj.load()
	data = stock_obj.get_data()
	return HttpResponse(json.dumps(data), content_type='application/json')

