var config = {
	galleryImagePath: '../galleryImages/thumbnail/', 
	slideImagePath:   './images/',

}

var  Slide = function(pictureData, slideTray) {
	$.extend(this, pictureData);
	//this.scaleFactor = .5;
	this.scaleFactor;
	this.zoomSetting = 2;
	this.baseWidth = 288;
	this.moveCounter = 0;
	if(pictureData.fileSizes && pictureData.fileSizes.lg && pictureData.fileSizes.lg === "1") { 
		this.imageSrc = pictureData.imageDir + 'large/' + pictureData.fileName + ".jpg";
	}
	else {
		this.imageSrc = pictureData.imageDir + 'display/' + pictureData.fileName + ".jpg";
	}
	this.element = $('<div class="slide" style="width:' + this.baseWidth * this.zoomSetting + 'px"></div>');
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

};

Slide.prototype = {
	
	init: function($element) {
		this.setSlideControls();
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

		this.makeDraggable($element);
	},
	zoom: function(e) {
		this.zoomSetting = $(e.target).data('zoom');
		var $slide = $(this.element[0]);

		var newW = this.origWidth  * this.zoomSetting;
		var newH = this.origHeight * this.zoomSetting;
		this.element[0].style.width = newW + 'px'; 
		this.outerFrame.height(newH + 44); 
		this.frame.height(newH); 
		var $canvas = this.frame.find('canvas')[0];
		var canvasW = $canvas.width;
		var canvasH = $canvas.height;

		//highlight zoom button
		$($slide.find(".zoom .button")).removeClass("on");
		$($slide.find(".zoom .button." + this.zoomSetting + "X")[0]).addClass("on");

		// CTX stuff
		this.ctx.save();
		this.ctx.clearRect(0, 0, canvasW, canvasH);
		this.ctx.scale(this.zoomSetting * this.scaleFactor, this.zoomSetting * this.scaleFactor);
		this.ctx.drawImage(this.pic, 0, 0);
		this.ctx.restore();

		this.makeDraggable($slide);

	},

	/*
		Dec 2020, added containment option because without that, it is easy to drag slide
		out of document and lose it.

		The tricky part is that zoomed slide can be big. It has to be possible to drag
		it part way outside of the document, but limit is set so that at least 50 px is still 
		accessible inside document. 
	*/
	makeDraggable: function(element) {
		var $element = element instanceof jQuery ? element : $(element) ;

		var picH = $element.height();
		var picW = $element.width();
		var docH = $(document).height();
		var docW = $(document).width();
		var containmentArray = [-(picW - 50), -(picH - 50), (docW -50), (docH -50)];
		console.log("Line 110: " + picW + "  " + picH + "  " + docW + "  " + docH);
		//console.log("Line 111: ", containmentArray);

		$element.draggable( {
			cursor:'move', 
			containment:containmentArray, 
			opacity: 0.5,
			//stop: function() { console.log($(this).position());}
		});

	},

	closeSlide: function() {
		this.slideTray.deleteSlide(this.slideId);
	},
	setDragTools: function() {
		var $element = $(this.element[0]);

	},


	loadImage: function() {
		var pic = new Image();
		var $canvas;
		var ctx;
		var $slide = $(this.element[0]);
		var $frame = $($slide.find('.frame')[0]);
		pic.src = this.imageSrc;
		var that = this;

		pic.onload = function() {
			that.pic = pic;
			that.scaleFactor = 288/pic.width;
//console.log("line 136: " + that.scaleFactor);
			that.origWidth  = pic.width * that.scaleFactor;
			that.origHeight = pic.height * that.scaleFactor;

			that.w =  that.origWidth  * that.zoomSetting;
			that.h =  that.origHeight * that.zoomSetting;
			var canvas = $('<canvas  width=3000 height=3000></canvas>');
			$frame.css({width: + '100%', height:that.h + 'px'});
			$frame.append(canvas);
			$canvas = $($frame).find('canvas')[0];
			ctx = $canvas.getContext("2d");
			ctx.save();
			ctx.scale(that.scaleFactor * that.zoomSetting, that.scaleFactor * that.zoomSetting);
			ctx.drawImage(pic, 0, 0);
			ctx.restore();
			that.ctx = ctx;
			that.pic = pic;
			that.$canvas = $canvas;
			that.offsetL = 0;
			that.offsetT = 0;
			that.canvasMax = 400;
			$($slide.find(".zoom .button." + that.zoomSetting + "X")[0]).addClass("on");

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
					<div data-zoom="1" class="button 1X">1X</div> \
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




