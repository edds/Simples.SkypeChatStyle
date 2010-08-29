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
window.onload = function(){
  setTooltips('Bookmark this chat', 'Unbookmark this chat', 'Double-click here to set chat topic');
  setOptions(true);
  setTopic('E to the double D - a name you can eat', 'E to the double D - a name you can eat', false);
  setBookmarked('no');
  appendMessageNoScroll('<div class="service">  <p>View earlier messages: <a href="skypechatshowallmessages://7">1&nbsp;Week</a> | <a href="skypechatshowallmessages://14">2&nbsp;Weeks</a> | <a href="skypechatshowallmessages://31">1&nbsp;Month</a> | <a href="skypechatshowallmessages://92">3&nbsp;Months</a> | <a href="skypechatshowallmessages://183">6&nbsp;Months</a></p></div><div id="insert"></div>', '-2');
  appendMessageNoScroll('<div class="incoming message-block">  <div class="buddy-icon"><img src="Incoming/buddy_icon.png" class="avatar"/></div>  <div class="message-speech"></div>  <div class="message">    <div class="message-item">      <div class="message-meta">        <span class="sender"><a href="skypechatcontact://philnash">Phil Nash</a> &mdash;</span>        <span class="date">16/07/2010 17:52</span>      </div>      <p class="context">I need to update the bundle</p>    </div>    <div id="insert"></div>  </div></div>', '101');
  appendNextMessageNoScroll('<div class="message-item next">  <div class="message-meta">    <span class="date">16/07/2010 17:52</span>  </div>  <p class="context">then run the pyrite tests</p></div><div id="insert"></div>', '100');
  appendNextMessageNoScroll('<div class="message-item next">  <div class="message-meta">    <span class="date">16/07/2010 17:52</span>  </div>  <p class="context">then push</p></div><div id="insert"></div>', '99');
  appendNextMessageNoScroll('<div class="message-item next">  <div class="message-meta">    <span class="date">16/07/2010 17:52</span>  </div>  <p class="context">and explain in the bug what I did</p></div><div id="insert"></div>', '98');
  appendMessageNoScroll('<div class="incoming message-block">  <div class="buddy-icon"><img src="file:///Users/edd/Library/Application Support/Skype/AvatarCache/rodreegez.jpeg?no=1036733308" class="avatar"/></div>  <div class="message-speech"></div>  <div class="message">    <div class="message-item">      <div class="message-meta">        <span class="sender"><a href="skypechatcontact://rodreegez">Adam</a> &mdash;</span>        <span class="date">16/07/2010 17:52</span>      </div>      <p class="context">&quot;fixed it&quot;</p>    </div>    <div id="insert"></div>  </div></div>', '97');
  appendMessageNoScroll('<div class="outgoing message-block">  <div class="buddy-icon"><img src="file:///Users/edd/Library/Application Support/Skype/AvatarCache/esowden.jpeg?no=604730552" class="avatar"/></div>  <div class="message-speech"></div>  <div class="message">    <div class="message-item">      <div class="message-meta">        <span class="sender"><a href="skypechatcontact://esowden">Edd Sowden</a> &mdash;</span>        <span class="date">16/07/2010 17:52</span>      </div>      <p class="context">why would you have an email footer that contains &quot;&gt;&gt; my name &lt;&lt;&quot; Mail.app thinks you are quoting something.</p>    </div>    <div id="insert"></div>  </div></div>', '96');
  appendMessageNoScroll('<div class="incoming message-block">  <div class="buddy-icon"><img src="file:///Users/edd/Library/Application Support/Skype/AvatarCache/rodreegez.jpeg?no=758361883" class="avatar"/></div>  <div class="message-speech"></div>  <div class="message">    <div class="message-item">      <div class="message-meta">        <span class="sender"><a href="skypechatcontact://rodreegez">Adam</a> &mdash;</span>        <span class="date">16/07/2010 17:53</span>      </div>      <p class="context">well, if your name ever changes you don\'t have to update your email</p>    </div>    <div id="insert"></div>  </div></div>', '95');
  appendNextMessageNoScroll('<div class="message-item next">  <div class="message-meta">    <span class="date">16/07/2010 17:53</span>  </div>  <p class="context">seems sensible to me</p></div><div id="insert"></div>', '94');
  appendMessageNoScroll('<div class="outgoing message-block">  <div class="buddy-icon"><img src="file:///Users/edd/Library/Application Support/Skype/AvatarCache/esowden.jpeg?no=1358507614" class="avatar"/></div>  <div class="message-speech"></div>  <div class="message">    <div class="message-item">      <div class="message-meta">        <span class="sender"><a href="skypechatcontact://esowden">Edd Sowden</a> &mdash;</span>        <span class="date">16/07/2010 17:56</span>      </div>      <p class="context">Pub time.</p>    </div>    <div id="insert"></div>  </div></div>', '93');
  appendMessageNoScroll('<div class="incoming message-block">  <div class="buddy-icon"><img src="file:///Users/edd/Library/Application Support/Skype/AvatarCache/rodreegez.jpeg?no=1727058908" class="avatar"/></div>  <div class="message-speech"></div>  <div class="message">    <div class="message-item">      <div class="message-meta">        <span class="sender"><a href="skypechatcontact://rodreegez">Adam</a> &mdash;</span>        <span class="date">16/07/2010 17:57</span>      </div>      <p class="context">5 min</p>    </div>    <div id="insert"></div>  </div></div>', '92');
  setAlert('Messages in this chat are older than 1 day', '4294967293', 0, 1, '', '');
}
/* Chat messages */

