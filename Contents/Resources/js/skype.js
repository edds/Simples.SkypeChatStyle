/* Skype Chatstyle JS */
/*jslint  white: true, 
          browser: true,
          onevar: true, 
          undef: true,  
          eqeqeq: true, 
          plusplus: true, 
          bitwise: true, 
          regexp: true, 
          newcap: true, 
          immed: true,
          indent: 2 */
/*global $, displayController */

function console(a){
  var args = Array.prototype.slice.call(a),
      out = [];
  $(function(){
    args.forEach(function(item, i){
      if(typeof item === "string"){
        out[i] = "'"+item.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;')+"'";
      } else {
        out[i] = item;
      }
    });
    jQuery("#console").html(jQuery("#console").html() + "\n" + a.callee.name + "(" + out.join(', ') + ");");
  });
}


function Skype(){
  this.$chat = $('div#chat');
}
Skype.prototype = {
  lastMessage: {},
  setTopic: function(text){
  },
  setTopicEditable: function(newVal){
  },
  addStatus: function(data){
  },
  addMessage: function(data){
    if(this.lastMessage.user == data.user){
      this.appendMessage(data);
    } else {
      this.createNewMessage(data);
    }
  },
  editMessage: function(data){
  },
  appendMessage: function(data){
    this.$chat.append(data.text);
    
  },
  createNewMessage: function(data){
    this.$chat.append(data.text);
  },
  addAlert: function(data){
  }
};

var s = null;
$(function(){
  s = new Skype();
  sq.flush(s);
});

var canChangeTopicOption = false,
    debug = true;

