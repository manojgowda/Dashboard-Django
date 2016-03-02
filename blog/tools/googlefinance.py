import urllib


class GoogleFinance():

	def __init__(self, name, filename):
		self.name = name
		self.base_url = "http://finance.google.co.uk/finance/historical?q="+self.name+"&startdate=Oct+1,2010&enddate=Oct+9,2013&output=csv"
		self.filename = filename


	def pull_historical_data(self):
	    try:
	        urllib.urlretrieve(self.base_url, self.filename+".csv")
	    except urllib.ContentTooShortError as e:
	        outfile = open(self.filename+".csv", "w")
	        outfile.write(e.content)
	        outfile.close()
