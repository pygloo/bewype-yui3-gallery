var GLOBAL_ENV=YUI.Env;if(!GLOBAL_ENV._ready){GLOBAL_ENV._ready=function(){GLOBAL_ENV.DOMReady=true;GLOBAL_ENV.remove(YUI.config.doc,"DOMContentLoaded",GLOBAL_ENV._ready);};GLOBAL_ENV.add(YUI.config.doc,"DOMContentLoaded",GLOBAL_ENV._ready);}YUI.add("event-base",function(E){E.publish("domready",{fireOnce:true,async:true});if(GLOBAL_ENV.DOMReady){E.fire("domready");}else{E.Do.before(function(){E.fire("domready");},YUI.Env,"_ready");}var B=E.UA,D={},A={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9,63272:46,63273:36,63275:35},C=function(H){if(!H){return H;}try{if(H&&3==H.nodeType){H=H.parentNode;}}catch(G){return null;}return E.one(H);},F=function(G,H,I){this._event=G;this._currentTarget=H;this._wrapper=I||D;this.init();};E.extend(F,Object,{init:function(){var I=this._event,J=this._wrapper.overrides,G=I.pageX,L=I.pageY,K,H=this._currentTarget;this.altKey=I.altKey;this.ctrlKey=I.ctrlKey;this.metaKey=I.metaKey;this.shiftKey=I.shiftKey;this.type=(J&&J.type)||I.type;this.clientX=I.clientX;this.clientY=I.clientY;this.pageX=G;this.pageY=L;K=I.keyCode||I.charCode||0;if(B.webkit&&(K in A)){K=A[K];}this.keyCode=K;this.charCode=K;this.button=I.which||I.button;this.which=this.button;this.target=C(I.target);this.currentTarget=C(H);this.relatedTarget=C(I.relatedTarget);if(I.type=="mousewheel"||I.type=="DOMMouseScroll"){this.wheelDelta=(I.detail)?(I.detail*-1):Math.round(I.wheelDelta/80)||((I.wheelDelta<0)?-1:1);}if(this._touch){this._touch(I,H,this._wrapper);}},stopPropagation:function(){this._event.stopPropagation();this._wrapper.stopped=1;this.stopped=1;},stopImmediatePropagation:function(){var G=this._event;if(G.stopImmediatePropagation){G.stopImmediatePropagation();}else{this.stopPropagation();}this._wrapper.stopped=2;this.stopped=2;},preventDefault:function(G){var H=this._event;H.preventDefault();H.returnValue=G||false;this._wrapper.prevented=1;this.prevented=1;},halt:function(G){if(G){this.stopImmediatePropagation();}else{this.stopPropagation();}this.preventDefault();}});F.resolve=C;E.DOM2EventFacade=F;E.DOMEventFacade=F;(function(){E.Env.evt.dom_wrappers={};E.Env.evt.dom_map={};var O=E.Env.evt,H=E.config,L=H.win,Q=YUI.Env.add,J=YUI.Env.remove,N=function(){YUI.Env.windowLoaded=true;E.Event._load();J(L,"load",N);},G=function(){E.Event._unload();},I="domready",K="~yui|2|compat~",M=function(S){try{return(S&&typeof S!=="string"&&E.Lang.isNumber(S.length)&&!S.tagName&&!S.alert);}catch(R){return false;}},P=function(){var T=false,U=0,S=[],V=O.dom_wrappers,R=null,W=O.dom_map;return{POLL_RETRYS:1000,POLL_INTERVAL:40,lastError:null,_interval:null,_dri:null,DOMReady:false,startInterval:function(){if(!P._interval){P._interval=setInterval(P._poll,P.POLL_INTERVAL);}},onAvailable:function(X,c,g,Y,d,f){var e=E.Array(X),Z,b;for(Z=0;Z<e.length;Z=Z+1){S.push({id:e[Z],fn:c,obj:g,override:Y,checkReady:d,compat:f});}U=this.POLL_RETRYS;setTimeout(P._poll,0);b=new E.EventHandle({_delete:function(){if(b.handle){b.handle.detach();return;}var h,a;for(h=0;h<e.length;h++){for(a=0;a<S.length;a++){if(e[h]===S[a].id){S.splice(a,1);}}}}});return b;},onContentReady:function(b,Z,a,Y,X){return P.onAvailable(b,Z,a,Y,true,X);},attach:function(a,Z,Y,X){return P._attach(E.Array(arguments,0,true));},_createWrapper:function(d,c,X,Y,b){var a,e=E.stamp(d),Z="event:"+e+c;if(false===b){Z+="native";}if(X){Z+="capture";}a=V[Z];if(!a){a=E.publish(Z,{silent:true,bubbles:false,contextFn:function(){if(Y){return a.el;}else{a.nodeRef=a.nodeRef||E.one(a.el);return a.nodeRef;}}});a.overrides={};a.el=d;a.key=Z;a.domkey=e;a.type=c;a.fn=function(f){a.fire(P.getEvent(f,d,(Y||(false===b))));};a.capture=X;if(d==L&&c=="load"){a.fireOnce=true;R=Z;}V[Z]=a;W[e]=W[e]||{};W[e][Z]=a;Q(d,c,a.fn,X);}return a;},_attach:function(d,c){var i,k,a,h,X,Z=false,b,e=d[0],f=d[1],Y=d[2]||L,l=c&&c.facade,j=c&&c.capture,g=c&&c.overrides;if(d[d.length-1]===K){i=true;}if(!f||!f.call){return false;}if(M(Y)){k=[];E.each(Y,function(n,m){d[2]=n;k.push(P._attach(d,c));});return new E.EventHandle(k);}else{if(E.Lang.isString(Y)){if(i){a=E.DOM.byId(Y);}else{a=E.Selector.query(Y);switch(a.length){case 0:a=null;break;case 1:a=a[0];break;default:d[2]=a;return P._attach(d,c);}}if(a){Y=a;}else{b=P.onAvailable(Y,function(){b.handle=P._attach(d,c);},P,true,false,i);return b;}}}if(!Y){return false;}if(E.Node&&E.instanceOf(Y,E.Node)){Y=E.Node.getDOMNode(Y);}h=P._createWrapper(Y,e,j,i,l);if(g){E.mix(h.overrides,g);}if(Y==L&&e=="load"){if(YUI.Env.windowLoaded){Z=true;}}if(i){d.pop();}X=d[3];b=h._on(f,X,(d.length>4)?d.slice(4):null);if(Z){h.fire();}return b;},detach:function(e,f,Z,c){var d=E.Array(arguments,0,true),h,a,g,b,X,Y;if(d[d.length-1]===K){h=true;}if(e&&e.detach){return e.detach();}if(typeof Z=="string"){if(h){Z=E.DOM.byId(Z);}else{Z=E.Selector.query(Z);a=Z.length;if(a<1){Z=null;}else{if(a==1){Z=Z[0];}}}}if(!Z){return false;}if(Z.detach){d.splice(2,1);return Z.detach.apply(Z,d);}else{if(M(Z)){g=true;for(b=0,a=Z.length;b<a;++b){d[2]=Z[b];g=(E.Event.detach.apply(E.Event,d)&&g);}return g;}}if(!e||!f||!f.call){return P.purgeElement(Z,false,e);}X="event:"+E.stamp(Z)+e;Y=V[X];if(Y){return Y.detach(f);}else{return false;}},getEvent:function(a,Y,X){var Z=a||L.event;return(X)?Z:new E.DOMEventFacade(Z,Y,V["event:"+E.stamp(Y)+a.type]);},generateId:function(X){var Y=X.id;if(!Y){Y=E.stamp(X);X.id=Y;}return Y;},_isValidCollection:M,_load:function(X){if(!T){T=true;if(E.fire){E.fire(I);}P._poll();}},_poll:function(){if(P.locked){return;}if(E.UA.ie&&!YUI.Env.DOMReady){P.startInterval();return;}P.locked=true;var Y,X,c,Z,b,d,a=!T;if(!a){a=(U>0);}b=[];d=function(g,h){var f,e=h.override;if(h.compat){if(h.override){if(e===true){f=h.obj;}else{f=e;}}else{f=g;}h.fn.call(f,h.obj);}else{f=h.obj||E.one(g);h.fn.apply(f,(E.Lang.isArray(e))?e:[]);}};for(Y=0,X=S.length;Y<X;++Y){c=S[Y];if(c&&!c.checkReady){Z=(c.compat)?E.DOM.byId(c.id):E.Selector.query(c.id,null,true);if(Z){d(Z,c);S[Y]=null;}else{b.push(c);}}}for(Y=0,X=S.length;Y<X;++Y){c=S[Y];if(c&&c.checkReady){Z=(c.compat)?E.DOM.byId(c.id):E.Selector.query(c.id,null,true);
if(Z){if(T||(Z.get&&Z.get("nextSibling"))||Z.nextSibling){d(Z,c);S[Y]=null;}}else{b.push(c);}}}U=(b.length===0)?0:U-1;if(a){P.startInterval();}else{clearInterval(P._interval);P._interval=null;}P.locked=false;return;},purgeElement:function(a,X,e){var c=(E.Lang.isString(a))?E.Selector.query(a,null,true):a,g=P.getListeners(c,e),b,d,f,Z,Y;if(X&&c){g=g||[];Z=E.Selector.query("*",c);b=0;d=Z.length;for(;b<d;++b){Y=P.getListeners(Z[b],e);if(Y){g=g.concat(Y);}}}if(g){b=0;d=g.length;for(;b<d;++b){f=g[b];f.detachAll();J(f.el,f.type,f.fn,f.capture);delete V[f.key];delete W[f.domkey][f.key];}}},getListeners:function(b,a){var c=E.stamp(b,true),X=W[c],Z=[],Y=(a)?"event:"+c+a:null,d=O.plugins;if(!X){return null;}if(Y){if(d[a]&&d[a].eventDef){Y+="_synth";}if(X[Y]){Z.push(X[Y]);}Y+="native";if(X[Y]){Z.push(X[Y]);}}else{E.each(X,function(f,e){Z.push(f);});}return(Z.length)?Z:null;},_unload:function(X){E.each(V,function(Z,Y){Z.detachAll();J(Z.el,Z.type,Z.fn,Z.capture);delete V[Y];delete W[Z.domkey][Y];});J(L,"unload",G);},nativeAdd:Q,nativeRemove:J};}();E.Event=P;if(H.injected||YUI.Env.windowLoaded){N();}else{Q(L,"load",N);}if(E.UA.ie){E.on(I,P._poll);}Q(L,"unload",G);P.Custom=E.CustomEvent;P.Subscriber=E.Subscriber;P.Target=E.EventTarget;P.Handle=E.EventHandle;P.Facade=E.EventFacade;P._poll();})();E.Env.evt.plugins.available={on:function(I,H,K,J){var G=arguments.length>4?E.Array(arguments,4,true):null;return E.Event.onAvailable.call(E.Event,K,H,J,G);}};E.Env.evt.plugins.contentready={on:function(I,H,K,J){var G=arguments.length>4?E.Array(arguments,4,true):null;return E.Event.onContentReady.call(E.Event,K,H,J,G);}};},"@VERSION@",{requires:["event-custom-base"]});