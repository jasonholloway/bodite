if(!this.JSON){this.JSON={}}(function(){function f(n){return n<10?'0'+n:n}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key)}if(typeof rep==='function'){value=rep.call(holder,key,value)}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null'}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null'}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v)}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v}}if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' '}}else if(typeof space==='string'){indent=space}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify')}return str('',{'':value})}}if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j}throw new SyntaxError('JSON.parse')}}}());

var mouseX = 0;
var mouseY = 0;

document.onmousemove = function (e) {
	if (typeof event != 'undefined') { // IE
		mouseX = event.clientX;
		mouseY = event.clientY;
	} else {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}
};

/* Open modal window with specified URL
 url - address of page to be shown in window
 width - width (in px)
 height - height (in px)
 callback - optional, callback function that is called when the window is closed
 */
function draugiemWindowOpen(url, width, height, callback) {
	if (!width) {
		width = 400;
	}
	if (!height) {
		height = 200;
	}
	draugiemLoadUrl({'action': 'infobox', 'url': url, 'width': width, 'height': height}, callback);
}

/* Close modal window,opened with draugiemWindowOpen */
function draugiemWindowClose() {
	draugiemLoadUrl({'action': 'closeinfobox'});
}

/* Resize application iframe to specified height
 If no height is specified, iframe is resized to the size of element
 with id that is specified by draugiem_container variable.
 */
function draugiemResizeIframe(height) {
	if (!height) {
		if (typeof(draugiem_container) !== 'undefined') {
			var container = document.getElementById(draugiem_container);
			height = Math.max(container.offsetHeight, container.scrollHeight) + draugiem_container_offset;
		}
	}
	draugiemLoadUrl({'action': 'setheight', 'height': height});
}

/*Show send message dialog box */
function draugiemSendMessage(uid, topic, text, callback) {
	draugiemLoadUrl({'action': 'sendmessage', 'uid': uid, 'topic': topic, 'text': text}, callback);
}

/*Show send invitation
 text - default invitation text
 extra - extra data to attach to invitation, optional
 */
function draugiemSendInvite(text, extra, callback) {
	draugiemLoadUrl({'action': 'invite', 'text': text, 'extra': extra}, callback);
}

function draugiemSendInviteUID(uid, text, extra, callback) {
	draugiemLoadUrl({'action': 'invite', 'fid': uid, 'text': text, 'extra': extra}, callback);
}

// Ielūgumu sūtīšana. Parametrā saņem objektu "data".
function draugiemSendInvitation(data) {
	var callback = false;
	if (typeof data['callback'] != 'undefined') {
		callback = data['callback'];
		delete data['callback'];
	}
	draugiemLoadUrl({'action': 'invitation', 'data': data}, callback);
}

function draugiemScrollTop() {
	draugiemLoadUrl({'action': 'scrolltop'});
}

function draugiemScrollTo(x, y) {
	draugiemLoadUrl({'action': 'scrollto', 'x': x, 'y': y});
}

/*Show send invitation for current page
 text - default invitation text
 */
function draugiemSendPageInvite(text, callback) {
	draugiemLoadUrl({'action': 'pageinvite', 'text': text}, callback);
}

/*Select users from application friends
 limit - max number of users
 callback - callback function that will receive user ids
 */
function draugiemSelectFriends(limit, callback) {
	draugiemLoadUrl({'action': 'selectusers', 'limit': limit}, callback);
}

/* Post link to draugiem.lv Say
 title - link title
 url - link target url
 titlePrefix - prefix for title, optional
 text - default post text, optional
 callback - optional function that is called with argument true if post was added or false if wasn't
 */
function draugiemSay(title, url, titlePrefix, text, callback, picUrl) {
	draugiemLoadUrl({
		action: 'say',
		title: title,
		link: url,
		titlePrefix: titlePrefix,
		text: text,
		picUrl: picUrl || ''
	}, callback);
}

function draugiemSay2(title, url, titlePrefix, text, callback, container, picUrl) {
	if (!container) {
		container = 'content_frame';
	}
	draugiemLoadUrl({
		action: 'say2',
		title: title,
		link: url,
		titlePrefix: titlePrefix,
		text: text,
		mouseX: mouseX,
		mouseY: mouseY,
		container: container,
		picUrl: picUrl || ''
	}, callback);
}

