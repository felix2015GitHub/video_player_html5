"use strict";
function VideoPlayer2016(data) {
    this.data = data;
};

VideoPlayer2016.prototype.setup = function(data) {
	var html,
		youtubeHtml,
		data_width = data.width || 600,
		data_height = data.height || 480,
		isYoutube =  data.videoURL && data.videoURL.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);
	html = '\
		<video id="myVideo" preload="auto" style="width:'+data_width+'px;height:'+data_height+'px">\
      		<source src="'+data.videoURL+'" type="video/mp4"/>\
      		<p>Your browser does not support the video tag.</p>\
    	</video>\
    	';
    youtubeHtml = '\
    	<iframe width="640" height="360" src="'+data.videoURL+'?autoplay=1" frameborder="0" allowfullscreen></iframe>\
    ';
    if(isYoutube){
    	//allHide();
    	$("#videoAppend").html(youtubeHtml);
    	$(".videoContainer").css("display", "block").css("width", "640px").css("height", "360px");
    	$(".videoContainer").unbind('mouseenter mouseleave')
    	return;
    }else{
		$("#videoAppend").html(html);
		$(".videoContainer").css("display", "block").css("width", data_width+"px").css("height", data_height+"px");
		return init();
	}
}

var initValue = {
	play: true,
	sound: true,
	curSound: 1,
	fullscreen: false
};

function init(data){
	initValue.play = true;
	initValue.sound = true;
	initValue.fullscreen = false;
	initValue.curSound = $("#myVideo")[0].volume;
	$(".sound i.fa-volume-up").css("display", "block");
	$(".sound i.fa-volume-off").css("display", "none");
	$(".btnFS i.fa-expand").css("display", "block");
	$(".btnFS i.fa-compress").css("display", "none");
	getVideoTime();
	setVideoVolume();
	$("#slider").on('mouseenter',function(){
    	var p = $(this).val();
    	$(this).on('click',function(){
      		p = $(this).val();
      		bg($(this), p);
      		seekTime();
    	});
    	$(this).on('mousemove',function(){
      		p = $(this).val();
      		bg($(this), p);
      		//seekTime();
    	});
  	});
  	$("#volumeSlider").on('mouseenter',function(){
  		var v = $(this).val();
    	$(this).on('click',function(){
      		v = $(this).val();
      		bg($(this), v);
      		initValue.curSound = v/100;
      		setVideoVolume();
    	});
    	$(this).on('mousemove',function(){
      		v = $(this).val();
      		bg($(this), v);
      		initValue.curSound = v/100;
      		setVideoVolume();
    	});
  	});
  	$(".videoContainer").css("display", "block");
  	$("#myVideo")[0].play();
  	$(".btnPlay").click(function(){
		runPlay();
	});
	$(".playRepeatBlock .fa-play").click(function(){
		runPlay();
	});
	$("#myVideo").click(function(){
		runPlay();
	});
	$(".playRepeatBlock .fa-repeat").click(function(){
		runRepeat();
	});
	$(".volumeIcon").click(function(){
		runSound();
	});
	$(".btnFS").click(function(){
		runFullScreen();
	});
	$(".sound").hover(
		function(){
			$(".volumeChange").css("display", "block");
		}, function(){
			$(".volumeChange").css("display", "none");
		}
	);
	$(".videoContainer").hover(
		function(){
			$(".control").css("display", "block");
			$(".caption").css("display", "block");
		}, function(){
			$(".control").css("display", "none");
			$(".caption").css("display", "none");
		}
	);
}

function bg(s, n){
	s.css({
		'background-image':'-webkit-linear-gradient(left ,#fff 0%,#fff '+n+'%,#000 '+n+'%, #000 100%)'
	});
	s.val(n);
}

function volumeStatus(val){
	if(val!=0){
		$(".sound i.fa-volume-up").css("display", "block");
		$(".sound i.fa-volume-off").css("display", "none");
	}else{
		$(".sound i.fa-volume-up").css("display", "none");
		$(".sound i.fa-volume-off").css("display", "block");
	}
}

