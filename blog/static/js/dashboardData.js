var xmlhttp = new XMLHttpRequest();

function getData(url) {
	var data;
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        data = JSON.parse(xmlhttp.responseText);
	    }
	};
	xmlhttp.open("GET", url, false);
	xmlhttp.send();
    return data;
}


