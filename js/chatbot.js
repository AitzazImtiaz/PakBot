$(function() {

	// chat aliases
	var you = 'You';
	var robot = 'PakBot';
	var old_data = '';
	var old_lang = '';
	var history = [];
	
  	var d = new Date()
	var client_code = d.getTime() + Math.random()
	
	// initialize
	var chat = $('.chat');
	$('.busy').text(robot + ' is typing...');
	
	// submit user input and get chat-bot's reply
	var submitChat = async() => {
		var language = $('.lang select').val();
		var model = $('.model select').val();
    	var utts = $('.history select').val();


	    if ((language != old_lang || model != old_data) && utts != 1 && old_lang != '') {
	    	old_lang = language;
	    	old_data = model;
	    	alert('You are changing PakBot model. Consider setting history size to 1, so that the new chatbot doesn\'t see the previous conversation. Don\'t forget to set back the history size to the desired value on your next turn or later.');
	    	return;
	    }


		var input = $('.input input').val();
		if(input == '') return;
		$('.busy').css('display', 'block');

    	document.getElementById("btn").disabled = true;
    	document.getElementById("text_input").disabled = true;
    	input = input.slice(0,500);
    	input = input.replace(':', '');
		
		$('.input input').val('');
		updateChat(you, input);
		history.push(input);

		

		hist = history.slice(-utts).join(':::');
	  	const response = await fetch('https://hlt.bme.hu/4lang/vegpont', {
	    	method: 'POST',
	    	mode: 'cors',
	    	body: JSON.stringify({"history": hist, "language": language, "model":model, "code": client_code}), // string or object
	    	headers: {
	      	'Content-Type': 'application/json'
	    	}
	  	});
		var reply = await response.text(); //extract JSON from the http response
		history.push(reply);
		// do something with myJson
		//if(reply == null) return;
		$('.busy').css('display', 'none');
		updateChat(robot, reply);

		old_data = model;
    	old_lang = language;

    	document.getElementById("btn").disabled = false;
    	document.getElementById("text_input").disabled = false;
    	document.getElementById("text_input").focus();
	}
	
	// add a new line to the chat
	var updateChat = function(party, text) {
	
		var style = 'you';
		if(party != you) {
			style = 'other';
		}
		
		var line = $('<div><span class="party"></span> <span class="text"></span></div>');
		line.find('.party').addClass(style).text(party + ':');
		line.find('.text').text(text);
		
		chat.append(line);
		
		chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
	
	}

	
	// event binding
	$('.input').bind('keydown', function(e) {
		if(e.keyCode == 13) {
			submitChat();
		}
	});
	$('.input a').bind('click', submitChat);

	document.getElementById("models").onchange = function () {
		model = $('.model select').val();
		if (model != 'gutenberg' && model != 'opensubtitles') {
			document.getElementById("langs").value = 'en';
			document.getElementById("langs").disabled = true;
		}
		else {
			document.getElementById("langs").disabled = false;
		}

	}

	
	// initial chat state
	updateChat(robot, 'Hi there, I am PakBot, to begin just type and see settings below. Do anything you like here! Talk with me or freak. I am made by my father Aitzaz Imtiaz!');
	updateChat(robot, 'I keenly support Palestine, Ukraine, Kashmir and other victims. But I support peaceful talks and UN, btw I am and my father like USA! Now talk with me -_-');

});
