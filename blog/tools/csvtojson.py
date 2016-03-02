import csv
import json


class CsvtoJson :

	def __init__(self, filename):
		self.filename = filename
		self.data = []

	def convert(self):
		csv_file = open('/home/manoj/django/'+ self.filename +'.csv', 'r')
		fieldnames = ('Date', 'Open', 'High', 'Low', 'Close', 'Volume')
		reader = csv.DictReader( csv_file, fieldnames)
		for row in reader:
		    self.data.append(row)
		csv_file.close()
		return self.data[1:]

