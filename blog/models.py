from django.db import models
from django.utils import timezone


class Cpuandmemeory(models.Model):
	cpuper = models.FloatField()
	memory = models.FloatField()



class Twittercounts(models.Model):
	name = models.CharField(max_length=100, default="")
	twittercount = models.IntegerField()
	totalcounts = models.IntegerField()
