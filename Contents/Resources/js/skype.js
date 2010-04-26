/* Skype Chatstyle JS */

/* Load & resize actions */

var mouseOverElement, alertDoc, topicDoc, chatDoc, topicTextArea, topicElement, alertsElement, bookmarkElement, bookmarkPin, rawTextTopic, isEditing, bookmarkTootlipSet, bookmarkTootlipUnset, resizeInProcess, resizeTimeout, isPublicChat;

var canChangeTopicOption;


onload = function() {
    alertDoc = parent.frames['alertFrame'].document;
    topicDoc = parent.frames['topicFrame'].document;
    chatDoc = parent.frames['chatFrame'].document;
    topicTopicTitle = topicDoc.getElementById("topic");
    topicTextArea = topicDoc.getElementById("topic-text");
    topicElement = topicDoc.getElementById("topic-wrapper");
    alertsElement = alertDoc.getElementById('alerts-wrapper');
    bookmarkElement = topicDoc.getElementById("bookmark");
    bookmarkPin = topicDoc.getElementById("bookmark-pin");
    isEditing = false;
    canChangeTopicOption = false;
	resizeInProcess = false;
	isPublicChat = false;
}

onresize = function() {
    resizeHandler();
}

/* Chat messages */

function insertMessage(html, newmessageID, beforeMessageID) {
    var chat = chatDoc.getElementById('Chat');
    var shouldScroll = nearBottom();

    var newMessage = _createMessage(html, newmessageID);
    
    //find before message
    var beforeMessage = chatDoc.getElementById(beforeMessageID);
    var beforeMessageFound = typeof(beforeMessage) != "undefined";

    if(beforeMessageFound) {
        //Insert if found
        chat.insertBefore(newMessage, beforeMessage)
    } else {
        //Append if not found
        chat.appendChild(newMessage);
        return "ERROR insert before message not found ID=" + beforeMessageID;
    }
    
    if (shouldScroll) scrollToBottom();
    
    return "OK";
}

function appendMessage(html, messageID) {
    var shouldScroll = nearBottom();
    
    appendMessageNoScroll(html, messageID);

    if (shouldScroll) scrollToBottom();
    
    return "OK";
}

function appendMessageNoScroll(html, messageID) {	
    var insert = chatDoc.getElementById("insert");
    if (insert) insert.parentNode.removeChild(insert);
    
    var documentFragment = _createMessage(html, messageID);

    var chat = chatDoc.getElementById('Chat');
    chat.appendChild(documentFragment);
    
    return "OK";
}

function _createMessage(html, messageID){
    var chat = chatDoc.getElementById('Chat');
    
    var range = chatDoc.createRange();
    range.selectNode(chat);
    var documentFragment = range.createContextualFragment(html);

	if(!messageID) var messageID = randomString();
	documentFragment.childNodes[0].id = messageID;
    
    return documentFragment;
}

function appendNextMessage(html, messageID){
    var shouldScroll = nearBottom();
    
    appendNextMessageNoScroll(html, messageID);
    
    if (shouldScroll) scrollToBottom();
    
    return "OK";
}

function appendNextMessageNoScroll(html, messageID){
    var chat = chatDoc.getElementById('Chat');
    var insert = chatDoc.getElementById("insert");
    
    var range = chatDoc.createRange();
    range.selectNode(insert.parentNode);
    var newNode = range.createContextualFragment(html);

	if(!messageID) var messageID = randomString();
	newNode.childNodes[0].id = messageID;
    
    insert.parentNode.replaceChild(newNode,insert);
    
    return "OK";
}

function appendMessagesChunk(html, messageID) {
    var chat = chatDoc.getElementById('Chat');
    var insert = chatDoc.getElementById("insert");

    var shouldScroll = nearBottom();

    var range = chatDoc.createRange();
    range.selectNode(insert.parentNode);
    var newNode = range.createContextualFragment(html);
    
    insert.parentNode.replaceChild(newNode,insert);
    
    if (shouldScroll) scrollToBottom();
    
    return "OK";
}

