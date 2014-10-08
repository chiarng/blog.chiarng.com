// JavaScript Document

var apiURL="https://s3-us-west-1.amazonaws.com/blog.chiarng.com/";

//swaps background image give imgURL
function imgSwap(imgURL) {
	document.getElementById('bg').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('leftblur').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('rightblur').style.backgroundImage = "url(" + imgURL + ")";
};

//cross-browser support for attaching event listeners
function addEvent(element, event, func) {
	if (element.attachEvent)
		return element.attachEvent('on' + event, func);
	else
		return element.addEventListener(event, func, false);
};

// loop through list of photo names
// create hyperlink given date, title, imgURL, id
// addEvent to the hyperlink given id and imgURL

var imgList = [1,2,3];
var x = '';

for (i=1; i<imgList.length+1; i++) {
	var x = '<a href id="imglink' + i + '"> Date and Title of Image </a> <br>' + x;
};
document.getElementById("imglist").innerHTML = x;

for (ii=1; ii<imgList.length+1; ii++) {
	(function (ii) {
		addEvent (document.getElementById('imglink' + ii),'click',function(e) {
			e.preventDefault();e.stopPropagation();imgSwap(apiURL + "img/2014/10/" + ii + ".JPG");
			});
	})(ii);
}

var imgURL = apiURL + "img/2014/10/1.JPG";
var imgLink = document.getElementById('imglink');

addEvent (imgLink,'click',function(e){e.preventDefault();e.stopPropagation();imgSwap(imgURL);});