function runPlay(){
	initValue.play = !initValue.play;
	if(initValue.play){	
		$(".btnPlay i.fa-play").css("display", "none");
		$(".btnPlay i.fa-pause").css("display", "block");
		$(".playRepeatBlock").css("display", "none");
		$(".playRepeatBlock i.fa-play").css("display", "none");
		$("#myVideo")[0].play();
	}else{
		$(".btnPlay i.fa-play").css("display", "block");
		$(".btnPlay i.fa-pause").css("display", "none");
		$(".playRepeatBlock").css("display", "block");
		$(".playRepeatBlock i.fa-play").css("display", "block");
		$("#myVideo")[0].pause();
	}	
}

function runRepeat(){
	$("#myVideo")[0].currentTime = 0;
	initValue.play = true;
	$(".btnPlay i.fa-play").css("display", "none");
	$(".btnPlay i.fa-pause").css("display", "block");
	$(".playRepeatBlock").css("display", "none");
	$(".playRepeatBlock i.fa-repeat").css("display", "none");
	$("#myVideo")[0].play();
}

function getVideoTime(val){
	var durTime, durMins, durSecs, curTime, curMins, curSecs, percentage;
	$("#myVideo").on('loadedmetadata', function() {
		durTime = $("#myVideo")[0].duration,
		durMins = Math.floor(durTime / 60),
		durSecs = Math.floor(durTime - durMins * 60);
	    $(".durtimetext").text((durMins<10?"0"+durMins:durMins) + ":" +(durSecs<10?"0"+durSecs:durSecs));
	});
	$("#myVideo").on('timeupdate', function() {
		curTime = $("#myVideo")[0].currentTime,
		curMins = Math.floor(curTime / 60),
		curSecs = Math.floor(curTime - curMins * 60);
		percentage = 100 * curTime / durTime;
	    $(".curtimetext").text((curMins<10?"0"+curMins:curMins) + ":" +(curSecs<10?"0"+curSecs:curSecs));
	    bg($("#slider"), percentage);
	    if(percentage == 100){
	    	endStatus();
	    }
	});
}

function seekTime(){
	var time, seekMins, seekSecs, durTime, percentage;
	durTime = $("#myVideo")[0].duration
	time = $("#myVideo")[0].duration * ($("#slider").val() / 100);
	seekMins = Math.floor(time / 60),
	seekSecs = Math.floor(time - seekMins * 60);
	percentage = 100 * time / durTime;
	$("#myVideo")[0].currentTime = time;
	$(".curtimetext").text((seekMins<10?"0"+seekMins:seekMins) + ":" +(seekSecs<10?"0"+seekSecs:seekSecs));
	bg($("#slider"), percentage);
	$("#slider").val(percentage);
	initValue.play = false;
	runPlay();
}

function setVideoVolume(){
	$("#myVideo")[0].volume = initValue.curSound;
}

function runSound(){
	if(initValue.sound){
		volumeStatus(0);
		bg($("#volumeSlider"), 0);
		$("#myVideo")[0].volume = 0;
	}else{
		volumeStatus(initValue.curSound*100);
		bg($("#volumeSlider"), initValue.curSound*100);
		setVideoVolume()
	}
	initValue.sound = !initValue.sound;
}

function runFullScreen(){
	var elem = document.getElementById("myVideo");
	if(initValue.fullscreen){	
		$(".btnFS i.fa-compress").css("display", "none");
		$(".btnFS i.fa-expand").css("display", "block");
		if (document.exitFullscreen) {
	      document.exitFullscreen();
	    } else if (document.msExitFullscreen) {
	      document.msExitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitExitFullscreen) {
	      document.webkitExitFullscreen();
	    }
	}else{
		$(".btnFS i.fa-compress").css("display", "block");
		$(".btnFS i.fa-expand").css("display", "none");
		$(".control").css("z-index", "2147483647").css("left", "50%").css("margin-left", "-290px");
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
		  elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
		  elem.webkitRequestFullscreen();
		}
	}	
	initValue.fullscreen = !initValue.fullscreen;
}

function endStatus(){
	$(".playRepeatBlock").css("display", "block");
	$(".playRepeatBlock i.fa-repeat").css("display", "block");
	$(".btnPlay i.fa-play").css("display", "block");
	$(".btnPlay i.fa-pause").css("display", "none");
	initValue.play = false;
}

function allHide(){
	$(".control").css("display", "none");
	$(".playRepeatBlock").css("display", "none");
}