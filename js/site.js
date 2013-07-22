// Cycle Plugin for Banner
$(function() {
    $('.rotate').cycle({
		fx: 'fade', // choose your transition type, ex: fade, scrollUp, shuffle, etc...
		speed: 1000,
		timeout: 4000
	});
});

//Form Defender
;(function($,_) {
	var E, SubmitBtn, Form, ON = on = true, OFF = off = false;

	_.errorCSS        = ".error"; // css class name.
	_.successCSS      = ".success"; // css class name.
	_.submitAction    = "/capture.weblead"; // overwrites html action attribute.
	_.placeHolders    = ON;  // ON or OFF
	_.alertMsg        = ""; // OFF or "message"
	Form              = "form#contactForm"; // css selector.
	SubmitBtn         = ".submit"; // css selector.

	Elems             = {
		"Name"      : "string, Please Enter Your Name",
		"Email"     : "email, Please Enter Your Email",
		"Phone"     : "phone, Please Enter a Valid Phone"
	};

	_.swapValuesOnSubmit = {
		"_yodleST" : "x537hd"
	};

_.debug  = off;

//---------------------------------------------------------
// DO NOT MODIFY BELOW THIS LINE //
	_.elems.required  = Elems;
	_.elems.submitBtn = SubmitBtn;
	$(Form).formDefender(_);
}(jQuery,(function() {return {elems:{required:{}}};}()))); 
//----------------------------------------------------------


//Enlarge & Print
$(function() {
	var largeText = $('#enlarge').data("lrgTxtState", "false"),
	printText = $('#print'),
	mainText = $('.main-col .txtarea'),
	myCookie = $.cookie('ltxt');
	
	largeText.on({
		"onFunc" : function() {
			var $this = $(this);
			mainText.css('font-size', '1.3em');
			$this.addClass('on');
			$.cookie('ltxt', 'true');
			$this.data("lrgTxtState", "true");
		},
		"offFunc" : function() {
			var $this = $(this);
			mainText.css('font-size', '1em');
			$this.removeClass('on');
			$.removeCookie('ltxt');
			$this.data("lrgTxtState", "false");
		},
		'click' : function() {
			var $this = $(this);
			if($this.data("lrgTxtState") === "true") {
				$this.trigger("offFunc");
			} else if($this.data("lrgTxtState") === "false") {
				$this.trigger("onFunc");
			}
		}
	});
	
	if(myCookie === 'true') {
		largeText.trigger("onFunc");
	} else {
		largeText.trigger("offFunc");
	}

	printText.click( function() {
		window.print();
	});
});