/* Chat messages */
/*
function insertMessage(html, messageID, beforeMessageID) {
  if(debug){ console(arguments); }
  var $chat          = jQuery("#Chat"),
      $newMessage    = jQuery(html).attr('id', messageID),
      $beforeMessage = jQuery("#"+beforeMessageID);

  if ($beforeMessage.length) {
    $beforeMessage.before($newMessage);
  } else {
    $chat.append($newMessage);
    return "ERROR insert before message not found ID=" + beforeMessageID;
  }
  return "OK";
}
function appendMessageNoScroll(html, messageID) { 
  if(debug){ console(arguments); }
  var $chat       = jQuery("#Chat"),
      $newMessage = jQuery(html).attr('id', messageID);

  jQuery("#insert").remove();
  $chat.append($newMessage);

  return "OK";
}
function appendMessage(html, messageID) {
  if(debug){ console(arguments); }
  return appendMessageNoScroll(html, messageID);
}
function appendMessagesChunkNoScroll(html, messageID) {
  if(debug){ console(arguments); }
  var $newMessage = jQuery(html).attr('id', messageID),
      $insert = jQuery("#insert");

  $insert.replaceWith($newMessage);
  
  return "OK";
}
function appendNextMessageNoScroll(html, messageID) {
  if(debug){ console(arguments); }
  return appendMessagesChunkNoScroll(html, messageID);
}
function appendNextMessage(html, messageID) {
  if(debug){ console(arguments); }
  return appendMessagesChunkNoScroll(html, messageID);
}
function appendMessagesChunk(html, messageID) {
  if(debug){ console(arguments); }
  return appendMessagesChunkNoScroll(html, messageID);
}


* Message status change *

function setMessageStatus(messageID, status, additionalText) {
  if(debug){ console(arguments); }
  if (!additionalText || additionalText === "") { 
    additionalText = "&nbsp;"; 
  } else {
    additionalText = additionalText.split(' ').pop();  
  }
  jQuery('#' + messageID + " .date").html("<b>" + additionalText + "</b>");
  return "OK";   
}

function inithovers(){
  if(debug){ console(arguments); }
}

* Alert messages *

function setAlert(message, messageID, severityID, hasCloseButton, AuxButtonTitle, AuxButtonAction) {
  if(debug){ console(arguments); }
  var severities = ['notification', 'warning', 'error', 'warning'],
      severity   = severities[severityID],
      auxButton  = '';
  
  if (message) {
    if (AuxButtonTitle && AuxButtonAction && AuxButtonTitle !== "" && AuxButtonAction.length !== "") {
      auxButton = '<a href="' + AuxButtonAction + '">' + AuxButtonTitle + '</a></div>';
    }
    jQuery('#Chat').append('<div class="status ' + severity + '"><div class="status-meta">' + auxButton + '</div><p>' + message + '</p></div>');
  }
  return "OK";
}

function closeAlertboxCall(e, messageID) {
  if(debug){ console(arguments); }
  if (e.altKey && displayController.closeAllAlertsJSCallback) {
    displayController.closeAllAlertsJSCallback();
  } else {
    displayController.closeAlertJSCallback_(messageID);
  }
  return "OK";
}

function closeAlertbox(messageID) {
  if(debug){ console(arguments); }
  jQuery("#" + messageID).remove();
  return "OK";
}

* Misc functions *
function randomString() {
  if(debug){ console(arguments); }
  var chars         = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
      string_length = 16,
      randomstring  = '',
      rnum,
      i;
  for (i = 0; i < string_length; i = i + 1) {
    rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }  
  return randomstring;
}

* Topic *
function setTopic(html, rawText, doSlide) {
  if(debug){ console(arguments); }
  html = html || "";
  rawText = rawText || "";
  jQuery('#topic').html(html).data('rawText', rawText);
  return "OK";
}

* Topic Editor *
function editTopic(save) {
  if(debug){ console(arguments); }
  var $topic = jQuery('#topic');
  if (save === true) {
    $topic.attr('contentEditable', false);
    displayController.changeTopicJSCallback_($topic.text());
  } else if (save === false) {
    $topic.attr('contentEditable', false);
  } else if ($topic.attr('contentEditable') === false && canChangeTopicOption) {
    $topic.attr('contentEditable', true).focus();
  }
}
// jQuery(document).ready(function () {
//   jQuery('#topic').bind('keydown', function (e) {
//     if (e.keyCode === 13) {
//       editTopic(true);
//     }
//   });
// });
function setBookmarked(status) {
  if(debug){ console(arguments); }
  // status = string "yes" or "no"
  return "OK";
}

* Set tooltips on load *
function setTooltips(bookmarkTooltip, unbookmarkTooltip, topicTooltip) {
  if(debug){ console(arguments); }
  return "OK";
}


* Set various options as js global variables *
function setOptions(canChangeTopic) {
  if(debug){ console(arguments); }
  canChangeTopicOption = canChangeTopic;
  return "OK";
}

* Change stylesheet *
function changeMessageFont(fontStyle) {
  if(debug){ console(arguments); }
}
function setBackground(image, color) {
  if(debug){ console(arguments); }
}



// Not sure what these are used for?
function setPicture(picturePath) {
  if(debug){ console(arguments); }
  return "OK"; // currently non-operational
}
function setIsPublic(isPublic) {
  if(debug){ console(arguments); }
  return "OK";
}
function setMessageEditable(messageID, isEditable) {
  if(debug){ console(arguments); }
  return "OK";
}

function editMessage(messageID, editTime, editor, newBodyHtml, localizedEditedString, localizedRemovedString) { 
  if(debug){ console(arguments); }
  var $chat    = jQuery("#" + messageID),
      $message = $chat.find('p'),
      $date    = $chat.find('span.date');
      
  //we don't really need the date do we 
  editTime = editTime.split(' ').pop();
  
  //check that we were able to find/get a handle to the chat object
  if ($chat.length) {
    $date.html("<b> " + localizedEditedString + " " + editTime + "</b>");
    //check if the message was removed, changed to no text or updated with new content
    if (newBodyHtml === "" || newBodyHtml === undefined) { //set the removed message
      $message.html("<i>" + localizedRemovedString + "</i>");
    } else { //update to the new copy
      $message.html(newBodyHtml);
    }
  }
  return "OK";
}
*/