function nearBottom() {
    return ( chatDoc.body.scrollTop >= ( chatDoc.body.offsetHeight - ( window.innerHeight * 1.2 ) ) );
}

var scrollInterval = null;
var scrollStep = 10;
function scrollToBottom() {
  var currentBottom = chatDoc.body.scrollTop;
  var targetBottom = chatDoc.body.offsetHeight - window.innerHeight;
  console.log(currentBottom + " - " + targetBottom);
  if(currentBottom < targetBottom && scrollStep > 0){
    var moveTo = ((targetBottom - currentBottom)/scrollStep);
    chatDoc.body.scrollTop = currentBottom + moveTo;
    scrollStep = scrollStep -1;
    if(!scrollInterval) scrollInterval = setInterval(scrollToBottom, 10);
  } else {
    chatDoc.body.scrollTop = chatDoc.body.offsetHeight
    clearInterval(scrollInterval);
    scrollInterval = null;
    scrollStep = 15;
  }
//	chatDoc.body.scrollTop = chatDoc.body.offsetHeight;
}

/* Message status change */

function setMessageStatus(messageID, status, additionalText) {
	var statusChanged = false;
	var statusTextChanged = false;
	if(!additionalText || additionalText == "") { additionalText = "&nbsp;"; }
    messageElement = chatDoc.getElementById(messageID);
    
    if (messageElement) {    
		var divsInside = messageElement.getElementsByTagName('*');
		for(var i = 0; i < divsInside.length; i++) {
			var divClass = divsInside[i].className;
			if(divClass == "message-status") { 
				statusSrcOld = divsInside[i].childNodes[1].src;
				ststusSrcNew = statusSrcOld.replace(/status_[a-z]+./, "status_" + status + ".");
				if(status == "pending") { ststusSrcNew = ststusSrcNew.replace(/.png/, ".gif" );} else { ststusSrcNew = ststusSrcNew.replace(/.gif/, ".png" ); }
				divsInside[i].childNodes[1].src = ststusSrcNew;
				statusChanged = true;
			}
			if(divClass == "date") {
				divsInside[i].innerHTML = "<b>" +additionalText+ "</b>";
				statusTextChanged = true;
			}
		}    
		if(statusChanged || statusTextChanged) 
			return "OK";   
		else
			return "COULDNOTCHANGEANYELEMENT";
	}
	else
		return "CANNOTFINDMESSAGE";
}


/* Message editing */

function setMessageEditable(messageID, isEditable) {
    messageElement = chatDoc.getElementById(messageID);
    if (messageElement) {  
    	var paraGraphs = messageElement.getElementsByTagName("P");
    	if (paraGraphs) {
    		var paraGraph = paraGraphs[0];
    		if (isEditable) {
    			paraGraph.contentEditable = "true";
    			paraGraph.style.outline = "none";
    		}
    		else {
    			paraGraph.contentEditable = "false";
    			paraGraph.style.outline = "";
    		}
    		return "OK";
    	}
    }
    return "CANNOTFINDMESSAGE";
}



/* Alert messages */

