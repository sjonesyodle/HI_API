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

			getCookie: function (name) {
	            var cookie = document.cookie,
	                cookStart = cookie.indexOf(" " + name + "="),
	                cookEnd;
	            if (cookStart === -1) {
	                cookStart = cookie.indexOf(name + "=");
	            }
	            if (cookStart === -1) {
	                cookie = null;
	            } else {
	                cookStart = cookie.indexOf("=", cookStart) + 1;
	                cookEnd = cookie.indexOf(";", cookStart);
	                if (cookEnd === -1) {
	                    cookEnd = cookie.length;
	                }
	                cookie = unescape(cookie.substring(cookStart, cookEnd));
	            }
	            return cookie;
	        },

			isNode: function (jNode) {
                var node = typeof jNode === "string" ? $(trim(jNode)) : jNode;
                return node && node.length > 0;
            },

            obj2QueryStr : function (obj) {
				var p, res = "";

				if ($.isEmptyObject(obj)) return "";

				for (p in obj) {

					if (!obj.hasOwnProperty(p)) continue;
						res += $.trim(p)+"="+escape( $.trim(obj[p]) )+"&";
					}

				return res.slice(0, -1);
			},

			hasClassInCol : function ( collection, klass ) { // return node in a collection with the selected class
				var node = $();
				if ( !this.isNode(collection) ) return node;
				collection.each(function(){
					var $this = $(this)
					if ( $this.hasClass(klass) ) {
						node = $this;
						return false;
					} 
				});

				return node;
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

        	transmitPayLoad: (function () {
                var head = $("head");

                return function (transmitter, rootNode) {

                    if (!rootNode) {
                        head.append(trim(transmitter));
                    } else {
                        $(rootNode).append(trim(transmitter));
                    }

                };
            }()),

            buildTransmitter: function (o) {
                var
                id = 'id="' + (o["id"] || "") + '"',
                    klass = 'class="' + (o["class"] || "") + '"',
                    src = 'src="' + (o["src"] || "") + '"',
                    attrs = id + " " + klass + " " + src + " ";

                if (o["type"] === "script") {
                    return "<script type='text/javascript' " + attrs + " ></script>";
                }

                if (o["type"] === "img") {
                    return "<img width='1' height='1' border='0' " + attrs + " />";
                }

                return false;
            },

            add_QS_Params: function (qStr, param) {
                var i, len, trim = $.trim,
                    addParam;

                addParam = function (param) {
                    if (typeof param === "string") {
                        return qStr.replace("?", "?" + param + "&");
                    }

                    if (typeof param === "object") {
                        return qStr.replace("?", "?" + param.key + "=" + param.val + "&");
                    }
                };

                qStr = trim(qStr);
                if (qStr.indexOf("?") < 0) qStr += "?";


                if (typeof param === "string" && param.length > 0) qStr = addParam(trim(param));
                else if ($.isArray(param)) {
                    i = 0;
                    len = param.length;

                    for (; i < len; i += 1) {
                        qStr = addParam(trim(param[i]));
                    }
                } else if (typeof param === "object") {
                    for (i in param) {
                        qStr = addParam({
                            key: trim(i),
                            val: trim(param[i])
                        });
                    }
                }

                len = qStr.length;
                return qStr[len - 1] === "&" ? qStr.slice(0, len - 1) : qStr;
            },

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
				scrollTo     : "HI_Widget_ScrollTo",
				startTab     : 0
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
				.prependTo( this.rootNode )
				.before("<div class='"+ this.cfg.scrollTo +"' data-scrollto='."+ this.cfg.scrollTo +"' />");

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

					$this.addClass( active );-
					currActiveBtn.removeClass( active );

					tabs[ currActive_idx ].node.hide();
					tabs[ $this_idx ].node.show();

				});
			}
		},
		//--------------------------


		//--------------------------
		{// : Tab State :

			cfg : {
				onLoadTabLockIndxs : [ 1 ]
			},

			nodes : {
				tabs    : ".tabBtns li"
			},

			tabLinks : {
				prev : ".prevTab"
			},

			init : function () {
				var 
				that = this,
				util = this.cluster.util;

				if ( !util.createJNodes( this.nodes ) ) return;

				if ( !util.createJNodes( this.tabLinks ) ) return;

				this.onLoadState();

				this.bindTabLinks();

				this._sub("unlock_all_tabs", this.unlockAll);
				this._sub("changeTab", function( tabIdx ){
					that.changeTab( tabIdx );
				});
			},

			onLoadState : function () {
				var
				that  = this, 
				nodes = this.nodes.tabs;

				//lock desired tabs on load
				(function(){
					var 
					i, l, 
					cfg = that.cfg,
					locks = cfg.onLoadTabLockIndxs;

					i = 0;
					l = locks.length;
					for ( ; i < l; i++ ) {
						that.lock( nodes.eq( locks[i] ) );
					}

				}());
			},

			bindTabLinks : function () {
				var
				that = this,
				util = this.cluster.util,

				activeTab = function () {
					return util.hasClassInCol( that.nodes.tabs, "active");
				},

				tabLinks = {

					prev : function () {
						$(this).on("click", function ( e ) {
							that.changeTab( parseInt( (activeTab().index() - 1), 10 ) );
							e.preventDefault();
						});
					},

					next : function () {

						$(this).on("click", function ( e ) {
							that.changeTab( parseInt( (activeTab().index() + 1), 10 ) );
							e.preventDefault();
						});
					}

				}, i;

				for ( i in tabLinks ) {
					if ( i in this.tabLinks ) {
						tabLinks[i].call( this.tabLinks[i] );
					}
				}

			},

			lock : function ( node ) {
				node.on("click", function( e ){
					e.stopImmediatePropagation();
					e.preventDefault();
				});
			},

			unlockAll : function () {
				this.nodes.tabs.each(function(){
					$(this).off("click");
				});
			},

			changeTab : function ( tabIdx ) {
				this.nodes.tabs.eq( tabIdx ).trigger("click");
			}

		},
		//--------------------------


		//--------------------------
		{// : Scroll To :
			cfg : {
			    dataProp : "scrollto",
			    v_offset : 40,
			    speed    : 360
		    },

			init : function () {
		        if ( !this.cfg.dataProp ) return;

		        this.coordsCollection = [];
		        this.htmlbody = $("html, body");
		        this.build();
		    },

		    build : function () {
		        var 
		        that = this,
		        dataProp = trim( that.cfg.dataProp ),
		        links = $("[data-"+ dataProp +"]"),

		        voffset = that.cfg.v_offset,

		        i, len;

		        if ( !this.cluster.util.isNode( links ) ) return;

		        links
		        .each(function(){
		            $this   = $( this ),
		            relElem = $( $this.data( dataProp ) );

		            if ( !that.cluster.util.isNode( relElem ) ) return true;

		            that.coordsCollection.push({
		                node  : $this,
		                coord : ( relElem.offset().top - voffset )
		            });
		        });

		        i   = 0;
		        len = that.coordsCollection.length;

		        for ( ; i < len; i += 1 ) {
		            that.bind( that.coordsCollection[i].node, that.coordsCollection[i].coord, that.htmlbody );
		        }
		    },

		    bind : function ( elemNode, coord, bodyNode ) {
		        var that = this,
		            speed = that.cfg.speed;

		        elemNode.on("click", function ( e ) {
		            bodyNode.animate({ scrollTop : coord }, speed);
		            e.preventDefault();
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
					that.complete();
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
			},

			complete : function () {
				this._pub("unlock_all_tabs");
				this._pub("changeTab", 1);
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
				recordLookupKey : "record",
				scrollTo : ".HI_Widget_ScrollTo"
			},

			tmpl : [
				"<div class='wrap'><div class='location'><span data-{{record}}={{recordIdx}} data-{{franchisenumkey}}='{{franchiseNum}}' class='{{loc_class}}'>",
					"<h3>{{franchiseName}}</h3>",
					"<p><span>{{address1}}</span> <br />",
					"<span>{{city}}, {{state}} {{zip}}</span> <br />",
					"<p><span class='select'>Select This Location</span></p>",
				"</span></div></div>"
			].join(""),

			init : function () {
				var that = this;

				this.bind();

				this.checkpoint = this.cluster.CHECKPOINT.required.locationData;

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
				});

				// console.log($.colorbox().element());
			},

			selectLocation : function ( record ) {
				var scrollto = $( this.cfg.scrollTo );

				this.activeSelection = record;
				this._pub("active_selection", record);

				( this.cluster.util.isNode(scrollto) && scrollto.trigger("click") );

				$.colorbox.close();
			}	

		},
		//--------------------------


		//--------------------------
		{// : Form Defender Config :

			elems : {
				"firstname"    : "string, Enter Your First Name",
				"lastname"     : "string, Enter Your Last Night",
				"phonenumber"  : "phone, Invalid Phone #",
				"email"        : "email, Invalid Email",
				"startservice" : "dropdown"
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

					debug        : false,
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
				api_controller : "http://qa.svc.homeinstead.com/search/FranchiseLocator/{{query}}/jsonp?callback=?",
				errClass  : "error",
				loadClass : "HI_Loading",
				loadImg   : "images/loader.gif",
				timeOutMsg : "Sorry, your request has timed out. Please search again."
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
									$this.val("").removeClass( that.cfg.errClass );
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

			indicateLoad : function ( bool ) {
				( !!bool ? $.colorbox() : $.colorbox.close() );
			},

			queryAPI : function () {
				var
				that = this, 
				q = this.cfg.api_controller.replace( this.cfg.searchKey, this.state.activeSearch ),
				hn;

				this.loaded = false;
				this.indicateLoad( true );

				$.getJSON( q, function( data ){
					that.parseResponse( data );
				});	

				hn = setTimeout(function(){
					clearTimeout( hn );
					if ( !that.loaded ) that.timeOutMsg();
				}, 5000);

			},

			parseResponse : function ( response ) {

				if ( !( response && response.length > 0 ) ) {
					this.noYield();
					return;
				}

				this.loaded = true;
				this._pub("location_results_updated", response);
			},

			searchError : function () {
				this.nodes.searchInput.val( this.msgs.searchTypeError ).addClass(this.cfg.errClass);
				this.updateNegativeMsg( true );
			},

			noYield : function () {
				this.nodes.searchInput.val( this.msgs.noYieldMsg );
				this.updateNegativeMsg( true );
			},

			timeOutMsg : function () {
				$.colorbox({ html: "<p>"+ this.cfg.timeOutMsg +"</p>"});
			},

			updateNegativeMsg : function ( bool ) {
				this.state.negativeMsg = bool || false;
			}
			
		},
		//--------------------------


		//--------------------------
		{//: Payload Validation Mediator :

			tmpl : {

				error : [
					"<div>{{error}}</div>"
				].join("")

			},

			init : function () {
				var that = this;

				this.checkpoint = this.cluster.CHECKPOINT.required;


				this._sub("Final_Payload_Request", function (){
					that.validate();
				});
			},

			validate : function () {
				var i, msgs = "";

				for ( i in this.checkpoint ) {
					if ( !this.checkpoint[i].complete ) {
						( this.checkpoint[i].error && (msgs += this.checkpoint[i].error) );
					}
				}

				if ( msgs.length > 0 ) this.failure( msgs );
				else this.success();
			},

			success : function () {
				this._pub("Final_Payload_Request_VALID");
			},

			failure : function ( msgs ) {
				var msg = this.cluster.util.generateView( this.tmpl.error, { error : msgs })
				$.colorbox({ html : msg });
			}

		},
		//--------------------------


		//--------------------------
		{// : Transmit Final (Validated) Payload 

			cfg : {
				franchiseNumKey : "{{franchisenumber}}",
				wakeUpURI   : "http://qa.svc.homeinstead.com/ServiceInquiry/KeepAlive/{{franchisenumber}}/",
				serviceURI  : "http://qa.svc.homeinstead.com/api/ServiceInquiry/1/"
			},

			package : {
                "inquiry": "null",
                "FranchiseNumber": { alias : "franchiseNum" },
                "ContactFirstName": { alias : "firstname" },
                "ContactLastName": { alias : "lastname" },
                "ContactPhone": { alias : "phonenumber" },
                "ContactPhoneType": "",
                "ContactBestTimeToCall": "",
                "ContactEmail": { alias : "email" },
                "ContactRelationshipWithClient": "",
                "ClientFirstName": "",
                "ClientLastName": "",
                "ClientAddress": "",
                "ClientCity": "",
                "ClientState": "",
                "ClientZip": "",
                "ClientCondition": "",
                "ClientStartService": "",
                "HearAboutUs": "Web",
                "HearAboutUsOther": "Service Inquiry Web Service",
                "MailInformation": { alias : "emailsignup" },
                "MailInfoFirstName": "",
                "MailInfoLastName": "",
                "MailInfoAddress1": "",
                "MailInfoAddress2": "",
                "MailInfoCity": "",
                "MailInfoState": "",
                "MailInfoZip": "",
                "SendAutoEmail": "true",
                "SourceURL": location.protocol + "//" + location.host + location.pathname
			},

			init : function () {
				var 
				that         = this,
				checkpoint   = that.cluster.CHECKPOINT.required;

				this._sub("Final_Payload_Request_VALID", function (){
					that.userData      = checkpoint.userData.data.userData;
					that.locationData  = checkpoint.userData.data;

					that.prepare();

					that.wakeUpService();

					$.when( that.transmitPayload ).then(function(){
						that.complete();
					});
				});
			},

			prepare : function () {
				var
				package = this.package,
				merge   = [ this.userData, this.locationData ],
				i, p, l, payLoad = {};

				i = 0;
				l = merge.length;
				for ( ; i < l; i += 1 ) {
					for ( p in package ) {
						if ( !!package[p] && (typeof package[p] === "object") && ("alias" in package[p]) ) {
							if ( package[p].alias in merge[i] ) {
								payLoad[p] = merge[i][package[p].alias];
							}
						}
						else payLoad[p] = package[p];
					}
				}

				this.package = payLoad;
			},

			wakeUpService : function () {
				var wakeUpURI = this.cfg.wakeUpURI.replace( this.cfg.franchiseNumKey, trim(this.locationData.franchiseNum));
				$.getJSON( trim( wakeUpURI ), function ( data ) { /*void*/ });
			},

			transmitPayload : function () {
				return $.ajax({
					url      : "http://qa.svc.homeinstead.com/api/ServiceInquiry/1/?callback=?",
					type     : 'GET',
					dataType : 'jsonp',
					jsonp    : "somecallback"
				});
			},

			complete : function () {
				this._pub("track_lead", this.package);			
			}

		},
		//--------------------------


		//--------------------------
		{ // : Internal Tracking :

			cfg : {
				redirectURI   : "contact_success.html",
				leadEmailAddr : "serviceInquiry_{{timestamp}}@homeinstead.com",
				postDest      : "ajax.capture.weblead",
				osCookieName  : "yodle.os.attrib",
				leadSessionAttr : { "unpaid" : "" }
			},

			init : function () {
				var that = this;

				this.util = this.cluster.util;

				this._sub("track_lead", function ( package ){
					if ( typeof package !== "object" ) return;

					that.package = package;
					that.track();
				});
			},

			track : function () {
				var that = this;

				this.sessionState();
				this.buildPayload();
				this.transmit(function(){
					that.complete();
				});
			},

			sessionState : function () {
				var osCookie = this.util.getCookie( this.cfg.osCookieNames );
				this.cfg.leadSessionAttr.unpaid = ( osCookie && osCookie === "paid" ) ? "false" : "true";
			},
			
			buildPayload : function () {
				$.extend( this.package, { email : this.cfg.leadEmailAddr.replace("{{timestamp}}", this.util.utcNum()) }, this.cfg.leadSessionAttr);
			},

			transmit : function ( cb ) {
				var that = this;
				
				$.ajax({
					url  : this.cfg.postDest,
					type : "POST",
					data : this.package,
					success : function ( res ) {
						( !!res && typeof cb === "function" && cb() ); 
					}
				});
			},

			complete : function () {
				this.redirect();
			},

			redirect : function () {
				( !!this.cfg.redirectURI && (window.location = this.cfg.redirectURI) );
			}
		}
		//--------------------------



	]);

	HI_LOC_WIDGET.start();


	//error

}( jQuery, window ));

