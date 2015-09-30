// JavaScript Document

// variable declarations
var photoURL="https://blog.chiarng.com/photo/";
var postURL="https://blog.chiarng.com/posts/";
var spinner = ""; // required declaration or else can't start/stop later

// swaps background image given imgURL
function imgSwap(imgURL, jsonPost) {
	document.getElementById('bg').style.backgroundImage = "none";
	document.getElementById('leftblur').style.backgroundImage = "none";
	document.getElementById('rightblur').style.backgroundImage = "none";
	spinner.spin(document.getElementById('bg'));
	bgSwap(imgURL);
	exifSwap(imgURL);
	postSwap(jsonPost);
	commentSwap(imgURL);
	dlLinkSwap(imgURL);
};

// background swapper
function bgSwap(imgURL) {
	var bgImg = new Image();
	bgImg.onload = function() {
		document.getElementById('bg').style.backgroundImage = "url(" + bgImg.src + ")";
		document.getElementById('leftblur').style.backgroundImage = "url(" + bgImg.src + ")";
		document.getElementById('rightblur').style.backgroundImage = "url(" + bgImg.src + ")";
		spinner.stop();
	};
	bgImg.src = imgURL;
};

// spinner while loading
function initSpin() {
	var opts = {
		lines: 7, // The number of lines to draw
		length: 25, // The length of each line
		width: 2, // The line thickness
		radius: 33, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 65, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#FFF', // #rgb or #rrggbb or array of colors
		speed: 0.7, // Rounds per second
		trail: 46, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent
		left: '50%' // Left position relative to parent
	};
	spinner = new Spinner(opts).spin(document.getElementById('bg'));
};

// swaps EXIF given imgURL
function exifSwap(imgURL) {
	document.getElementById("exifholder").innerHTML = "";
	var invImg = document.createElement('img'); 
	invImg.crossOrigin = "";
	invImg.onload = function () {
		EXIF.getData(invImg, function() {
			var expoTime = EXIF.getTag(this,"ExposureTime");
			if (expoTime < 1) {expoTime = "1/" + 1/expoTime};
			document.getElementById("exifholder").innerHTML = 
	    		"<b>Camera: </b>" + EXIF.getTag(this,"Model") + "<br>" +
	    		"<b>Date and Time: </b>" + EXIF.getTag(this,"DateTimeOriginal") + "<br>" +
	    		"<b>F-stop: </b>" + "f/" + EXIF.getTag(this,"FNumber") + "<br>" +
	    		"<b>Exposure Time: </b>" + expoTime + " seconds <br>" +
	    		"<b>ISO speed: </b>" + EXIF.getTag(this,"ISOSpeedRatings") + "<br>" +
	    		"<b>Focal Length: </b>" + EXIF.getTag(this,"FocalLength") + "<br>" +
	    		"<b>Exposure Program: </b>" + EXIF.getTag(this,"ExposureProgram") + "<br>" +
	    		"<b>Exposure Bias: </b>" + EXIF.getTag(this,"ExposureBias") + "<br>" +
	    		"<b>Metering Mode: </b>" + EXIF.getTag(this,"MeteringMode") + "<br>" +
	    		"<b>Flash: </b>" + EXIF.getTag(this,"Flash") + "<br>" +
	    		"<b>White Balance Mode: </b>" + EXIF.getTag(this,"WhiteBalance");
		});
	};
	invImg.src = imgURL;
};

// swaps Disqus comments
function commentSwap(imgURL) {
	if (typeof DISQUS != "undefined") {
		DISQUS.reset({
			reload: true,
			config: function () {  
			this.page.identifier = imgURL.substring(30,36);  
			this.page.url = "http://blog.chiarng.com/#!" + imgURL.substring(30,36);
			}
		}); 	
	} else {
		setTimeout( function() {
			commentSwap(imgURL);
		},1000);
	};
};

// swaps download link
function dlLinkSwap(imgURL) {
	document.getElementById('dllinkholder').innerHTML = '<a href="' + imgURL + '"' + ' id="dllinkholder' + '"' +  'target="_blank' + '"">Download Image</a>';
};

// grab post data
function postSwap(jsonPost) {
	document.getElementById("titleholder").innerHTML = jsonPost.title;
	document.getElementById("postholder").innerHTML = jsonPost.postContent;
};

