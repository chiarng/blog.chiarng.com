// JavaScript Document

// variable declarations
var apiURL="http://blog.chiarng.com/img/";
var postURL="http://blog.chiarng.com/posts/"
var imgList = [];
var imgTitle = [];
var imgLinks = '';

// swaps background image given imgURL
function imgSwap(imgURL, jsonPost) {
	document.getElementById('bg').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('leftblur').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('rightblur').style.backgroundImage = "url(" + imgURL + ")";
	exifSwap(imgURL);
	postSwap(jsonPost);
	commentSwap(imgURL);
	dlLinkSwap(imgURL);
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
			this.page.identifier = imgURL.substring(28,34);  
			this.page.url = "http://blog.chiarng.com/#!" + imgURL.substring(28,34);
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
		request.onreadystatechange = function() {
			if (request.readyState != 4) return false;
			if (request.status == 200 || request.status == 304) {
				var imgList = (request.responseText).split(",\n");
				var initImg = (apiURL + imgList[imgList.length-1] + ".jpg");
				var jsonPost = [];

				// preload all post data by parsing through json
				for (i=1; i<imgList.length+1; i++) {
					var requestPost = getHTTPObject();
					if (requestPost) {
						requestPost.open('GET', postURL + imgList[i-1], true);
						requestPost.send(null);
						requestPost.onreadystatechange = function(){
							if (requestPost.readyState != 4) return false;
							if (requestPost.status == 200 || requestPost.status == 304) {
								jsonPost[i-1] = JSON.parse(requestPost.responseText);
							};
						};
					};
				}

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


				// loop through list of photos and create hyperlinks for each date
				for (i=1; i<imgList.length+1; i++) {
					imgLinks = '<a href id="imglink' + i + '">' + jsonPost[i-1].year + jsonPost[i-1].month + jsonPost[i-1].day + '</a> <br>' + imgLinks;
				};

				// replace placeholder with hyperlinks
				document.getElementById('imglinkholder').innerHTML = imgLinks;

				// addEvent to the hyperlink given id and imgURL
				for (ii=1; ii<imgList.length+1; ii++) {
					(function (ii) {
						addEvent (document.getElementById('imglink' + ii),'click',function(e) {
							e.preventDefault();
							e.stopPropagation();
							imgSwap(apiURL + imgList[ii-1] + ".jpg", jsonPost[ii-1]);
							ga('send', 'event', 'button', 'click', imgList[ii-1]);
						});
					})(ii);
				};

				// add text to linkheader
				document.getElementById('linkheader').innerHTML = 'Entries';

				// load latest background image
				imgSwap(initImg, jsonPost[imgList.length-1]);
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


	
