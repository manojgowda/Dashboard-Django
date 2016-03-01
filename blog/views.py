from django.shortcuts import render
import json
from django.http import HttpResponse
import getstorevalues

# Create your views here.

def index_view(request):
	return render(request, 'blog/index.html', {})

def cpujson(request):
	data=getstorevalues.getsavevalues()
	return HttpResponse(json.dumps(data), content_type='application/json')

def twiter(request):
	data=getstorevalues.twitter()
	print json.dumps(data)
	return HttpResponse(json.dumps(data), content_type='application/json')
