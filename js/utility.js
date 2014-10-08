// JavaScript Document
var apiURL="https://s3-us-west-1.amazonaws.com/blog.chiarng.com/";
var imgURL= apiURL + "img/2014/10/1.JPG";
var imgLink = document.getElementById('imgLink');
//var indexlist= apiURL + "img/indexlist.txt"

function imgSwap(imgURL) {
	document.getElementById('bg').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('leftblur').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('rightblur').style.backgroundImage = "url(" + imgURL + ")";
}

//function populateList(indexlist) {}

//cross-browser support for attaching event listeners
function addEvent(element, event, func) {
	if (element.attachEvent)
		return element.attachEvent('on' + event, func);
	else
		return element.addEventListener(event, func, false);
}

// addEvent (indexlist,'load',function(){populateList();})
addEvent (imgLink,'click',function(e){e.preventDefault();e.stopPropagation();imgSwap(imgURL);});