// state toggler 
function toggle(element1, state1, state2) {
	var element1 = document.getElementById(element1);
	element1.setAttribute('data-state', element1.getAttribute('data-state') === state1 ? state2 : state1);
};

// cross-browser support for attaching event listeners
function addEvent(element, event, func) {
	if (element.attachEvent)
		return element.attachEvent('on' + event, func);
	else
		return element.addEventListener(event, func, false);
};

// access AWS text files
function getHTTPObject(url, callback) {
	var request = false;
	if(window.XMLHttpRequest) {
		var request = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		try {
			var request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				var request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				request = false;
			}
		}
	};
	if (request) {
		request.open('GET', url, true);
		request.send(null);
		request.onreadystatechange = function() {
			if (request.readyState != 4) return false;
			if (request.status == 200 || request.status == 304) {
				callback(request.responseText)
			}
		}
	};
};

// get array of entries and callback to getJsonPosts
function getImgList() {
	getHTTPObject(postURL + 'index', getJsonPosts);
};

// setup for getting array of posts
function getJsonPosts(rawList) {
	var jsonPost = [];
	var imgList = rawList.split(",\n");
	makeJsonArray(1, imgList, jsonPost);
	doInitPart1(imgList);
};

// recursively make array of JSON posts and callback to doRestOfInit
function makeJsonArray(n, imgList, jsonPost) {
	if (n == imgList.length+1) {
		doInitPart2(imgList, jsonPost);
	}
	else {
		getHTTPObject(postURL + imgList[n-1], function(rawPost) {
		jsonPost[n-1] = JSON.parse(rawPost);
		return makeJsonArray(n+1, imgList, jsonPost);
	});
	}
};

// part of init that only needs imgList
function doInitPart1(imgList) {

	// initialize Disqus
	var disqus_shortname = 'chiarng';
    var disqus_identifier = imgList[imgList.length-1];
    var disqus_url = "http://blog.chiarng.com/#!" + imgList[imgList.length-1];
	(function() {
    	var dsq = document.createElement('script'); 
    	dsq.type = 'text/javascript'; 
    	dsq.async = true;
    	dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	})();

	// resize circles to make more obvious
	document.getElementById('leftcirc').setAttribute('data-state','closed');
	document.getElementById('rightcirc').setAttribute('data-state','closed');

	// on-off state for panels
	addEvent (document.getElementById('leftcirc'), 'click', toggle.bind(null, 'leftcirc', 'closed', 'open'));
	addEvent (document.getElementById('leftcirc'), 'click', toggle.bind(null, 'leftpanel', 'open', 'closed'));
	addEvent (document.getElementById('rightcirc'), 'click', toggle.bind(null, 'rightcirc', 'closed', 'open'));
	addEvent (document.getElementById('rightcirc'), 'click', toggle.bind(null, 'rightpanel', 'open', 'closed'));
};

// part of init that needs both imgList and jsonPost
function doInitPart2(imgList, jsonPost) {
	var imgLinks = '';

	// load latest background image
	var initImg = (photoURL + imgList[imgList.length-1] + ".jpg");
	imgSwap(initImg, jsonPost[imgList.length-1]);

	// add text to linkheader
	document.getElementById('linkheader').innerHTML = 'Entries';

	// loop through list of photos and create hyperlinks for each date
	for (i=1; i<imgList.length+1; i++) {
		imgLinks = '<a href id="imglink' + i + '">' + jsonPost[i-1].date.month + ' ' + jsonPost[i-1].date.day + ', ' + jsonPost[i-1].date.year + '</a> <br>' + imgLinks;
	};

	// replace placeholder with hyperlinks
	document.getElementById('imglinkholder').innerHTML = imgLinks;

	// addEvent to the hyperlink given id and imgURL
	for (ii=1; ii<imgList.length+1; ii++) {
		(function (ii) {
			addEvent (document.getElementById('imglink' + ii),'click',function(e) {
				e.preventDefault();
				e.stopPropagation();
				imgSwap(photoURL + imgList[ii-1] + ".jpg", jsonPost[ii-1]);
				ga('send', 'event', 'button', 'click', imgList[ii-1]);
			});
		})(ii);
	};

	// fire event if hashtag in url
	if (window.location.hash){
		var hash = window.location.hash.substring(1);
		if (hash) {
			document.getElementById(hash).click();
		};
	};
};

// The Great Initializer
function init() {
	initSpin();
	getImgList();
};

// window.onload
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 10);