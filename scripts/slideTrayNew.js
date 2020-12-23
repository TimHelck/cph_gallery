var slideTray = {};
slideTray.maxZ = 10;

slideTray.element = $("#slideTray");
slideTray.container = $(slideTray.element[0]).find(".container");

slideTray.openSlides = [];
slideTray.openSlides.leftIncrement  = 300;
slideTray.openSlides.topIncrement   = 300;
slideTray.openSlides.startPosL      = 5 - slideTray.openSlides.leftIncrement;
slideTray.openSlides.startPosT      = 5;
slideTray.openSlides.slideWidth		= 288;
slideTray.top						= 84;
slideTray.left						= 20;


$('#slideTray').remove();
slideTray.getRestPosition = function(id) {
	var os = this.openSlides;
	//var totalWidth = $('#slideTray').width();
	//var totalWidth = this.element.width();
	var totalWidth = $("#shell").width();
	var index = os.indexOf(id);
	var posL = os.startPosL;
	var posT = os.startPosT;
//console.log("Line 19: " + posL + ' -- ' + os.leftIncrement);
	
	for(var i = 0; i <= index; i++) {
//console.log("Line 22: " + posL + ' -- ' + os.slideWidth + ' -- ' + totalWidth);
		//if (posL + os.slideWidth < totalWidth) { posL += os.leftIncrement; posT += 10;}
		if (posL + os.slideWidth < totalWidth) { posL += os.leftIncrement;}
		else { posL = 0; posT += os.topIncrement; }
	}
	//posL += os.leftIncrement;
//console.log("Line 31: " + posL + ' -- ' + posT);
	return [posL, posT];
}

slideTray.addSlide = function(id, data) {
	this[id] = new Slide(data, this);
}

slideTray.deleteSlide = function(id) {
	this[id].$canvas.remove(); // is this needed?
	this[id].element[0].remove();
	delete this[id];
	slideTray.openSlides.splice(slideTray.openSlides.indexOf(id),1);
}

slideTray.loadSlide = function(data) {
	var uid = new Date();
	uid = uid.valueOf().toString().slice(-6);
	data.slideId = data.fileName + uid;
	data.rest = true;
	this.openSlides.push(data.slideId);
	[data.posL, data.posT] = this.getRestPosition(data.slideId);
//console.table(data);
	this.addSlide(data.slideId, data);
	$(this.element[0]).removeClass('hidden');
	
	//this.element[0].scrollIntoView();
}

/*
slideTray.setDragTools = function() {
	this.element.draggable( {
		cursor:'move', containment: '#shell'
		//handle: '.bottomDragHandle, .titleBar',
	})
}
slideTray.returnHome = function() {
	$(this.element[0]).css({top:this.top, left:this.left});
}
*/

/*
slideTray.setButtonListeners = function() {
	$("#slideTray .titleBar .btn.close").on('click',     
		(function() { 
			$(this.element[0]).addClass('hidden');
		}).bind(this)
	);
	$("#slideTray .titleBar .btn.sizeMin").on('click',     
		(function() { 
//window.x = this.element;
			$(this.element[0]).addClass('min').removeClass('full small');
			this.element.css('top', '').css('left','');
//			$("#slideTray").css('top','')
//			$("#slideTray").css('left','')
//console.log(this.element);			
//			this.returnHome();
		}).bind(this)
	);
	$("#slideTray .titleBar .btn.sizeSmall").on('click', (
		function() { 
			$(this.element[0]).addClass('small').removeClass('full min');
			this.returnHome();
		}).bind(this)
	);
	$("#slideTray .titleBar .btn.sizeFull").on('click',  (
		function() { 
			$(this.element[0]).addClass('full').removeClass('small min');
			this.returnHome();
		}).bind(this)
	);
}
*/
//slideTray.setDragTools();
//slideTray.setButtonListeners();
