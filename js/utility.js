// JavaScript Document

// variable declarations
var apiURL="https://s3-us-west-1.amazonaws.com/blog.chiarng.com/img/";
var imgList = ["20141001","20141002","20141003"];
var imgTitle = ["Lighthouse","Rose","Sunset"];
var imgLinks = '';

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

function init() {
	// load latest background image
	imgSwap(apiURL + imgList[imgList.length-1].substring(0,4) + "/" + imgList[imgList.length-1].substring(4,6) + "/" + imgList[imgList.length-1].substring(6,9) + ".JPG");

	// loop through list of photos and create hyperlink given date, title, imgURL, id
	for (i=1; i<imgList.length+1; i++) {
		imgLinks = '<a href id="imglink' + i + '">' + imgTitle[i-1] + '</a> <br>' + imgLinks;
	};

	// replace placeholder with hyperlinks
	document.getElementById("imglinkholder").innerHTML = imgLinks;

	// addEvent to the hyperlink given id and imgURL
	for (ii=1; ii<imgList.length+1; ii++) {
		(function (ii) {
			addEvent (document.getElementById('imglink' + ii),'click',function(e) {
				e.preventDefault();e.stopPropagation();imgSwap(apiURL + imgList[ii-1].substring(0,4) + "/" + imgList[ii-1].substring(4,6) + "/" + imgList[ii-1].substring(6,9) + ".JPG");
				});
		})(ii);
	};
};

// window.onload
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 10);