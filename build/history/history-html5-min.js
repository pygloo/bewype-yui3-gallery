YUI.add("history-html5",function(a){var c=a.HistoryBase,j=a.config.doc,g=a.config.win,i,l=a.config.useHistoryHTML5,k=a.JSON||g.JSON,e="enableSessionFallback",b="YUI_HistoryHTML5_state",d="popstate",f=c.SRC_REPLACE;function h(){h.superclass.constructor.apply(this,arguments);}a.extend(h,c,{_init:function(m){a.on("popstate",this._onPopState,g,this);h.superclass._init.apply(this,arguments);if(m&&m[e]&&YUI.Env.windowLoaded){try{i=g.sessionStorage;}catch(n){}this._loadSessionState();}},_getSessionKey:function(){return b+"_"+g.location.pathname;},_loadSessionState:function(){var m=k&&i&&i[this._getSessionKey()];if(m){try{this._resolveChanges(d,k.parse(m)||null);}catch(n){}}},_storeSessionState:function(m){if(this._config[e]&&k&&i){i[this._getSessionKey()]=k.stringify(m||null);}},_storeState:function(o,n,m){if(o!==d){g.history[o===f?"replaceState":"pushState"](n,m.title||j.title||"",m.url||null);}this._storeSessionState(n);h.superclass._storeState.apply(this,arguments);},_onPopState:function(n){var m=n._event.state;this._storeSessionState(m);this._resolveChanges(d,m||null);}},{NAME:"historyhtml5",SRC_POPSTATE:d});if(!a.Node.DOM_EVENTS.popstate){a.Node.DOM_EVENTS.popstate=1;}a.HistoryHTML5=h;if(l===true||(l!==false&&c.html5)){a.History=h;}},"@VERSION@",{optional:["json"],requires:["event-base","history-base","node-base"]});