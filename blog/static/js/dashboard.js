var timeoutId = 0;
var data = [];
var datar = [];
var datat = [];
var datas = [];

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 480 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var legendRectSize = 18;
var legendSpacing = 4;

var parseDate = d3.time.format("%H:%M:%S").parse;

var xcenter =  width/2;

var x = d3.time.scale()
    .range([0, width]);

var xtwi = d3.scale.linear()
	.range([0, width]);

var xstock = d3.time.scale()
	.range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5)
    .tickFormat(d3.time.format("%S"));

var xtwitAxis =d3.svg.axis()
	.scale(xtwi)
	.orient("bottom")

var xstockAxis =d3.svg.axis()
	.scale(xstock)
	.orient("bottom")
	.ticks(6)
	.tickFormat(d3.time.format("%Y-%m"));;

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var cpu = d3.svg.line()
    .x(function(d) { return x(d.creatTime);})
    .y(function(d) { return y(d.cpuPer); });

var memory = d3.svg.line()
	.x(function(d) { return x(d.creatTime);})
	.y(function(d) { return y(d.memoryPer);});

var random = d3.svg.line()
	.x(function(d) { return x(d.creatTime);})
	.y(function(d) {return y(d.randint)});

var tweet = d3.svg.line()
	.x(function(d) { return xtwi(d.count);})
	.y(function(d) { return y(d.tweets_min);});

var ystock = d3.svg.line()
	.x(function(d) { return xstock(d["Date"]);})
	.y(function(d) { return y(d["Close"]);});

var gstock = d3.svg.line()
	.x(function(d) { return xstock(d["Date"]);})
	.y(function(d) { return y(d["Close"]);});



function myGetTime() {
    var dd = new Date();
    var hh = dd.getHours();
    var mm = dd.getMinutes();
    var ss = dd.getSeconds();
    return hh + ":" + mm + ":" + ss;
}


function getTime(data) {
	var url = "/blog/cpudata";
	var importedData = getData(url);
	if(importedData !== undefined){
	  	if(data.length === 10) {
		    data.shift();
		}
		data.push({
		    "creatTime":  myGetTime(),
		    "cpuPer": importedData.cpuper,
		    "memoryPer": importedData.memory,
		});
	}
}

function randomData() {
	var url = "/blog/randomdata";
	var importedData = getData(url);
	if(importedData !== undefined){
	  	if(datar.length === 10) {
		    datar.shift();
		}
		datar.push({
		    "creatTime":  myGetTime(),
		    "randint" : importedData.randint
		});
	}
}

function twitterdata() {
	var url = "/blog/tweetdata";
	var twitdata = getData(url);
	if(twitdata !== undefined) {
		datat=twitdata;
	}
}

function stockdata() {
	var url = "/blog/stockdata";
	var stockdata = getData(url);
	if(stockdata !== undefined) {
		datas=stockdata;
	}
}

function cpuupdate() {
  getTime(data);
  dataConversion(data);
  cpuMemory();
  timeoutId = setTimeout("cpuupdate()", 1000);
}

function randomupdate() {
	randomData();
	randomDataConversion();
	randomInt();
	timeoutId = setTimeout("randomupdate()", 1000);
}

function stockupdate() {
	stockdata();
	stockdataConversion('yahoodata');
    stockdataConversion('fbdata');
    stockmarket();
}

function twitterupdate() {
	twitterdata();
	twitter();
	timeoutId = setTimeout("twitterupdate()", 60000);
}

function randomDataConversion() {
	datar.forEach(function(d) {
	    if(typeof d.creatTime === "string") {
	       d.creatTime = parseDate(d.creatTime);
	       d.randint = +d.randint;
	    }
	});
}

function stockdataConversion(company) {
	datas[company].forEach(function(dd){
		if(typeof dd["Date"] === "string"){
			dd["Date"] = new Date(dd["Date"]);
			dd["Close"] = parseInt(dd["Close"]);
		}
	});
}

function dataConversion() {
	data.forEach(function(d) {
	    if(typeof d.creatTime === "string") {
	       d.cpuPer = +d.cpuPer;
	       d.creatTime = parseDate(d.creatTime);
	       d.memoryPer = +d.memoryPer;
	    }
	});
}