function setAlert(newalert, messageID, severity, hasCloseButton, AuxButtonTitle, AuxButtonAction) {
    if(newalert) {
        if(!messageID) var messageID = randomString();
        
        var oldalerts = alertsElement.innerHTML;
        var allalerts = new Array();
        allalerts.push(oldalerts);
        allalerts.push("<div class=\"alert-start\" id=\""+messageID+"\">");
        if(oldalerts.length > 10) {
            allalerts.push("<div class=\"alert-separator\"><span></span><\/div>");
        }
        
        switch(severity) {
            case 0:
                var alertType = "notificationicon";
                break;
            case 1:
                var alertType = "warningicon";
                break;
            case 2:
                var alertType = "erroricon";
                break;
            default:
                var alertType = "warningicon";
                break;
        }
        
        if(AuxButtonTitle && AuxButtonAction && AuxButtonTitle != "" && AuxButtonAction.length != "") {
            var auxButton = "<div class=\"alert-aux-button\"><a href=\"" + AuxButtonAction + "\">" + AuxButtonTitle + "<\/a><\/div>";
        } else {
            var auxButton = "";
        }
        
        switch(hasCloseButton) {
            case 0:
                var alertButton = "<div class=\"alert-close\"><\/div>" + auxButton;
                break;
            default:
                var alertButton = "<div class=\"alert-close\"><img src=\"images\/closemessage.png\" hsrc=\"images\/closemessage-over.png\" onclick=\"parent.closeAlertboxCall(arguments[0], '"+messageID+"');\" name=\"closer\" id=\"messagecloser\" width=\"14\" height=\"14\" border=\"0\" class=\"closers\" alt=\"\" \/><\/div>" + auxButton;
                break;
        }
        
        var newalerthtml = "<div class=\"alert-updown\">" +alertButton+ "<div class=\"alert " +alertType+ "\"><div class=\"alert-content\"><div class=\"alert-message\">" +newalert+ "<\/div><\/div><\/div><\/div><\/div>";
        allalerts.push(newalerthtml);
        var displayalerts = allalerts.join('');
        alertsElement.innerHTML = displayalerts;
        
        resizeHandler();
        initHovers(alertDoc);
    }

	return "OK";
}

function closeAlertboxCall(e, messageID) {

	//detect if alt modifier was used, if so call on all, else on specified messageID
	var keycode;
	if (window.event) {
		keycode = window.event.keyCode;
	} else if (e) {
		keycode = e.which;
	}
	
    var e = e || window.event;
    
	if(e.altKey && displayController.closeAllAlertsJSCallback){
		displayController.closeAllAlertsJSCallback();
    } else {
		displayController.closeAlertJSCallback_(messageID);
	}
	
    return "OK";
}

function closeAlertbox(messageID) {
    closeElement = alertDoc.getElementById(messageID);
    closeElement.parentNode.removeChild(closeElement);
   
    resizeHandler();
   
    return "OK";
}

/* Misc functions */

function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 16;
    var randomstring = '';
    for (var i=0; i< string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum+1);
    }
    
    return randomstring;
}

/* Element slide animation */

function moveElement(id, from, to) {
    if(document.getElementById) {
        var movingElement = topicDoc.getElementById(id);
        movingElement.style.top = from + "px";
    }
    from = from + 1;
    if(from < (to-1)) {
        window.setTimeout("moveElement('"+id+"',"+from+","+to+")",0);
    }
}

/* Topic */

function setTopic(html, rawText, doSlide) {
    html = html || "", rawText = rawText || "";
    
    rawTextTopic = rawText;
    
    if(doSlide == false) {
        doSlide = false;
    } else if(doSlide == "true") {
        doSlide = true;
    } else {
        doSlide = true;
    }
    
    if(html && html.length > 0) {
        if(topicTextArea && topicElement) {
			topicTextArea.innerHTML = "";
            topicTextArea.innerHTML = html;
			topicFrameHeight = 0;
            topicZeroCorner = 0 - topicElement.offsetHeight;
            topicFrameHeight = topicElement.offsetHeight - 1;
        } else {
            return false;
        }
    
        if(alertsElement && alertsElement.offsetHeight > 10) {
            var alertFrameHeight = alertsElement.offsetHeight;
        } else {
            var alertFrameHeight = 0;
        }

    	resizeInProcess = true;

        this.document.getElementById("SkypeFrameset").rows = topicFrameHeight + "," + alertFrameHeight + ",*";
    
        if(doSlide == false) {
            topicElement.style.top = -1 + "px";
        } else {
            moveElement("topic-wrapper", topicZeroCorner, 1);
        }

		resizeTimeout = setTimeout("resizeInProcess = false;", 1000);
    } else {
        if(alertsElement && alertsElement.offsetHeight > 10) {
            var alertFrameHeight = alertsElement.offsetHeight;	
        } else {
            var alertFrameHeight = 0;
        }

		resizeInProcess = true;
        
        this.document.getElementById("SkypeFrameset").rows =  "0," + alertFrameHeight + ",*";
        topicElement.style.top = -500 + "px";
		
		resizeTimeout = setTimeout("resizeInProcess = false;",1000);
    }
    
    return "OK";
}