/* Post image(s) to draugiem.lv gallery
 title - gallery title
 url - image URL or an array of URLs (max 9)
 description - image description text
 callback - optional function that is called with argument true if image was added or false if wasn't
 */
function draugiemGalleryAdd(title, url, description, callback) {
	if (typeof url == 'object') {
		url = url.join('|');
	}
	draugiemLoadUrl({'action': 'gallery', 'title': title, 'description': description, 'url': url}, callback);
}

function draugiemGalleryChoose(count, callback) {
	draugiemLoadUrl({
		'action': 'gallerychoose',
		'count': count
	}, callback);
}
function draugiemVideoChoose(count, callback, par) {
	par = par || {};
	par.type = par.type || 'video';

	var vars = {
		'action': 'gallerychoose',
		'count': count,
		'type': par.type
	};
	draugiemLoadUrl(vars, callback);
}

/*Show  authorize popup (if application is allowed to show content before authorization) */
function draugiemAuthorize(par, callback) {
	par = par || {};
	par.action = 'authorize';
	draugiemLoadUrl(par, callback);
}

function draugiemPagesFan(url, callback) {
	draugiemLoadUrl({'action': 'pagefan', 'url': url}, callback);
}

/*Show  payment popup */
function draugiemPaymentWindow(id, callback) {
	draugiemLoadUrl({'action': 'paymentbox', 'id': id}, callback);
}


function draugiemAddLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function () {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}

function draugiemLoadUrl(vars, callback) {
	vars['_id'] = new Date().getTime();
	if (window.name && window.name.substring(0, 10) == 'dr_iframe_') {
		vars['_name'] = window.name;
	}
	if (callback) {
		vars['callback'] = 1;
		draugiem_callbacks[vars['_id']] = callback;
	}
	window.parent.postMessage(vars, '*');
	return;
}

function validOrigin(origin) {
	var origins = [
		'frype.com',
		'draugiem.lv',
		'dra.lv',
		'ifrype.com',
		'opa.lv'
	];
	var domain = origin.substring(origin.lastIndexOf(".", origin.lastIndexOf(".") - 1) + 1);
	return origins.indexOf(domain) != -1;
}

function draugiemProcessCallback(response) {
	if (!(response.source != parent || response.source == parent.parent) || !validOrigin(response.origin)) {
		if (typeof console == 'object' && typeof console.error == 'function') {
			console.error("Invalid sender");
		}
		return;
	}
	var data = response.data;
	if (data['_id'] && draugiem_callbacks[data['_id']]) {
		draugiem_callbacks[data['_id']](data['data']);
		delete draugiem_callbacks[data['_id']];
	}
}

var draugiem_callbacks = {};
var draugiem_iframe = document.createElement("iframe");

if (typeof(draugiem_container_offset) === 'undefined') {
	var draugiem_container_offset = 0;
}
draugiem_iframe.style.display = "none";

draugiemAddLoadEvent(function () {
	if (window.addEventListener) {
		window.addEventListener('message', draugiemProcessCallback, false);
	} else {
		window.attachEvent('onmessage', draugiemProcessCallback);
	}
	document.body.appendChild(draugiem_iframe);
	if (typeof(draugiem_container) !== 'undefined') {
		draugiemResizeIframe();
	}
});
function getLocation(callback) {
	draugiemLoadUrl({'action': 'get_location'}, callback);
}

function setLocation(location, callback) {
	draugiemLoadUrl({'action': 'set_location', 'location': location}, callback);
}

function draugiemSettings(callback) {
	draugiemLoadUrl({'action': 'settings'}, callback);
}

function draugiemFriends(maxlength, callback) {
	draugiemLoadUrl({'action': 'selectfriends', 'maxlength': maxlength}, callback);
}

function fix() {
	var w = window.open("/cms/files/core/fix/safari.html");
	w.onload = function () {
		w.document.cookie = "safari_fix=1; path=/";
		w.close();
		document.getElementById("fixLink").innerHTML = 'Loading...';
		document.getElementById("fixForm").submit();
	};
}

function draugiemPageInfo(callback) {
	draugiemLoadUrl({'action': 'getPageInfo'}, callback);
}