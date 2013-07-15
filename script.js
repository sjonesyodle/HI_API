Object.create=Object.create?Object.create:function(){var e=function(){};return function(f){e.prototype=f;return new e}}();Object.extend=Object.extend?Object.extend:function(){var e;return function(f,g){for(e in g)f[e]=g[e];return f}}();
(function(e,f,g){var h,k;k=function(){var e={Pub:function(a,c){var d=this;if(!this.topics[a])return!1;setTimeout(function(){for(var b=d.topics[a],e=b?b.length:0;e--;)b[e].func.apply(b[e].funcContext,[c])},0);return!0},Sub:function(a,c,d){var b;this.topics[a]||(this.topics[a]=[]);b=(++this.subUid).toString();this.topics[a].push({token:b,func:c,funcContext:d});return b},unSub:function(a){var c,d,b;for(c in this.topics)if(this.topics[c])for(d=0,b=this.topics[c].length;d<b;d++)if(this.topics[c][d].token===
a)return this.topics[c].splice(d,1),a;return!1}};return function(){var a=Object.create(e);a.subUid=-1;a.topics={};return a}}();h=function(){var e={_destroy:function(){delete this._context.mods[this.uid]},_pubsub:function(){var a=this,c=a._context._PubSub,d=Array.prototype.slice;return{_pub:function(){var b=d.call(arguments);b.push(a);return c.Pub.apply(c,b)},_sub:function(){var b=d.call(arguments);b.push(a);return c.Sub.apply(c,b)},_unsub:function(){var a=d.call(arguments);return c.unSub.apply(c,
a)}}}};return function(a,c,d){var b=Object.create(e);b._context=a;b.uid=d;b.cluster=a.enhancements;Object.extend(b,b._pubsub());return Object.extend(b,c)}}();f=function(){var e={collect:function(a){var c=this._Module,d,b;if(a)if(d=-1,b=a&&a.length?a.length:!1)for(;++d<b;)this.mods[++c.uid]=c.create(this,a[d],c.uid);else return this.mods[++c.uid]=c.create(this,a,c.uid),this},enhance:function(a){"object"===typeof a&&Object.extend(this.enhancements,a)},start:function(){for(var a in this.mods)"init"in
this.mods[a]&&this.mods[a].init();return this}};return function(){var a=Object.create(e);a.mods={};a.enhancements={};Object.extend(a,{_Module:{create:h,uid:-1},_PubSub:k()});return a}}();e.Cluster=f})(window,document);