/* Topic Editor */

function keyEvents(e) {
    if(e.keyCode == 13) {
        editTopic(true);
    }
    return false;
}

function editTopic(save) {
    if(save == true) {
        topicTextArea.contentEditable = false;
        topicSpan = topicDoc.getElementById("topic-span");
        newTopic = topicSpan.innerText;
        topicTextArea.removeEventListener("keydown", keyEvents, false);
        isEditing = false;
        // setTopic(newTopic, newTopic, false);
        // for debugging uncomment setTopic line
        displayController.changeTopicJSCallback_(newTopic);
    } else if(save == false) {
        topicTextArea.contentEditable = false;
        topicSpan = topicDoc.getElementById("topic-span");
        newTopic = topicSpan.innerText;
        topicTextArea.removeEventListener("keydown", keyEvents, false);
        isEditing = false;
	} else {
        if(!isEditing && canChangeTopicOption) {
            topicTextArea.innerHTML = "<div style=\"display: inline-block; border: 1px solid #9d9d9d; background: white; color: black; font-weight: normal; text-shadow: none; line-height: 15px; padding: 1px 3px;\"><div id=\"topic-span\" >" +rawTextTopic+ "</div></div>";
            topicSpan = topicDoc.getElementById("topic-span");
            topicSpan.contentEditable = true;
            topicSpan.focus();
            topicSpan.style.outline = "none";
            isEditing = true;
            topicSpan.addEventListener("keydown", keyEvents, false);
        }
    }
}

/* Bookmark image switch */

function setBookmarked(status) {
    if(status == "yes") {
        bookmarkPin.src = "images/bookmark-set.png";
        bookmarkPin.title = bookmarkTootlipUnset;
        //bookmarkPin.onclick = "parent.setBookmarked(\"no\")";	// mihkel commented this line out
    } else {
        bookmarkPin.src = "images/bookmark-notset.png";
        bookmarkPin.title = bookmarkTootlipSet;
        //bookmarkPin.onclick = "parent.setBookmarked(\"yes\")"; // mihkel commented this line out
    }
    
    return "OK";
}

/* Hover initialization */

function initHovers(myFrame) {
    myFrame = eval(myFrame);
    var img, sh, sn;
    for(var i = 0; (img = myFrame.images[i]); i++) {
        if(img.getAttribute) {
            sn = img.getAttribute("src");
            sh = img.getAttribute("hsrc");
            if(sn != "" && sn != null) {
                img.n = new Image();
                img.n.src = img.src;
                if(sh != "" && sh != null) {
                    img.h = new Image();
                    img.h.src = sh;
                    img.onmouseover = mouseOver;
                    img.onmouseout	= mouseOut;
                }
            }
        }
    }
}

function mouseOver() {
    mouseOverElement = this.src;
    this.src = this.h.src;
}

function mouseOut() {
    if(mouseOverElement) {
        this.src = mouseOverElement;
    } else {
        this.src  = this.n.src;
    }
}

/* Window resize handler */

function resizeHandler(){	
	if(resizeInProcess == true) {
		resizeTimeout = setTimeout("resizeHandler()",1000);
	} else {
		clearTimeout(resizeTimeout);
	
		resizeInProcess = true;
	
	    if(topicElement && topicElement.style.top == "-1px") {
	        var topicFrameHeight = topicElement.offsetHeight - 1;
	    } else {
	        var topicFrameHeight = 0;
	    }
    
	    if(alertsElement && alertsElement.offsetHeight > 10) {
	        var alertFrameHeight = alertsElement.offsetHeight;
	    } else {
	        var alertFrameHeight = 0;
	    }

	    if(topicFrameHeight || alertFrameHeight || topicFrameHeight == "0" || alertFrameHeight == "0") {
	        document.getElementById("SkypeFrameset").rows =	 topicFrameHeight + "," + alertFrameHeight + ",*";	
	    }
		
		resizeInProcess = false;
		
		if (alertFrameHeight) {
			chatDoc.body.scrollTop = (chatDoc.body.offsetHeight + alertDoc.height);
		}
	}
}

