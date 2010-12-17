YUI.add("cache-base",function(D){var A=D.Lang,B=D.Lang.isDate,C=function(){C.superclass.constructor.apply(this,arguments);};D.mix(C,{NAME:"cache",ATTRS:{max:{value:0,setter:"_setMax"},size:{readOnly:true,getter:"_getSize"},uniqueKeys:{value:false},expires:{value:0,validator:function(E){return D.Lang.isDate(E)||(D.Lang.isNumber(E)&&E>=0);}},entries:{readOnly:true,getter:"_getEntries"}}});D.extend(C,D.Base,{_entries:null,initializer:function(E){this.publish("add",{defaultFn:this._defAddFn});this.publish("flush",{defaultFn:this._defFlushFn});this._entries=[];},destructor:function(){this._entries=[];},_setMax:function(F){var E=this._entries;if(F>0){if(E){while(E.length>F){E.shift();}}}else{F=0;this._entries=[];}return F;},_getSize:function(){return this._entries.length;},_getEntries:function(){return this._entries;},_defAddFn:function(H){var F=this._entries,E=this.get("max"),G=H.entry;if(this.get("uniqueKeys")&&(this.retrieve(H.entry.request))){F.shift();}while(E&&F.length>=E){F.shift();}F[F.length]=G;},_defFlushFn:function(E){this._entries=[];},_isMatch:function(F,E){if(!E.expires||new Date()<E.expires){return(F===E.request);}return false;},add:function(G,F){var E=this.get("expires");if(this.get("initialized")&&((this.get("max")===null)||this.get("max")>0)&&(A.isValue(G)||A.isNull(G)||A.isUndefined(G))){this.fire("add",{entry:{request:G,response:F,cached:new Date(),expires:B(E)?E:(E?new Date(new Date().getTime()+this.get("expires")):null)}});}else{}},flush:function(){this.fire("flush");},retrieve:function(I){var E=this._entries,H=E.length,G=null,F=H-1;if((H>0)&&((this.get("max")===null)||(this.get("max")>0))){this.fire("request",{request:I});for(;F>=0;F--){G=E[F];if(this._isMatch(I,G)){this.fire("retrieve",{entry:G});if(F<H-1){E.splice(F,1);E[E.length]=G;}return G;}}}return null;}});D.Cache=C;},"@VERSION@",{requires:["base"]});YUI.add("cache-offline",function(E){function D(){D.superclass.constructor.apply(this,arguments);}var A=null,C=E.JSON;try{A=E.config.win.localStorage;}catch(B){}E.mix(D,{NAME:"cacheOffline",ATTRS:{sandbox:{value:"default",writeOnce:"initOnly"},expires:{value:86400000},max:{value:null,readOnly:true},uniqueKeys:{value:true,readOnly:true,setter:function(){return true;}}},flushAll:function(){var F=A,G;if(F){if(F.clear){F.clear();}else{for(G in F){if(F.hasOwnProperty(G)){F.removeItem(G);delete F[G];}}}}else{}}});E.extend(D,E.Cache,A?{_setMax:function(F){return null;},_getSize:function(){var H=0,G=0,F=A.length;for(;G<F;++G){if(A.key(G).indexOf(this.get("sandbox"))===0){H++;}}return H;},_getEntries:function(){var F=[],I=0,H=A.length,G=this.get("sandbox");for(;I<H;++I){if(A.key(I).indexOf(G)===0){F[I]=C.parse(A.key(I).substring(G.length));}}return F;},_defAddFn:function(K){var J=K.entry,I=J.request,H=J.cached,F=J.expires;J.cached=H.getTime();J.expires=F?F.getTime():F;try{A.setItem(this.get("sandbox")+C.stringify({"request":I}),C.stringify(J));}catch(G){this.fire("error",{error:G});}},_defFlushFn:function(H){var G,F=A.length-1;for(;F>-1;--F){G=A.key(F);if(G.indexOf(this.get("sandbox"))===0){A.removeItem(G);}}},retrieve:function(I){this.fire("request",{request:I});var H,F,G;try{G=this.get("sandbox")+C.stringify({"request":I});try{H=C.parse(A.getItem(G));}catch(K){}}catch(J){}if(H){H.cached=new Date(H.cached);F=H.expires;F=!F?null:new Date(F);H.expires=F;if(this._isMatch(I,H)){this.fire("retrieve",{entry:H});return H;}}return null;}}:{_setMax:function(F){return null;}});E.CacheOffline=D;},"@VERSION@",{requires:["cache-base","json"]});YUI.add("cache-plugin",function(B){function A(E){var D=E&&E.cache?E.cache:B.Cache,F=B.Base.create("dataSourceCache",D,[B.Plugin.Base]),C=new F(E);F.NS="tmpClass";return C;}B.mix(A,{NS:"cache",NAME:"cachePlugin"});B.namespace("Plugin").Cache=A;},"@VERSION@",{requires:["cache-base"]});YUI.add("cache",function(A){},"@VERSION@",{use:["cache-base","cache-offline","cache-plugin"]});