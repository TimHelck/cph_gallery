var config = {
	galleryImagePath: '../galleryImages/thumbnail/', 
	slideImagePath:   './images/',

}

var  Slide = function(pictureData, slideTray) {
	$.extend(this, pictureData);
	//this.scaleFactor = .5;
	this.scaleFactor;
	this.moveCounter = 0;
	if(pictureData.fileSizes && pictureData.fileSizes.lg) { 
		this.imageSrc = pictureData.imageDir + 'large/' + pictureData.fileName + ".jpg";
	}
	else {
		this.imageSrc = pictureData.imageDir + 'display/' + pictureData.fileName + ".jpg";
	}
//console.log("Line 11: ", this.imageSrc);
//console.log("Line 12: ", pictureData.fileSizes);
	this.element = $('<div class="slide"></div>');
	var that = this;
	setTimeout(function() { 
		that.pic = that.loadImage(); 
	}, 200);
	$('#galleries').append(this.element);

	this.element[0].innerHTML = this.getHtml(pictureData);
	var $element = $(this.element[0]); 
	this.outerFrame = $($(this.element[0]).find('.outerFrame')[0]);
	this.frame = $($(this.element[0]).find('.frame')[0]);
	
	var strPosL = this.posL + "px", strPosT = this.posT + "px";
	this.element.css({left:strPosL,top:strPosT});
	this.slideTray = slideTray;
	this.zoomSettings = [1,2,3,4]
	this.zoomSetting = 1;
};

Slide.prototype = {
	
	init: function($element) {
		this.setSlideControls();
		this.setDragTools();
		this.bringToTop(this.slideTray);
	},

	bringToTop: function(slideTray) {
		this.element.css({zIndex: ++(slideTray.maxZ)});
	},

	setSlideControls: function() {
		var $element = $(this.element[0]);
		var that = this;
		$element.on('click', (function() { that.bringToTop(that.slideTray);}).bind(that));
		var zoomButton = $element.find(".zoom .button");
		zoomButton.on('click', this.zoom.bind(this));
		var closeButton = $element.find(".close");
		closeButton.on('click', this.closeSlide.bind(this));

		$element.draggable( {
			cursor:'move'
		});
	},
	zoom: function(e) {
		this.zoomSetting = $(e.target).data('zoom');
		var newW = this.origWidth  * this.zoomSetting;
		var newH = this.origHeight * this.zoomSetting;
		this.outerFrame.width(newW); 
		this.outerFrame.height(newH + 44); 
		this.frame.width(newW); 
		this.frame.height(newH); 
		var $canvas = this.frame.find('canvas')[0];
		var canvasW = $canvas.width;
		var canvasH = $canvas.height;


		// CTX stuff
		this.ctx.save();
		this.ctx.clearRect(0, 0, canvasW, canvasH);
		this.ctx.scale(this.zoomSetting * this.scaleFactor, this.zoomSetting * this.scaleFactor);
		this.ctx.drawImage(this.pic, 0, 0);
		this.ctx.restore();
	},
	handleZoomButtons: function(zoomSetting) {
		var zInBtn  = this.element.find(".zIn");	// right arrow >
		var zOutBtn = this.element.find(".zOut");	// left arrow <

		if(this.zoomSetting > 1) {
			if(this.zoomSetting >= 4) {
				this.disableButton('zIn');
			}
			if (zOutBtn.hasClass("disabled")) {
				this.enableButton('zOut');
			}
		}
		if(this.zoomSetting < 4) {
			if(this.zoomSetting <= 1) {
				this.disableButton('zOut');
			}		
			if (zInBtn.hasClass("disabled")) {
				this.enableButton('zIn');
			}
		}
	},
	enableButton: function(button) {
		var btn = this.element.find("." + button);
		$(btn).removeClass('disabled');
		var inOut = {zIn:'in', zOut:'out'};
		btn.on('click', (function() { this.zoom(inOut[button]);}).bind(this));
	},
	disableButton: function(button) {
		var btn = this.element.find("." + button);
		$(btn).addClass('disabled');
		btn.off("click");
	},

	closeSlide: function() {
//console.log("Line 110: " + this.slideId);
//console.log(this);
		this.slideTray.deleteSlide(this.slideId);
	},
	setDragTools: function() {
		var $element = $(this.element[0]);
  // is this needed?
//		$element.draggable( {
//			cursor:'move'
//		});

	},
	loadImage: function() {
		var pic = new Image();
		var $canvas;
		var ctx;
		var $frame = $($(this.element[0]).find('.frame')[0]);
		var $slide = this.element[0];
		pic.src = this.imageSrc;
		var that = this;

		pic.onload = function() {
			that.pic = pic;
			that.scaleFactor = 288/pic.width;
//console.log("line 136: " + that.scaleFactor);
			var w = pic.width * that.scaleFactor;
			var h = pic.height * that.scaleFactor;
			that.w = w;
			that.h = h;
			that.picW = pic.width;
			that.picH = pic.height;
			var canvas = $('<canvas  width=3000 height=3000></canvas>');
			$frame.css({width:w + 'px', height:h + 'px'});
			$frame.append(canvas);
			$canvas = $($frame).find('canvas')[0];
			ctx = $canvas.getContext("2d");
			ctx.save();
			ctx.scale(that.scaleFactor, that.scaleFactor);
			ctx.drawImage(pic, 0, 0);
			ctx.restore();
			that.ctx = ctx;
			that.pic = pic;
			that.$canvas = $canvas;
			that.origWidth  = w;
			that.origHeight = h;
			that.offsetL = 0;
			that.offsetT = 0;
			that.canvasMax = 400;

			var $element = $(that.element[0]); 
			that.init($element);

		};
		return pic;
	},

	getHtml: function(pictureData) { return ' \
		<div class="outerFrame"> \
			<div class="titleBar"> \
				<div class="title">' + pictureData.title + '</div> \
				<div class="zoom">\
					<div class="caption">Z O O M</div> \
					<div data-zoom="1" class="button 1X on">1X</div> \
					<div data-zoom="2" class="button 2X">2X</div> \
					<div data-zoom="3" class="button 3X">3X</div> \
					<div data-zoom="4" class="button 4X">4X</div> \
				</div> \
				<div class="close"> \
					<img src="./images/slideCloseBtn.png" /> \
				</div> \
			</div> <!-- titleBar --> \
			<div class="frame" ></div> <!-- frame --> \
		</div> <!-- outerFrame -->';
	}
};