;(function( $, window, undefined ){

	var HI_LOC_WIDGET = Cluster(), trim = $.trim;


	HI_LOC_WIDGET
	.enhance({

		util : {
			isNode: function (jNode) {
                var node = typeof jNode === "string" ? $(trim(jNode)) : jNode;
                return node && node.length > 0;
            },

            queryStrAsObj: (function () {
	            var match,
	                pl = /\+/g,
	                search = /([^&=]+)=?([^&]*)/g,
	                decode = function (s) {
	                    return decodeURIComponent(s.replace(pl, " "));
	                },
	                query = window.location.search.slice(1),
	                o = {};

	            return function (query) {
	                var res = {},
	                    startPos;

	                query = query || window.location.href;
	                startPos = (query.indexOf("?") + 1);

	                if (startPos > -1) {
	                    query = query.slice(startPos);

	                    while (match = search.exec(query)) {
	                        res[decode(match[1])] = decode(match[2]);
	                    }
	                }

	                return res;
	            };
	        }()),

            createJNodes: function (nodeObj, subObjProp) {
                var prop, curr;

                if (typeof nodeObj !== "object") return false;

                if (subObjProp) subObjProp = trim(subObjProp);

                for (prop in nodeObj) {
                    prop = trim(prop);

                    if (subObjProp && typeof nodeObj[prop] == "object") {

                        if (!nodeObj[prop].hasOwnProperty(subObjProp)) return false;

                        curr = nodeObj[prop][subObjProp] = $(nodeObj[prop][subObjProp]);

                    } else curr = nodeObj[prop] = $(nodeObj[prop]);

                    if (!this.isNode(curr)) return false;
                }

                return true;
            },

            generateView : ( function () {
	            var
	            getStrPos = function ( str, substr ) {
	                var pos = str.indexOf(substr), positions = [];
	                
	                while(pos > -1) {
	                    positions.push(pos);
	                    pos = str.indexOf(substr, pos+1);
	                }
	            
	                return positions;
	            },

	            chars = function(str) {
	              if (str == null) return [];
	              return String(str).split('');
	            },
	            
	            strSplice = function (start, length, word, str) {
	               var arr = chars(str);
	              arr.splice(start, length, word);
	              return arr.join('');  
	            },
	            
	            getVars = function ( template ) {
	                var 
	                varLocs = {},
	                openVar  = "{{",
	                closeVar = "}}";
	            
	                varLocs.startIdxs = getStrPos( template, openVar );
	                varLocs.closeIdxs = getStrPos( template, closeVar );
	                
	                return varLocs;    
	            },
	            
	            getObjVal = function (objStr, data) {
	                var 
	                objStr = objStr.split("."),
	                nextLevel,
	                i = 0, l = objStr.length,
	                value = data;

	                if (!value || $.isEmptyObject(value)) return;

	                while ( i < l ) {
	                    nextLevel = objStr[i];
	                    value = value[ nextLevel ] ? value[ nextLevel ] : false;
	                    if ( !value ) return;
	                    i += 1;
	                }
	                
	                return $.trim( value );
	            },
	            
	            extractVarVals = function (valArr, data) {
	                var
	                i = 0,
	                l = valArr.length;
	                
	                for ( ; i < l; i += 1) {
	                    if ( !(valArr[i].value = getObjVal(valArr[i].objStr , data)) ) return false;
	                }

	                return valArr;
	            },
	            
	            injectVarVals = function ( varList, template ) {
	                var 
	                i = 0,
	                l = varList.length,
	                start, stop, range, valLen, value, adjust = 0;
	                
	                for ( ; i < l ; i += 1 ) {
	                    
	                    value  = $.trim( varList[i].value );
	                    valLen = varList[i].value.length;  
	                    
	                    start = varList[i].range[0];
	                    stop  = varList[i].range[1];    
	                    range = stop - start;
	                    
	                   
	                    if (i > 0) {
	                        start = varList[i].range[0] + adjust;
	                        stop  = varList[i].range[1] + adjust;    
	                        range = stop - start;
	                    }
	                        
	                    template = strSplice( start, range, value , template  );
	                    
	                    adjust += valLen - range;
	                }
	                
	                return template;
	            },
	            
	            getVarValues = function ( template ) {
	                var 
	                varLocs   = getVars( template ),
	                startLocs = varLocs.startIdxs,
	                endLocs   = varLocs.closeIdxs,
	                
	                len_sl = startLocs.length,
	                len_el = endLocs.length,
	                i, pos1, pos2, range,
	                
	                varList = [], varItem;
	            
	                
	                if (len_sl !== len_el) return false; // un-even var braces!
	                
	                i = 0;
	                for ( ; i < len_sl; i += 1 ) {
	                    pos1  = startLocs[i];
	                    pos2  = endLocs[i];
	                    
	                    varList.push({
	                        range  : [pos1, pos2 + 2],
	                        objStr : $.trim( template.slice(pos1 + 2, pos2) ) 
	                    });
	                    
	                }
	                
	                return varList;
	            };
	            
	            return function ( template, data ) {
	                var
	                varList = getVarValues( template );

	                if (!extractVarVals( varList, data )) return false;

	                return injectVarVals( varList, template );
	            };
	            
	        }()),

            utcNum: function () {
                var uts = new Date().getTime().toString();
                return uts.slice(uts.length - 9, uts.length - 1);
            },

            validate : (function(){
                var lib = {
                    zip : /^\d{5}([\-]\d{4})?$/,
                    postal : /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/
                };

                return function ( val, regex ) {
                	regex = trim( regex );
               		return regex in lib ? lib[regex].test(val) : false;
                };
            }())
		},

		CHECKPOINT : {

			required : {

				locationData : {
					complete : false,
					data     : {},
					error    : "Please select a location from 'tab 1'"
				},

				userData : {
					complete : false,
					data     : {}
				}	
			},

			check : function () {
				// loop through required
			}

		}

	});


	HI_LOC_WIDGET
	.collect([
		
		// ::::::: U(I/X) MODULES :::::::

		//--------------------------
		{// : Build Tabs :

			rootNode : "#HI_Location_Widget",

			cfg : {
				tabs         : ".tab",
				tabTitle     : "title",
				tabBtnRoot   : "tabBtns",
				activeClass  : "active",

				startTab : 0
			},
				
			init : function () {
				this.util = this.cluster.util;

				if ( !this.util.isNode( this.rootNode ) ) return;

				this.assemble();
				this._destroy();
			},

			assemble : function () {
				this.assembling = true;

				this.buildTabs();

				this.createTabBtns();

				this.bindings();
			},

			buildTabs : function () {
				var 
				cfg  = this.cfg,
				tabs = [];

				cfg.tabs = $(cfg.tabs);

				if ( !this.util.isNode( cfg.tabs ) ) {
					this.assembling = false;
					return;
				}

				cfg.tabs.each(function(){
					var $this = $(this);

					tabs.push({
						node  : $this,
						title : trim( $this.data( cfg.tabTitle ) )
					});

				});

				cfg.tabs = tabs;

				cfg.tabs[ cfg.startTab ].node
				.css("display", "block").addClass( cfg.activeClass );

			},

			createTabBtns : function () {
				var 
				cfg      = this.cfg, 
				tabs     = cfg.tabs, i, l,
				listFrag = $("<ul />"), titles = "";

				if ( !this.assembling) return;

				i = 0;
				l = tabs.length;
				for ( ; i < l; i += 1 ) {
					titles += "<li>" + tabs[i].title + "</li>";
				}

				listFrag
				.addClass( cfg.tabBtnRoot ).html( titles )
				.prependTo( this.rootNode );

				cfg.tabBtnRoot = $( "." + cfg.tabBtnRoot );

				this.tabsBtns = cfg.tabBtnRoot.find("li");
				this.tabsBtns.eq( cfg.startTab ).addClass( cfg.activeClass );
			},

			bindings : function () {
				var 
				that   = this,
				cfg    = this.cfg,
				active = cfg.activeClass,
				tabs   = cfg.tabs;

				this.cfg.tabBtnRoot.on("click", "li", function(){	
					var
					$this = $( this ),
					$this_idx, currActiveBtn, currActive_idx;

					if ( $this.hasClass( active ) ) return;

					$this_idx  = $this.index();

					currActiveBtn  = $this.parent().find( "." + active );
					currActive_idx = currActiveBtn.index();

					$this.addClass( active );
					currActiveBtn.removeClass( active );

					tabs[ currActive_idx ].node.hide();
					tabs[ $this_idx ].node.show();

				});
			}
		},
		//--------------------------


		//--------------------------
		{// : Location Selection (live) :

			nodes : {
				userLocSelection : ".userLocSelection"
			},

			cfg : {
				locSelectHandle : ".HI_Location"
			},

			tmpl : [
				"<div>",
					"<h2>Selected Location:</h2>",
					"{{html}}",
				"</div>"
			].join(""),

			init : function () {
				var that = this;

				if ( !this.cluster.util.createJNodes( this.nodes ) ) return;

				this.checkpoint = this.cluster.CHECKPOINT.required.locationData;

				this._sub("active_selection", function( data ){
					that.activeData = data;
					that.updateCheckPoint();
					that.renderSelection();
				});
			},	

			updateCheckPoint : function () {
				this.checkpoint.complete = true;
				this.checkpoint.data = this.activeData;
			},

			renderSelection : function () {
				var
				html = this.cluster.util.generateView( this.tmpl, { html :  this.activeData.html } );

				html = $( html );

				html.find( this.cfg.locSelectHandle ).hide();

				this.nodes.userLocSelection.html( html );
			}

		},
		//--------------------------


		//--------------------------
		{// : Color-Box Modal for displaying query results with user events:

			nodes : {
				displayLoc : ".userLocation"
			},

			cfg : {
				locClassKey : "loc_class",
				locClass    : "HI_Location",
				franchiseNumKey : "franchisenumkey",
				recordLookupKey : "record"
			},

			tmpl : [
				"<div style='background:#666;padding:10px;margin: 10px auto'>",
					"<span>{{franchiseName}}</span> <br />",
					"<span>{{address1}}</span> <br />",
					"<span>{{city}}, {{state}} {{zip}}</span> <br />",
					"<span>{{phone}}</span> <br />",
					"<span style='width:40px; height20px; background:green; cursor:pointer;' data-{{record}}={{recordIdx}} data-{{franchisenumkey}}='{{franchiseNum}}' class='{{loc_class}}'>Select This Location</span>",
				"</div>"
			].join(""),

			init : function () {
				var that = this;

				this.bind();

				this._sub("location_results_updated", function( data ){

					that.activeData = data;
					that.activeHMTL	= "";

					that.build();
					that.show();
				});
			},

			bind : function () {
				var that = this;

				$("body").on("click", "."+this.cfg.locClass, function(){
					var 
					record = that.activeData[ parseInt( $( this ).data( that.cfg.recordLookupKey ), 10 ) ];

					that.selectLocation( record );
					
				});
			},

			build : function () {
				var
				cfg         = this.cfg,
				data        = this.activeData,
				locClassKey = cfg.locClassKey,
				locClass    = cfg.locClass,
				franchiseKey = cfg.franchiseNumKey,
				recordLookupKey = cfg.recordLookupKey,
				html        = "", i, l, 
				createView  = this.cluster.util.generateView, tmpl = this.tmpl;

				i = 0;
				l = data.length;
				for ( ; i < l; i += 1 ) {

					data[i][locClassKey]     = locClass;
					data[i][franchiseKey]    = franchiseKey;
					data[i][recordLookupKey] = recordLookupKey;
					data[i]["recordIdx"]     = i.toString();
					data[i].html             = createView( tmpl, data[i] );

					html += data[i].html;
				}

				this.activeHTML = html;
			},

			show : function () {
				$.colorbox({
					html : this.activeHTML 
				})
			},

			selectLocation : function ( record ) {
				this.activeSelection = record;
				this._pub("active_selection", record);
				$.colorbox.close();
			}	

		},
		//--------------------------


		//--------------------------
		{// : Form Defender Config :

			elems : {
				"firstname"   : "string, Enter Your First Name",
				"lastname"    : "string, Enter Your Last Night",
				"phonenumber" : "phone, Invalid Phone #",
				"email"       : "email, Invalid Email"
			},

			submitBtn : ".sendInquiry",

			form : $(".HI_userData"),

			init : function () {
				var that = this;

				this.form
				.formDefender({
					elems : {
						required  : this.elems,
						submitBtn : this.submitBtn
					},

					debug        : true,
					alertMsg     : false,
					placeHolders : false,
					submitAction : "/nowhere",
					errorCSS     : ".error",
					successCSS   : ".success",

					beforeSubmit : [
						function ( form ) {
							var 
							data = that.cluster.util.queryStrAsObj( form.serialize() );

							data["emailsignup"] = data["emailsignup"] ? "true" : "false";

							that.payLoadRequest({
								userData : data
							});

							return false;
						}
					]

				});	
			},

			payLoadRequest : function ( userData ) {
				var checkpoint = this.cluster.CHECKPOINT.required.userData;

				checkpoint.data     = userData;
				checkpoint.complete = true;

				this._pub("Final_Payload_Request"); // send to mediator
			}

		},
		//--------------------------


		// ::::::: API MODULES :::::::

		//--------------------------
		{ // : Query HI API with Location Data

			state : {
				activeSearch : null,
				negativeMsg  : false 
			},

			cfg : {
				searchKey      : "{{query}}",
				api_controller : "http://qa.svc.homeinstead.com/search/FranchiseLocator/{{query}}/jsonp?callback=?"
			},

			nodes : {
				searchInput : ".HI_search",
				searchBtn : ".HI_doSearch"
			},

			msgs : {
				searchTypeError : "Invalid Search",
				noYieldMsg      : "No locations found"
			},

			init : function () {
				this.util = this.cluster.util;

				if ( !this.util.createJNodes( this.nodes ) ) return;

				this.bind();
			},

			bind : function () {
				var that = this, i, bindings, nodes = this.nodes;

				bindings = {

					searchInput : function () {
						var $this = this;
						this.on({

							focus : function () {
								if ( that.state.negativeMsg ) {
									$this.val("");
									that.updateNegativeMsg( false );
								}
							}

						})
					},

					searchBtn : function () {
						this.on({
							click : function ( e ) {
								that.state.activeSearch = trim( nodes.searchInput.val() );
								( that.validateQuery() && that.queryAPI() );
								e.preventDefault();
							}
						});
					}

				};

				for ( i in bindings ) {
					if ( i in this.nodes ) {
						bindings[i].call( this.nodes[i] );
					}
				}

			},

			validateQuery : function () {
				var
				that     = this, 
				q        = this.state.activeSearch, 
				validate = this.util.validate,
				test     = ( validate( q, "zip" ) || validate( q, "postal" ) );

				if ( !test ) {
					setTimeout(function(){
						that.searchError();
					}, 0);	
				}

				return test;
			},

			queryAPI : function () {
				var
				that = this, 
				q = this.cfg.api_controller.replace( this.cfg.searchKey, this.state.activeSearch );
				$.getJSON( q, function( data ){
					that.parseResponse( data );
				});
			},

			parseResponse : function ( response ) {

				if ( !( response && response.length > 0 ) ) {
					this.noYield();
					return;
				}

				this._pub("location_results_updated", response);
			},

			searchError : function () {
				this.nodes.searchInput.val( this.msgs.searchTypeError );
				this.updateNegativeMsg( true );
			},

			noYield : function () {
				this.nodes.searchInput.val( this.msgs.noYieldMsg );
				this.updateNegativeMsg( true );
			},

			updateNegativeMsg : function ( bool ) {
				this.state.negativeMsg = bool || false;
			}
			
		},
		//--------------------------

		//--------------------------
		{//: Payload Validation Mediator :

			init : function () {
				var that = this;

				this._sub("Final_Payload_Request", function (){

				});
			},

			validate : function () {

			},

			success : function () {

			},

			failure : function () {

			}

		},
		//--------------------------

		//--------------------------
		{// : Transmit Final (Validated) Payload 

			cfg : {

			},

			init : function () {
				var that = this;

				// this._sub("")

			},

			transmitPayload : function () {

			},

			complete : function () {

			}

		}
		//--------------------------

	]);

	HI_LOC_WIDGET.start();

}( jQuery, window ));