function SkypeQueue(){
  this._methods = {};
  this._flushed = false;
}
SkypeQueue.prototype = {
  push: function(data){
    if(this._flushed){
      this.call(data);
    } else {
      this._methods.push(data);
    }
  },
  flush: function(s){
    if(this._flushed){
      return true;
    }
    this._flushed = true;
    this._s = s;
    while(this._methods[0]){
      this.call(this._methods.shift());
    }
  },
  call: function(fn){
    var scope = this._s;
    fn.apply(scope, []);
  }
}
var sq = new SkypeQueue();
function insertMessage(html, newmessageID, beforeMessageID){
  sq.push(function(){ this.addMessae({ text: html, mID: newmessageID }); });
}

function appendMessage(html, messageID){
  sq.push(function(){ this.addMessage({ text: html, mID: messageID }); });
}

function appendMessageNoScroll(html, messageID){
  sq.push(function(){ this.addMessage({ text: html, mID: messageID }); });
}

function appendNextMessage(html, messageID){
  sq.push(function(){ this.addMessage({ text: html, mID: messageID }); });
}

function appendNextMessageNoScroll(html, messageID){
  sq.push(function(){ this.addMessage({ text: html, mID: messageID }); });
}

function appendMessagesChunk(html, messageID){
  sq.push(function(){ this.addMessage({ text: html, mID: messageID }); });
}

function setMessageStatus(messageID, status, text){
  sq.push(function(){ this.addStatus({ status: status, text: text, mID: messageID })});
}

function setMessageEditable(messageID, isEditable){
}

function setAlert(newalert, messageID, severity, hasCloseButton, AuxButtonTitle, AuxButtonAction){
  sq.push(function(){ 
    this.addAlert({ text: newalert, mID: messageID, severity: severity });
  });
}

function closeAlertbox(messageID){
}

function setTopic(html, rawText, doSlide){
  sq.push(function(){ this.setTopic({ text: rawText, html: html }); });
}

function editTopic(save){
  chatDoc.editTopic(save);
}

function setBookmarked(status){
}

function setTooltips(bookmarkTooltip, unbookmarkTooltip, topicTooltip){
}

function setOptions(canChangeTopic){
  sq.push(function(){ this.setTopicEditable(canChangeTopic); })
}

function changeMessageFont(fontStyle){
}

function setBackground(image, color){
}

function setPicture(picturePath){
}

function setIsPublic(isPublic){
}

function editMessage(messageID, editTime, editor, newBodyHtml, localizedEditedString, localizedRemovedString){
  sq.push(function(){ this.editMessage({ mID: messageID, time: editTime, text: newBodyHtml, editString: localizedEditedString}); })
}
