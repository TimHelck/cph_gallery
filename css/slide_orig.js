div.slide {
	position:absolute;
	font-family:arial;
}

.slide .titleBar {
	display: flex;
	width:100%;
	height:44px;
	padding:4px;
	background-color:#224433;
	border-bottom:solid 1px red;
	position:relative;
	flex-direction: row;
	justify-content:space-between;
	font-size:12px;
	font-family:helvetica;
}

.slide .titleBar .title {
	height: 25px;
	width:50%;
	overflow:hidden;

}

/*********************** Control Bar **************************/

.slide .controlBar {
	display: flex;
	displayX: none;
	flex-direction: row;
	align-items: center;

	position:absolute;
	bottom:0px;
	right:0px;

	cursor:default;
	width:100%;
	height33px;
	background-color: rgba(255,255,255,0.5);
	border-bottom:solid 1px #92BDDB;
	positionX:relative;
	visibility:hidden;
}

.slide .titleBar .button { 
	background-color: rgba(068, 136, 102, 0.8); 
	margin-top:10px; 
}

.slide .titleBar .close {
	cursor:default;
	width:15px;
	height:15px;
	padding:4px;
	margin-top:-4px;
	margin-right:-4px;
	background-colorX:pink;
}

.slide .titleBar .button, 
.slide .controlBar .button { 
	height:15px;
	width:34px;
	display:inline-block;
	font-size:10px;
	cursor: default;
	margin-left:1px;
}
.slide .controlBar .resizeSettings {
	background-colorX:#112411;
	color: black;
	font-size:8pt;
    text-align: center;
	margin: 0 auto;
	padding-bottom:2px;
}

.slide .titleBar .button div,
.slide .controlBar .button div { 
    margin: 5px auto;
    text-align: center;
	font-size:7pt;
	line-height:6px;
}

.slide .controlBarX .on  { background-color: #448866; color: linen; }
.slide .controlBarX .off { background-color: #224433; color: #888888;}

.slide .controlBar .on  { background-color: rgba(068, 136, 102, 0.8); color: linen; }
.slide .controlBar .off { background-color: rgba(034, 068, 051, 0.8); color: #888888;}

.slide .controlBar .close { 
	floatX:right;
	width:20px; 
	margin:11px 5px 0 0;
}



.slide .frame {
	overflow:hidden;
	background-color:white;
	/* needed for the IE7 position:relative/overflow:hidden bug */
	position:relative;
}

.slide .outerFrame {
    position: relative;
	cursor: url(../images/slide/redMoveCursor.png),url(../images/slide/redMoveCursor.png),default;

	/* initial values */
	widthX: 576px;
	width: 288px;
	border:none;
}


.slide canvas {
	position:relative;
	cursor: url(../images/slide/blueMoveCursor.png),url(../images/slide/blueMoveCursor.png),default;
	border: orange solid 1px;
}



.slide .topDragHandle {
    float: left;
    position: relative;
	background-color:#FAFAD2;
	height:35px;
	width:173px;
	margin:5px;
}



.slide .resizeHandle {
	width:15px;
	height:15px;
	positionX:relative;
	position:absolute;
	topX:-56px;
	bottom:0px;
	right:0px;
	background: url(../images/slide/resize.gif) no-repeat bottom right;
	cursor:nwse-resize; 	
}
.slide .resizeHandle img{
	position:relative;
	top:15px;
	left:15px;
}

.slide .bottomDragHandle {
	positionX:relative;
	position:absolute;
	height:30px;
	width:100%;
	background-colorX: rgba(255,100,100,0.5); 
	topX:-30px;
	leftX:1px;
	bottom:0px;
	right:0px;
}

.slide .bottomDragHandle.light {
	background-color:#ffffff;
	/* for IE */
	filter:alpha(opacity=60);
	/* CSS3 standard */
	opacity:0.6;
	
}

