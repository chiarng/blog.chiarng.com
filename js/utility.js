// JavaScript Document

// variable declarations
var apiURL="https://s3-us-west-1.amazonaws.com/blog.chiarng.com/img/";
var postURL="https://s3-us-west-1.amazonaws.com/blog.chiarng.com/posts/"
var imgList = [];
var imgTitle = [];
var imgLinks = '';
var stopDisqusFromGoingCrazy = 0;

// swaps background image given imgURL
function imgSwap(imgURL) {
	document.getElementById('bg').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('leftblur').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('rightblur').style.backgroundImage = "url(" + imgURL + ")";
	exifSwap(imgURL);
	postSwap(imgURL);
	commentSwap(imgURL);
};

// swaps EXIF given imgURL
function exifSwap(imgURL) {
	var invImg = document.createElement('img'); 
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
	    	document.getElementById("titleholder").innerHTML = 
	    		EXIF.getTag(this,"ImageDescription");
		});
	};
	invImg.src = imgURL;
};

// swaps Disqus comments
function commentSwap(imgURL) {
	var disqus_shortname = 'chiarng';
    var disqus_identifier = imgURL.substring(56,66);
    var disqus_url = "http://blog.chiarng.com/#!" + imgURL.substring(56,66);
    stopDisqusFromGoingCrazy = stopDisqusFromGoingCrazy + 1;
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
	if (stopDisqusFromGoingCrazy > 1) {
		DISQUS.reset({
			reload: true,
			config: function () {  
			this.page.identifier = imgURL.substring(56,66);  
			this.page.url = "http://blog.chiarng.com/#!" + imgURL.substring(56,66);
				}
		}); 
	};
};

// grab post data
function postSwap(imgURL) {
	var request = getHTTPObject();
	if (request) {
		request.open('GET', postURL + imgURL.substring(56,60) + imgURL.substring(61,63) + imgURL.substring(64,66), true);
		request.send(null);
		request.onreadystatechange = function(){
			if (request.readyState != 4) return false;
			if (request.status == 200 || request.status == 304) {
				document.getElementById('postholder').innerHTML = (request.responseText);
			};
		};
	};
};

// Google Analytics
function googlytics() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-55723373-1', 'auto');
  ga('send', 'pageview');
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

// access AWS text files (credit to: https://gist.github.com/jesgundy)
function getHTTPObject() {
	var xhr = false;
	if(window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		try {
			var xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				var xhr = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				xhr = false;
			}
		}
	}
	return xhr;
};

// The Great Initializer
function init() {

	// load index into imgList
	var request = getHTTPObject();
	if (request) {
		request.open('GET', postURL + 'index', true);
		request.send(null);
		request.onreadystatechange = function(){
			if (request.readyState != 4) return false;
			if (request.status == 200 || request.status == 304) {
				var imgList = (request.responseText).split(",\n");
				
				// load latest background image
				imgSwap(apiURL + imgList[imgList.length-1].substring(0,4) + "/" + imgList[imgList.length-1].substring(4,6) + "/" + imgList[imgList.length-1].substring(6,9) + ".jpg");

				// resize circles to make more obvious
				document.getElementById('leftcirc').setAttribute('data-state','closed');
				document.getElementById('rightcirc').setAttribute('data-state','closed');

				// on-off state for panels
				addEvent (document.getElementById('leftcirc'), 'click', toggle.bind(null, 'leftcirc', 'closed', 'open'));
				addEvent (document.getElementById('leftcirc'), 'click', toggle.bind(null, 'leftpanel', 'open', 'closed'));
				addEvent (document.getElementById('rightcirc'), 'click', toggle.bind(null, 'rightcirc', 'closed', 'open'));
				addEvent (document.getElementById('rightcirc'), 'click', toggle.bind(null, 'rightpanel', 'open', 'closed'));

				// loop through list of photos and create hyperlinks for each date
				for (i=1; i<imgList.length+1; i++) {
					imgLinks = '<a href id="imglink' + i + '">' + imgList[i-1].substring(0,4) + "/" + imgList[i-1].substring(4,6) + "/" + imgList[i-1].substring(6,9) + '</a> <br>' + imgLinks;
				};

				// replace placeholder with hyperlinks
				document.getElementById("imglinkholder").innerHTML = imgLinks;

				// addEvent to the hyperlink given id and imgURL
				for (ii=1; ii<imgList.length+1; ii++) {
					(function (ii) {
						addEvent (document.getElementById('imglink' + ii),'click',function(e) {
							e.preventDefault();
							e.stopPropagation();
							imgSwap(apiURL + imgList[ii-1].substring(0,4) + "/" + imgList[ii-1].substring(4,6) + "/" + imgList[ii-1].substring(6,9) + ".jpg");
						});
					})(ii);
				};

				// add text to linkheader
				document.getElementById('linkheader').innerHTML = 'Entries';

				// start google analytics
				googlytics();
			};
		};
	};
};

// window.onload
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 10);


	
