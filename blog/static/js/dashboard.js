var timeoutId = 0;
var data = [];
var datat = [];

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 480 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var parseDate = d3.time.format("%H:%M:%S").parse;

var xcenter =  width/2;

var x = d3.time.scale()
    .range([0, width]);

var xtwi = d3.scale.linear()
	.range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%S"));

var xtwitAxis =d3.svg.axis()
	.scale(xtwi)
	.orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

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
	.x(function(d) { return x(d.count);})
	.y(function(d) { return y(d.twittercount);});

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
	  	if(data.length === 25) {
		    data.shift();
		}
		data.push({
		    "creatTime":  myGetTime(),
		    "cpuPer": importedData.cpuper,
		    "memoryPer": importedData.memory,
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

function cpuupdate() {
  getTime(data);
  dataConversion();
  cpuMemory();
  randomInt();
  timeoutId = setTimeout("cpuupdate()", 1000);
}

function twitterupdate() {
	twitterdata();
	twitter();
	timeoutId = setTimeout("twitterupdate()", 1000);
}

function dataConversion() {
	data.forEach(function(d) {
	    if(typeof d.creatTime === "string") {
	       d.cpuPer = +d.cpuPer;
	       d.creatTime = parseDate(d.creatTime);
	       d.memoryPer = +d.memoryPer;
	       d.randint = +d.randint;
	    }
	});
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
    y.domain(d3.extent([].concat(data.map(function(item) { return (item.cpuPer); }),
        data.map(function(item) {
        return (item.memoryPer);
    }))));

  	svg.append("g")
      .attr("class", "x axis")
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


	x.domain(d3.extent(data, function(d) { return d.creatTime; }));
	y.domain(d3.extent(data, function(d){ return d.randint; }));

	svg.append("g")
      .attr("class", "x axis")
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
      .datum(data)
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

	x.domain(d3.extent(datat, function(d){ return d.count; }));
	y.domain(d3.extent(datat, function(d){ return d.twittercount; }));

	svg.append("g")
      .attr("class", "x axis")
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
//twitterupdate();
