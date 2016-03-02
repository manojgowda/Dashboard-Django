from django.db import models
from django.utils import timezone

class TwitterCount(models.Model):
	name = models.CharField(max_length=100, default="")
	tweets_min = models.IntegerField()
	statuses_count = models.IntegerField()
	time = models.DateTimeField(default=timezone.now())
