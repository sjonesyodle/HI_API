;(function($){
	var zipForm   = $("form#zip-search"),

		zipField  = zipForm.find("input#textfield")
						.data("error","Invalid Zip Code").val(""),

		state     = zipForm.find("select.state").val(""),

		submitBtn = zipForm.find("input.submit-btn"),

		checkZip  = function (zip) {
             var zip = zip.replace(/\s+/g, ""),
                 re = /^\d{5}([\-]\d{4})?$/;
             if (zip.match(re)) return true;
             return false;
        },

        checkDrop =  function (val) {
            return (val !== "" && val.length > 0) ? true : false;
        },

        checkElems = {
        	zip : {
        		elem : zipField,
        		func : checkZip,
                txt  : "criteria=",
                _val : "",
                name : "Zip Code"
        	},

        	state : {
        		elem : state,
        		func : checkDrop,
                txt  : "state=",
                _val : "",
                _name : "State"
        	}
        }, 
        res,

        errorElems = [ ];


        submitBtn.on({
        	click : function (e) {
        		var prop, value, i = 0, currVal;

                res = ""; //reset

        		for (prop in checkElems) {

                    currVal = $.trim( (checkElems[prop].elem).val() );
                    checkElems[prop]._val = ""; //reset

        			if ( checkElems[prop].func( currVal )) { //pass
                        checkElems[prop]._val = checkElems[prop].txt + currVal + "&"; //ovewrite any prev value.
        			}
        		}

                for (prop in checkElems) {
                    if ( checkElems[prop]._val !== "" ) res += checkElems[prop]._val;
                    else errorElems.push(checkElems[prop]._name);
                }


                if (errorElems.length === 2) {
                    alert("Please Enter Either A Zip Code, State, Or Combination Of Both");
                    return false;
                }


                $(this).trigger("sendData", res);

	        	e.preventDefault();
        	},

        	sendData : function (e, data) {

                if (data !== "") {
            		zipForm
            		.attr("action", "http://www.homeinstead.com/findhomecare/Pages/Office-Locator.aspx?"+data+"SearchType=Territory")
            		.trigger("submit");
                }
                else {
                    alert("Please Enter Either A Zip Code, State, Or Combination Of Both");
                } 
        	}
    	});

    	zipField.on({
    		focus : function () {
    			var $this = $(this),
    				val   = $.trim( $this.val() );

    			if (val === $this.data("error")) $this.val("");
    			return false;
    		},

    		blur : function () {
    			var $this = $(this),
    				val   = $.trim( $this.val() );

    			if ( !checkZip(val) && val !== "") $this.val($this.css("color", "red").data("error"));
    			else $this.css("color", "black");

    			return false;
    		}
    	});

    	state.on("change", function () {
    		var $this = $(this),
    			val   = $.trim( $this.val() );

			if ( !checkDrop(val)) $this.css("color", "red");
			else $this.css("color", "black");
			return false;
    	});


        

}(jQuery));
