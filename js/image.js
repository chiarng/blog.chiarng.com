// JavaScript Document
var apiURL="https://s3-us-west-1.amazonaws.com/blog.chiarng.com/";

function resizeToMax(id){
    myImage = new Image() 
    var img = document.getElementById(id);
    myImage.src = img.src; 
    if(myImage.width / document.body.clientWidth > myImage.height / document.body.clientHeight){
        img.style.width = "100%";
    } else {
        img.style.height = "100%";
    }
}