function stockmarket() {
	d3.select("#stock svg")
		.remove();

	var svg = d3.select("#stock").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom + 40)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	xstock.domain(d3.extent(datas["fbdata"], function(d) { return d["Date"]; }));
	y.domain(d3.extent([].concat(datas["fbdata"].map(function(item) { return (item["Close"]); }),
        datas["yahoodata"].map(function(item) {
        return (item["Close"]);
    }))));


    var legend1 = svg.append('g')
	  .attr('class', 'legend3');

	var legend2 = svg.append('g')
	  .attr('class', 'legend4');

	legend1.append('rect')
	  .attr('width', legendRectSize)
	  .attr('height', legendRectSize)
	  .style('fill', "red")
	  .style('stroke', "red");

	legend2.append('rect')
	  .attr('width', legendRectSize)
	  .attr('height', legendRectSize)
	  .style('fill', "steelblue")
	  .style('stroke', "steelblue");

	legend1.append('text')
	  .attr('x', legendRectSize + legendSpacing)
	  .attr('y', legendRectSize - legendSpacing)
	  .text("YHOO");

	legend2.append('text')
	  .attr('x', legendRectSize + legendSpacing)
	  .attr('y', legendRectSize - legendSpacing)
	  .text("FB");

	svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .style("text-anchor", "end" )
      .call(xstockAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", 40)
      .attr("dx", xcenter)
      .attr("font-size", "1.3em")
      .style("text-anchor", "end")
      .text("date(M)");

  	svg.append("g")
      .attr("class", "y axis")
      .style("text-anchor", "end")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".41em")
      .attr("font-size", "1.3em")
      .style("text-anchor", "end")
      .text("Price");

    svg.append("path")
      .datum(datas["yahoodata"])
      .attr("class", "yahoo")
  	  .attr("d", gstock);

  	svg.append("path")
      .datum(datas["fbdata"])
      .attr("class", "fb")
  	  .attr("d", ystock);
}

function cpuMemory() {

	d3.select("#cpu svg")
	       .remove();

	var svg = d3.select("#cpu").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom + 40)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    x.domain(d3.extent(data, function(d) { return d.creatTime; }));
    y.domain([0, 100]);

    var legend1 = svg.append('g')
	  .attr('class', 'legend1');

	var legend2 = svg.append('g')
	  .attr('class', 'legend2');

	legend1.append('rect')
	  .attr('width', legendRectSize)
	  .attr('height', legendRectSize)
	  .style('fill', "red")
	  .style('stroke', "red");

	legend2.append('rect')
	  .attr('width', legendRectSize)
	  .attr('height', legendRectSize)
	  .style('fill', "steelblue")
	  .style('stroke', "steelblue");

	legend1.append('text')
	  .attr('x', legendRectSize + legendSpacing)
	  .attr('y', legendRectSize - legendSpacing)
	  .text("Memory utilization");

	legend2.append('text')
	  .attr('x', legendRectSize + legendSpacing)
	  .attr('y', legendRectSize - legendSpacing)
	  .text("CPU utilization");

  	svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .style("text-anchor", "end")
      .call(xAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", 40)
      .attr("dx", xcenter)
      .attr("font-size", "1.3em")
      .style("text-anchor", "end")
      .text("time(s)");

  	svg.append("g")
      .attr("class", "y axis")
      .style("text-anchor", "end")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".41em")
      .attr("font-size", "1.3em")
      .style("text-anchor", "end")
      .text("CPUandMemory%");

  	svg.append("path")
      .datum(data)
      .attr("class", "cpu")
  	  .attr("d", cpu);

   	svg.append("path")
      .datum(data)
      .attr("class", "memory")
  	  .attr("d", memory);
}


function randomInt() {
	d3.select("#random svg")
		.remove();

	var svg = d3.select("#random").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom + 40)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	x.domain(d3.extent(datar, function(d) { return d.creatTime; }));
	y.domain([0, 100]);



	svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .style("text-anchor", "end")
      .call(xAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", 40)
      .attr("dx", xcenter)
      .attr("font-size", "1.3em")
      .style("text-anchor", "end")
      .text("time(s)");

  	svg.append("g")
      .attr("class", "y axis")
      .style("text-anchor", "end")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".41em")
      .attr("font-size", "1.3em")
      .style("text-anchor", "end")
      .text("RandomIntegers");

    svg.append("path")
      .datum(datar)
      .attr("class", "randint")
  	  .attr("d", random);

}

function twitter(){
	d3.select("#twitter svg")
		.remove();

	var svg = d3.select("#twitter").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom + 40)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	xtwi.domain(d3.extent(datat, function(d){ return d.count; }));
	y.domain(d3.extent(datat, function(d){ return d.tweets_min; }));

	svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .style("text-anchor", "end")
      .call(xtwitAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", 40)
      .attr("dx", xcenter)
      .attr("font-size", "1.3em")
      .style("text-anchor", "end")
      .text("time(m)");

    svg.append("g")
      .attr("class", "y axis")
      .style("text-anchor", "end")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".41em")
      .attr("font-size", "1.3em")
      .style("text-anchor", "end")
      .text("Tweets/min");

    svg.append("path")
      .datum(datat)
      .attr("class", "tweet")
  	  .attr("d", tweet);
}

cpuupdate();
randomupdate();
twitterupdate();
stockupdate();

