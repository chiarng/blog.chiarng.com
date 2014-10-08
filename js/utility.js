// JavaScript Document
var apiURL="https://s3-us-west-1.amazonaws.com/blog.chiarng.com/";

var imgURL="https://s3-us-west-1.amazonaws.com/blog.chiarng.com/img/2014/10/2.JPG";

function imgSwap() {
	document.getElementById('bg').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('leftblur').style.backgroundImage = "url(" + imgURL + ")";
	document.getElementById('rightblur').style.backgroundImage = "url(" + imgURL + ")";
}