/* Set tooltips on load */

function setTooltips(bookmarkTooltip, unbookmarkTooltip, topicTooltip) {
    topicTopicTitle.title = topicTooltip;
    bookmarkTootlipSet = bookmarkTooltip;
    bookmarkTootlipUnset = unbookmarkTooltip;
    return "OK";
}


/* Set various options as js global variables */

function setOptions(canChangeTopic) {
    canChangeTopicOption = canChangeTopic;
    return "OK";
}

/* Change stylesheet */

function changeFont() { /* Prompt for testing only */
    fontStyle = prompt("Enter font definition (a'la 23px Arial)", "");
    changeMessageFont(fontStyle);
}

function changeMessageFont(fontStyle){
    if(!chatDoc.styleSheets) return;
    chatDoc.styleSheets[1].cssRules[0].style.font = fontStyle;
}

function setBackground(image, color) {
	var chatBody = chatDoc.getElementById("Chat");
    if(color) {	chatBody.style.backgroundColor = color; }
    if(image) { chatBody.style.backgroundImage = image; }
}


/* set picture */
function setPicture(picturePath) {	// if path evals to false then hide picture

	return "OK"; // currently non-operational

	var picDiv = topicDoc.getElementById("picture");
	var picImg = topicDoc.getElementById("chat-picture");
	if (picturePath) {
		picImg.src = picturePath;
		picDiv.style.display='block';
	
	}
	else {
		picDiv.style.display='none';
	}
	return "OK";
}


function setIsPublic(isPublic) {	// argument is string "true" or "false" 
	isPublicChat = "true" == isPublic;
	return "OK";
}


/* change body of the message, also display editTime and editore in message header */
function editMessage(messageID, editTime, editor, newBodyHtml, localizedEditedString, localizedRemovedString) {	
// numeric message ID, string edit Time, string editorname, string newBodyHtml

	//debug - leave in for ease of debug
    //alert("Message Edited: " + messageID );
	//alert("New Message: " + newBodyHtml);
	
	//set a var to indicate whether a scroll should happen after edit.
	var shouldScroll = nearBottom();
	
	//get a handle to the message html obj
	var chat = chatDoc.getElementById(messageID);
	
	//we don't really need the date do we 
	editTime = editTime.split(' ').pop();
	
	//check that we were able to find/get a handle to the chat object
	if (chat != undefined) {
		//get a handle to the date area span
		var datearea = getElementsByClassName(chat, "span", "date");
	
		//get a handle to the message html paragraph obj
		var messages = chat.getElementsByTagName('p');
		
		//only do edit if we can set both datetime and message
		if (datearea != undefined && messages != undefined && messages[0] != undefined) {
			//set the new edited date area for the message
			datearea[0].innerHTML = "<b> " + localizedEditedString + " " + editTime + "</b>";
			
			//check if the message was removed, changed to no text or updated with new content
			if (newBodyHtml == "" || newBodyHtml == undefined) { //set the removed message
				messages[0].innerHTML = "<i>" + localizedRemovedString + "</i>";
			} else { //update to the new copy
				messages[0].innerHTML = newBodyHtml;
			}
			
			//scroll to bottom if detected it should be done
			if (shouldScroll) scrollToBottom();
		}
	}
	return "OK";

}

/*
Retrieve all elements with class attribute of the specified type, for a document, all elements, or children elements
of a specified element.  Element types to search for the specified class type can also be specified.

oElm: Element to search children of (if any - else use document)
strTagName: Tag name to search accross for specified class name - or * for all)
strClassName: The class name to search for - e.g. datedisplayclass or other class name as a string

*/
function getElementsByClassName(oElm, strTagName, strClassName){
	var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements = new Array();
	strClassName = strClassName.replace(/\-/g, "\\-");
	var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
	var oElement;
	for(var i=0; i<arrElements.length; i++){
		oElement = arrElements[i];
		if(oRegExp.test(oElement.className)){
			arrReturnElements.push(oElement);
		}
	}
	return (arrReturnElements)
}


