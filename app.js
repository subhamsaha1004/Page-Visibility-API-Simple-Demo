window.onload = (function(window){
	var doc = window.document;

	function getPrefix(){
		// Check to see if the browser supports unprefixed property
		if('hidden' in doc)	{
			// if no prefix needed return null
			return null;
		}

		var prefixes = ['moz', 'webkit', 'ms', 'o'],
				prefixeslen = prefixes.length,
				testPrefix = 'Hidden';
		for(var i = 0; i < prefixeslen; i++){
			testPrefix = prefixes[i] + 'Hidden';
			if(testPrefix in doc){
				return prefixes[i];
			}
		}

		// The execution reaches here means the API is not supported
		return null;
	}

	function getPrefixedProperty(prop, prefix){
		var newProp = prop;
		if(prop != 'visibilitychange'){
			var propArr = prop.split('');
			var upperCasedFirstLetter = propArr[0].toUpperCase();
			propArr.shift();
			propArr.unshift(upperCasedFirstLetter);
			newProp = propArr.join('');
		}
		if(prefix){
			return prefix + newProp;
		} else {
			return newProp;
		}
	}

	return function(){
		// get the prefix for the browser
		var prefix = getPrefix();

		// Prefix the properties/events we will be using
		var hidden = getPrefixedProperty('hidden', prefix),
				visibilityState = getPrefixedProperty('visibilityState', prefix),
				visibilitychange = getPrefixedProperty('visibilitychange', prefix);

		console.log(prefix, hidden, visibilitychange, visibilityState);

		// flag to track if the video was playing when the page visibility changed
		var wasPlaying = false;

		// Get a reference to the video element
		var video = doc.getElementById('video');

		// Listen yo the visibility change event
		doc.addEventListener(visibilitychange, function(event){
			// if document is hidden we want to pause the video
			if(doc[hidden]){
				// check to see if the video is playing
				if(video.paused == false){
					// set flag to true and pause the video
					wasPlaying = true;
					video.pause();
				} else {
					// make sure the flag is set to false if the video was paused
					wasPlaying = false;
				}
			} else {
				// if the video was playing when we lost visibility, start it
				if(wasPlaying){
					video.play();
				}
			}
		});
	}
}(this));