var CPH = window.CPH || {};

CPH.loadGalleries = function(data) {
function renderGalleries(d) {
	var r = '';
	d.dataaddress = {};
	$.each(d.galleries , function(i, g){
		r += renderGallery(1,  i, g.title, g.description,   g.pictures);
		
	});

	$('#galleries').html(r);
	
	// set sub-gallery link overlay height to match the image
	$.each($(".subGalleryLinkContainer"), function(i, x) {
		var topAndBottomPadding = 10;
		var h = $(x).find(".basicImg").height();
		$(x).find(".galleryTitle").height(h - topAndBottomPadding);
	});

	$("#galleries .openSlide").on("click", {d:d}, handleGalleryClick);
}

function handleGalleryClick(e) {
	var data = e.data.d;
	var target = e.target;
	if(target.className === "openSlide") {
		openSlide(target, data);
	}
}

function openSlide(target, data) {
	var expandable = $(target).closest(".cell").find(".expandable")[0];
//console.log("Line 39: ", data.dataaddress);
	var node = getNode(
		data.dataaddress.activePicture,
		data.galleries);
//	var largeImagePath =  './galleryImages/large/' + node.fileName + '.jpg';
//	var displayImagePath =  './galleryImages/display/' + node.fileName + '.jpg';
//console.log("Line 40: ", node);

	// need a way to select "large" if available. Maybe this should happen in Slide.
	var data = { fileName: node.fileName,
	             //imageDir: 	'./galleryImages/display/',
	             imageDir: 	'./galleryImages/',
				 title:    	node.title,
				 fileSizes:	node.fileSizes
	};
	slideTray.loadSlide(data);

}


function renderGallery(level, key, galleryName, description, d) {
	var r = "<section class='imageGrid'><div class='title'>" + galleryName + "</div>";
	if(description) {
		r += "<div class='galleryDescription'>" + description + "</div>";
	}
	r += "<div>";
	var c;
	if(level > 3) { return; }
	jQuery.each(d, function(i, x) {
		if(x.pictures) { 
//console.log("Line 93: " + x.galleryName + " -- " + x.description);
			c  =	"	<div class='cell isCollapsed'>";
			c +=	"		<div class='expandable' data-dataaddress='" + key + ":" + i + "'>";
			c +=	"			<div class='subGalleryLinkContainer'>";
			c +=	"				<img class='basicImg' src='./galleryImages/thumbnail/" + x.imageFile + ".jpg'>";
			c +=	"				<div class='galleryTitle'>" + x.title + "</div>";
			c +=	"			</div>";
			c +=	"			<div class='arrowUp'></div>";
			c +=	"		</div>";
			c +=	"		<div class='expand'>";
			c += renderGallery(level+1, key + ':' + i,  x.title, x.description, x.pictures );
			c +=	"		</div>";
			c +=	"	</div>";		
		}
		else {
//console.log("Line 110: " + x.galleryName + " -- " + x.description);
			c  =	"	<div class='cell isCollapsed'>";
			c +=	"		<div class='expandable' data-dataaddress='" + key + ":" + i + "'>";
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
			c +=	"					<a class='expandClose'>&times;</a>";
			c +=    "				</div>";
			c += renderRelatedPictures(x.relatedPictures || [], key + ':' +i);
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


function renderRelatedPictures(d, key) {
	var r = "<div class='relatedPictures'>";
	if(d.length) {
		r += "<div class='title'>Related Pictures</div>";
	}	
	var c = '';
	jQuery.each(d, function(i, x) {
		c +=	"		<div class='related' data-dataaddress='" + key + ":" + i + "'>";
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
	var dataAddress = $(this).data('dataaddress');
	var node = getNode(dataAddress, data.galleries);
	var relatedImagePath =  './galleryImages/display/' + node.fileName + '.jpg';
	
	data.dataaddress.activePicture = dataAddress;
	var largeImageExpand =  $($($(e.target).parents(".isExpanded")[0]).find(".expand")[0]);
	var largeImageRelated = largeImageExpand.find('.largeImageRelated');
	largeImageRelated.attr('src', relatedImagePath);
	largeImageExpand.addClass('showRelated');


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
	largeImageExpand.addClass('showRelated');


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
}



// TODO: memoize
function getNode(address, data) {
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
	url = 'admin/public/pictureData.json';
}

$.ajax({
	dataType: "text",
	url: url,
	success: function (data) {
		var obj = $.parseJSON(data);
		CPH.loadGalleries(obj);
	},
});

