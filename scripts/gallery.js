var CPH = window.CPH || {};

CPH.loadGalleries = function(data) {

window.d = data;
function renderGalleries(d) {
	var r = '';
	var routerId = '';
	d.dataaddress = {};
	$.each(d.galleries , function(i, g){
		routerId = g.title.replaceAll(/\W/g, '') || "";
		r += renderGallery(1,  i, routerId, g.title, g.description,   g.pictures);
		
	});

	$('#galleries').html(r);
	
	// set sub-gallery link overlay height to match the image
	$.each($(".subGalleryLinkContainer"), function(i, x) {
		var topAndBottomPadding = 10;
		var h = $(x).find(".basicImg").height();
		$(x).find(".galleryTitle").height(h - topAndBottomPadding);
	});

	$("#galleries .openSlide").on("click", {d:d}, handleGalleryClick);
	$("#galleries .getLink").on("click", {d:d}, handleGalleryClick);

	window.addEventListener('load', router);
	window.addEventListener('hashchange', router);

	router();

}


function router() {
	var urlHash = window.location.hash;
	if(urlHash.length) {
		var routerIdArray = urlHash.slice(1).split("-");
		expandElements(routerIdArray);
	}
};

/*
* this function opens a picture based on the routerId attribute. In order to do 
* this it is necessary to open all the pictures, sub-galleries and gallery
* above it.
*/

function expandElementsX(routerIdArray, i) {
	// to open a picture have to expand all of the elements that are above the picture we are on
	i = i || 2;
	var galleries = $("#galleries");
	var pic;
	var routerId;
	setTimeout(function() {
		galleries = $("#galleries");
		routerId = routerIdArray.slice(0, i).join('-');
console.log("Line 90: " + i + ' -- ' + routerId + ' -- ' + routerIdArray.length);
		pic = $(galleries).find('div[data-routerid="' + routerId + '"]')[0];
		pic.click();

		if(routerIdArray.length > i) {
			expandElements(routerIdArray, i+1)
		}
		else {
			runWhenReady(

				function(){ return  !!pic.closest(".isExpanded"); },
				function(){ 
					console.log("Line 72", pic);
					console.log("Line 73", pic.closest(".isExpanded"));
					//pic.closest(".isExpanded").scrollIntoView(true);
				},
				null,
				20, 100
			);
		}
		return;
	}, 0);
}

function expandElements(routerIdArray, i) {
	// to open a picture have to expand all of the elements that are above the picture we are on
	i = i || 2;
	var galleries = $("#galleries");
	var pic;
	var routerId;
	setTimeout(function() {
		galleries = $("#galleries");
		routerId = routerIdArray.slice(0, i).join('-');
console.log("Line 90: " + i + ' -- ' + routerId + ' -- ' + routerIdArray.length);
		pic = $(galleries).find('div[data-routerid="' + routerId + '"]')[0];
		pic.click();

		if(routerIdArray.length > i) {
			expandElements(routerIdArray, i+1)
		}
		else {
			setTimeout(function() {
				pic.closest(".isExpanded").scrollIntoView(true);
			}, 0);
		}
		return;
	}, 0);
}


function runWhenReady(testFunction, inFunction, defaultFunction, mlsecs, reps) {
	let repetition = reps || 5;
	setTimeout(function z() {
		if (testFunction()) {
			inFunction();
		} else if (--repetition) {
			setTimeout(z, mlsecs);
		} else if (defaultFunction) {
			defaultFunction();
		}
	}, mlsecs);
}


function handleGalleryClick(e) {
//console.log("Line 67: ", e);
//console.log("Line 68: ", e.data);
	var data = e.data.d;
	var target = e.target;
	if(target.className === "openSlide") {
		openSlide(target, data);
	}
	else if(target.className === "getLink") {
		getLink(target);
	}
}

function openSlide(target, data) {
	var expandable = $(target).closest(".cell").find(".expandable")[0];
	var node = getNode(
		data.dataaddress.activePicture,
		data.galleries);
	
	var data = { fileName: node.fileName,
	             imageDir: 	'./galleryImages/',
				 title:    	node.title,
				 fileSizes:	node.fileSizes
	};

	slideTray.loadSlide(data);
}

function getLink(target) {
//	var expandable = $(target).closest(".cell").find(".expand")[0] ||  
//					 $(target).closest(".cell").find(".expandable")[0];
	window.x = target;				 

//	var routerId = expandable.dataset.routerid;
	var routerId = ($(target).closest(".cell").find(".expand")[0]     && $(target).closest(".cell").find(".expand")[0].dataset.routerid) ||  
				   ($(target).closest(".cell").find(".expandable")[0] && $(target).closest(".cell").find(".expandable")[0].dataset.routerid);

	var link = window.location.protocol + "//" + window.location.host + window.location.pathname + "#" + routerId;
	navigator.clipboard.writeText(link)
	console.log("Line 65: " + link);
	//console.log(expandable);
	//console.log(target);
}

function renderGallery(level, key, routerId, galleryName, description, d) {
	var r = "<section class='imageGrid'><div class='title'>" + galleryName + "</div>";
	if(description) {
		r += "<div class='galleryDescription'>" + description + "</div>";
	}
	r += "<div>";
	var c;
	if(level > 3) { return; }
	jQuery.each(d, function(i, x) {
		var dataPathName = routerId + "-" + x.title.replaceAll(/\W/g, "") || "";
		if(x.pictures) { 
//console.log("Line 93: " + x.galleryName + " -- " + x.description);
			c  =	"	<div class='cell isCollapsed'>";
			c +=	"		<div class='expandable' data-dataaddress='" + key + ":" + i + "' data-routerid='" + dataPathName + "'>";
			c +=	"			<div class='subGalleryLinkContainer'>";
			c +=	"				<img class='basicImg' src='./galleryImages/thumbnail/" + x.imageFile + ".jpg'>";
			c +=	"				<div class='galleryTitle'>" + x.title + "</div>";
			c +=	"			</div>";
			c +=	"			<div class='arrowUp'></div>";
			c +=	"		</div>";
			c +=	"		<div class='expand'>";
			c += renderGallery(level+1, key + ':' + i, dataPathName, x.title, x.description, x.pictures );
			c +=	"		</div>";
			c +=	"	</div>";		
		}
		else {
//console.log("Line 110: " + x.galleryName + " -- " + x.description);
			c  =	"	<div class='cell isCollapsed'>";
			c +=	"		<div class='expandable' data-dataaddress='" + key + ":" + i + "' data-routerid='" + dataPathName + "'>";
			c +=	"			<img class='basicImg' src='./galleryImages/thumbnail/" + x.imageFile + ".jpg'>";
			c +=	"			<div class='arrowUp'></div>";
			c +=	"		</div>";
			c +=	"		<div class='expand'>";
			c +=    "			<div class='leftColumn'>";
			c += renderPictureDescription(x);
			c +=    "			</div>";
			c +=    "			<div class='leftColumnRelated'></div>";
			c +=	"			<img class='largeImageMain' src='./galleryImages/display/" + x.imageFile + ".jpg'>";
			c +=	"			<img class='largeImageRelated' src=''>";
			c +=    "			<div class='rightColumn'>";
			c +=    "				<div class='buttons'>";
			c +=	"					<img src='./images/openSlide.png' class='openSlide'>";
			c +=	"					<img src='./images/getLink.png' class='getLink'>";
			c +=	"					<a class='expandClose'>&times;</a>";
			c +=    "				</div>";
			c += renderRelatedPictures(x.relatedPictures || [], key + ':' +i, dataPathName);
			c +=    "			</div>";
			c +=	"		</div>";
			c +=	"	</div>";
		}
		r += c;
	});
	r +=	"</div></section>";
	return r;
}

function renderPictureDescription(d) {
	var r = "";
	jQuery.each(['title', 'medium', 'description'], function(i, x) {
		if(d[x]) {
			r += "<div class='" + x + "'>" + d[x] + "</div>";
		}
	});
	return r;
}


function renderRelatedPictures(d, key, routerId) {
	var r = "<div class='relatedPictures'>";
	if(d.length) {
		r += "<div class='title'>Related Pictures</div>";
	}	
	var c = '';
	jQuery.each(d, function(i, x) {
		var dataPathName = routerId + "-" + x.title.replaceAll(/\W/g, "") || "";
		c +=	"		<div class='related' data-dataaddress='" + key + ":" + i + "' data-routerid='" + dataPathName + "'>";
		c +=	"			<img class='basicImg' src='./galleryImages/thumbnail/" + x.imageFile + ".jpg'>";
		c +=	"			<div class='title'>" + (x.title || "") + "</div>";
		c +=	"		</div>";
	});
	r += c;
	r +=	"</div>";
	return r;
}


renderGalleries(data);


var $cell = $('.cell');

function toggleMainPicture() {
  var $thisCell = $(this).closest('.cell');
	$('body').trigger('restoreMainPictureEvent');

  if ($thisCell.hasClass('isCollapsed')) {
	var expandable = $(this).closest(".cell").find(".expandable")[0];
	data.dataaddress.activePicture = $(expandable).data('dataaddress'); 
	data.dataaddress.mainPicture = $(expandable).data('dataaddress'); 
    $cell.not($thisCell).not($($thisCell.parents())).removeClass('isExpanded').addClass('isCollapsed');
    $thisCell.removeClass('isCollapsed').addClass('isExpanded');
  } else {
    $thisCell.removeClass('isExpanded').addClass('isCollapsed');
	data.dataaddress.activePicture = "";
	data.dataaddress.mainPicture = "";
  }
}

// TODO too many listeners, use event delegation
$cell.find('.expandable').click(toggleMainPicture);

// TODO too many listeners, use event delegation
$cell.find('.expandClose').click(function() {
	var $thisCell = $(this).closest('.cell');
	$thisCell.removeClass('isExpanded').addClass('isCollapsed');
	// use setTimeout so that element closes before image is switched (it looks better that way) 
	setTimeout(
		function() { $thisCell.find('.showRelated').removeClass('showRelated'); },
		500
	);
});

function showRelatedImage(e) {
console.log(e.target);
	var routerId;
	if($(e.target).hasClass("related")){
		routerId = $(e.target).attr("data-routerid");
	}
	else {
		var relatedDiv = $(e.target).closest(".related");
		routerId = $(relatedDiv).attr("data-routerid");
	}
console.log("Line 240: " + routerId);
	
	var dataAddress = $(this).data('dataaddress');
	var node = getNode(dataAddress, data.galleries);
	var relatedImagePath =  './galleryImages/display/' + node.fileName + '.jpg';
	
	data.dataaddress.activePicture = dataAddress;
	var largeImageExpand =  $($($(e.target).parents(".isExpanded")[0]).find(".expand")[0]);
	var largeImageRelated = largeImageExpand.find('.largeImageRelated');
	largeImageRelated.attr('src', relatedImagePath);
	largeImageExpand.addClass('showRelated');
	largeImageExpand.attr('data-routerid', routerId);


}

function showRelatedImageDescription(e) {
	var dataAddress = $(this).data('dataaddress');
	var mainPictureDataAddress = dataAddress.split(':').slice(0,-1).join(':');
	var node     = getNode(dataAddress, data.galleries);
	var mainNode = getNode(mainPictureDataAddress, data.galleries);
	var r = "";

	r +=	"		<div class='related restoreMainPicture' data-dataaddress='" + mainPictureDataAddress + "'>";
	r +=	"			<img class='basicImg' src='./galleryImages/thumbnail/" + mainNode.fileName + ".jpg'>";
	r +=	"			<div class='subTitle'>Return to main picture</div>";
	r +=	"		</div>";
		
	
	jQuery.each(['title', 'medium', 'description'], function(i, x) {
		if(node[x]) {
			r += "<div class='" + x + "'>" + node[x] + "</div>";
		}
	});

	//var largeImageExpand = $($('.isExpanded')[0]).find('.expand');
	var largeImageExpand =  $($($(e.target).parents(".isExpanded")[0]).find(".expand")[0]);
	var relatedDescription = largeImageExpand.find('.leftColumnRelated');
	relatedDescription.html(r);
	// not needed???
	//largeImageExpand.addClass('showRelated');


	//$('.restoreMainPicture').click(function(){$('body').trigger('restoreMainPictureEvent');});
	$('.restoreMainPicture').click(restoreMainPicture);
	
}

$('.relatedPictures .related').click(showRelatedImage);
$('.relatedPictures .related').click(showRelatedImageDescription);

function restoreMainPicture(e) {
	var target = e.target;
	if(!$(target).hasClass('restoreMainPicture')) {
		target = $(target).parents('.restoreMainPicture')[0];
	}
	var largeImageExpand = $(target).parents('.expand')[0];
	var nodeData = $($(target).parents('.isExpanded')[0]).find('.expandable')[0].dataset;
	data.dataaddress.activePicture = nodeData && nodeData.dataaddress;
	$(largeImageExpand).removeClass('showRelated');
	$(largeImageExpand).removeClass('data-routerid');
}



// TODO: memoize
function getNode(address, data) {
//console.log("Line 233: " + address);
	var aa = address.split(':');  // address array
	var a = aa[0];  
	var a = parseInt(a, 10) || a;  
	if (aa.length > 1) {
		if (data[a].pictures) {
			return getNode(aa.slice(1).join(":"), data[a].pictures);
		}
		else if(data[a].relatedPictures) {
			return getNode(aa.slice(1).join(":"), data[a].relatedPictures);
		}
		else {
			return {error:'invalidIndex'};
		}
	}
	else if(data[a]){
		var r = {
			title:       data[a].title || '',
			fileName:    data[a].imageFile,
			description: data[a].description   || '',
			medium:      data[a].medium || '',
			fileSizes:   data[a].fileSizes || {}
		};
		return r;
	}
	else {
		return {error:'invalidIndex'};
	}
}

};

var url = 'galleryImages/pictureData.json';
if(document.location.host.match(/localhost/)) {
	url = 'galleryImages/pictureData.json';
}

$.ajax({
	dataType: "text",
	url: url,
	success: function (data) {
		var obj = $.parseJSON(data);
		CPH.loadGalleries(obj);
	},
});

