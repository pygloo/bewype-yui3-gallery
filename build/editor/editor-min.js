YUI.add("frame",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.extend(A,B.Base,{_ready:null,_rendered:null,_iframe:null,_instance:null,_create:function(C){var I,H,E,G;this._iframe=B.Node.create(A.HTML);this._iframe.setStyle("visibility","hidden");this._iframe.set("src",this.get("src"));this.get("container").append(this._iframe);var D="",F=((this.get("extracss"))?'<style id="extra_css">'+this.get("extracss")+"</style>":"");D=B.substitute(A.PAGE_HTML,{DIR:this.get("dir"),LANG:this.get("lang"),TITLE:this.get("title"),META:A.META,LINKED_CSS:this.get("linkedcss"),CONTENT:this.get("content"),BASE_HREF:this.get("basehref"),DEFAULT_CSS:A.DEFAULT_CSS,EXTRA_CSS:F});if(B.config.doc.compatMode!="BackCompat"){D=A.DOC_TYPE+"\n"+D;}else{}E=this._resolveWinDoc();E.doc.open();E.doc.write(D);E.doc.close();if(this.get("designMode")){E.doc.designMode="on";}if(!E.doc.documentElement){var J=B.later(1,this,function(){if(E.doc&&E.doc.documentElement){C(E);J.cancel();}},null,true);}else{C(E);}},_resolveWinDoc:function(D){var C=(D)?D:{};C.win=B.Node.getDOMNode(this._iframe.get("contentWindow"));C.doc=B.Node.getDOMNode(this._iframe.get("contentWindow.document"));if(!C.doc){C.doc=B.config.doc;}if(!C.win){C.win=B.config.win;}return C;},_onDomEvent:function(E){var D,C;E.frameX=E.frameY=0;if(E.pageX>0||E.pageY>0){if(E.type.substring(0,3)!=="key"){C=this._instance.one("win");D=this._iframe.getXY();E.frameX=D[0]+E.pageX-C.get("scrollLeft");E.frameY=D[1]+E.pageY-C.get("scrollTop");}}E.frameTarget=E.target;E.frameCurrentTarget=E.currentTarget;E.frameEvent=E;this.fire("dom:"+E.type,E);},initializer:function(){this.publish("ready",{emitFacade:true,defaultFn:this._defReadyFn});},destructor:function(){var C=this.getInstance();C.one("doc").detachAll();C=null;this._iframe.remove();},_DOMPaste:function(F){var D=this.getInstance(),C="",E=D.config.win;if(F._event.originalTarget){C=F._event.originalTarget;}if(F._event.clipboardData){C=F._event.clipboardData.getData("Text");}if(E.clipboardData){C=E.clipboardData.getData("Text");if(C==""){if(!E.clipboardData.setData("Text",C)){C=null;}}}F.frameTarget=F.target;F.frameCurrentTarget=F.currentTarget;F.frameEvent=F;if(C){F.clipboardData={data:C,getData:function(){return C;}};}else{F.clipboardData=null;}this.fire("dom:paste",F);},_defReadyFn:function(){var E=this.getInstance(),C=B.bind(this._onDomEvent,this),D=((B.UA.ie)?B.throttle(C,200):C);E.Node.DOM_EVENTS.activate=1;E.Node.DOM_EVENTS.focusin=1;E.Node.DOM_EVENTS.deactivate=1;E.Node.DOM_EVENTS.focusout=1;B.each(A.DOM_EVENTS,function(G,F){if(G===1){if(F!=="focus"&&F!=="blur"&&F!=="paste"){if(F.substring(0,3)==="key"){E.on(F,D,E.config.doc);}else{E.on(F,C,E.config.doc);}}}},this);E.Node.DOM_EVENTS.paste=1;E.on("paste",B.bind(this._DOMPaste,this),E.one("body"));E.on("focus",C,E.config.win);E.on("blur",C,E.config.win);E._use=E.use;E.use=B.bind(this.use,this);this._iframe.setStyles({visibility:"inherit"});E.one("body").setStyle("display","block");},_onContentReady:function(E){if(!this._ready){this._ready=true;var D=this.getInstance(),C=B.clone(this.get("use"));this.fire("contentready");if(E){D.config.doc=B.Node.getDOMNode(E.target);}C.push(B.bind(function(){this.fire("ready");},this));D.use.apply(D,C);D.one("doc").get("documentElement").addClass("yui-js-enabled");}},_resolveBaseHref:function(C){if(!C||C===""){C=B.config.doc.location.href;if(C.indexOf("?")!==-1){C=C.substring(0,C.indexOf("?"));}C=C.substring(0,C.lastIndexOf("/"))+"/";}return C;},_getHTML:function(C){if(this._ready){var D=this.getInstance();C=D.one("body").get("innerHTML");}return C;},_setHTML:function(C){if(this._ready){var D=this.getInstance();D.one("body").set("innerHTML",C);}else{this.on("contentready",B.bind(function(E,G){var F=this.getInstance();F.one("body").set("innerHTML",E);},this,C));}return C;},_getLinkedCSS:function(C){if(!B.Lang.isArray(C)){C=[C];}var D="";if(!this._ready){B.each(C,function(E){D+='<link rel="stylesheet" href="'+E+'" type="text/css">';});}else{D=C;}return D;},_setLinkedCSS:function(C){if(this._ready){var D=this.getInstance();D.Get.css(C);}return C;},_setExtraCSS:function(C){if(this._ready){var E=this.getInstance(),D=E.get("#extra_css");D.remove();E.one("head").append('<style id="extra_css">'+C+"</style>");}return C;},_instanceLoaded:function(D){this._instance=D;this._onContentReady();var E=this._instance.config.doc;if(this.get("designMode")){if(!B.UA.ie){try{E.execCommand("styleWithCSS",false,false);E.execCommand("insertbronreturn",false,false);}catch(C){}}}},use:function(){var E=this.getInstance(),D=B.Array(arguments),C=false;if(B.Lang.isFunction(D[D.length-1])){C=D.pop();}if(C){D.push(function(){C.apply(E,arguments);});}E._use.apply(E,D);},delegate:function(E,D,C,G){var F=this.getInstance();if(!F){return false;}if(!G){G=C;C="body";}return F.delegate(E,D,C,G);},getInstance:function(){return this._instance;},render:function(C){if(this._rendered){return this;}this._rendered=true;if(C){this.set("container",C);}this._create(B.bind(function(G){var I,J,D=B.bind(function(K){this._instanceLoaded(K);},this),F=B.clone(this.get("use")),E={debug:false,win:G.win,doc:G.doc},H=B.bind(function(){E=this._resolveWinDoc(E);I=YUI(E);try{I.use("node-base",D);if(J){clearInterval(J);}}catch(K){J=setInterval(function(){H();},350);}},this);F.push(H);B.use.apply(B,F);},this));return this;},_handleFocus:function(){var D=this.getInstance(),C=new D.Selection();if(C.anchorNode){var F=C.anchorNode,E=F.get("childNodes");if(E.size()==1){if(E.item(0).test("br")){C.selectNode(F,true,false);}}}},focus:function(C){if(B.UA.ie){try{B.one("win").focus();this.getInstance().one("win").focus();}catch(E){}if(C===true){this._handleFocus();}if(B.Lang.isFunction(C)){C();}}else{try{B.one("win").focus();B.later(100,this,function(){this.getInstance().one("win").focus();if(C===true){this._handleFocus();}if(B.Lang.isFunction(C)){C();}});}catch(D){}}return this;},show:function(){this._iframe.setStyles({position:"static",left:""});if(B.UA.gecko){try{this._instance.config.doc.designMode="on";
}catch(C){}this.focus();}return this;},hide:function(){this._iframe.setStyles({position:"absolute",left:"-999999px"});return this;}},{DOM_EVENTS:{paste:1,mouseup:1,mousedown:1,keyup:1,keydown:1,keypress:1,activate:1,deactivate:1,focusin:1,focusout:1},DEFAULT_CSS:"html { height: 95%; } body { padding: 7px; background-color: #fff; font: 13px/1.22 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small; } a, a:visited, a:hover { color: blue !important; text-decoration: underline !important; cursor: text !important; } img { cursor: pointer !important; border: none; } .yui-cursor { *line-height: 0; *height: 0; *width: 0; *font-size: 0; *overflow: hidden; }",HTML:'<iframe border="0" frameBorder="0" marginWidth="0" marginHeight="0" leftMargin="0" topMargin="0" allowTransparency="true" width="100%" height="99%"></iframe>',PAGE_HTML:'<html dir="{DIR}" lang="{LANG}"><head><title>{TITLE}</title>{META}<base href="{BASE_HREF}"/>{LINKED_CSS}<style id="editor_css">{DEFAULT_CSS}</style>{EXTRA_CSS}</head><body>{CONTENT}</body></html>',DOC_TYPE:'<!DOCTYPE HTML PUBLIC "-/'+"/W3C/"+"/DTD HTML 4.01/"+'/EN" "http:/'+'/www.w3.org/TR/html4/strict.dtd">',META:'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">',NAME:"frame",ATTRS:{title:{value:"Blank Page"},dir:{value:"ltr"},lang:{value:"en-US"},src:{value:"javascript"+((B.UA.ie)?":false":":")+";"},designMode:{writeOnce:true,value:false},content:{value:"<br>",setter:"_setHTML",getter:"_getHTML"},basehref:{value:false,getter:"_resolveBaseHref"},use:{writeOnce:true,value:["substitute","node","node-style","selector-css3"]},container:{value:"body",setter:function(C){return B.one(C);}},id:{writeOnce:true,getter:function(C){if(!C){C="iframe-"+B.guid();}return C;}},linkedcss:{value:"",getter:"_getLinkedCSS",setter:"_setLinkedCSS"},extracss:{value:"",setter:"_setExtraCSS"},host:{value:false}}});B.Frame=A;},"@VERSION@",{skinnable:false,requires:["base","node","selector-css3","substitute"]});YUI.add("selection",function(B){var A="textContent",D="innerHTML",C="fontFamily";if(B.UA.ie){A="nodeValue";}B.Selection=function(J){var K,I,E,G,F,H;if(B.config.win.getSelection){K=B.config.win.getSelection();}else{if(B.config.doc.selection){K=B.config.doc.selection.createRange();}}this._selection=K;if(K.pasteHTML){this.isCollapsed=(K.compareEndPoints("StartToEnd",K))?false:true;if(this.isCollapsed){this.anchorNode=this.focusNode=B.one(K.parentElement());if(J){E=B.config.doc.elementFromPoint(J.clientX,J.clientY);}if(!E){I=K.parentElement();G=I.childNodes;F=K.duplicate();for(H=0;H<G.length;H++){if(F.inRange(K)){E=G[H];}}}this.ieNode=E;if(E){if(E.nodeType!==3){if(E.firstChild){E=E.firstChild;}}this.anchorNode=this.focusNode=B.Selection.resolve(E);this.anchorOffset=this.focusOffset=(this.anchorNode.nodeValue)?this.anchorNode.nodeValue.length:0;this.anchorTextNode=this.focusTextNode=B.one(E);}}}else{this.isCollapsed=K.isCollapsed;this.anchorNode=B.Selection.resolve(K.anchorNode);this.focusNode=B.Selection.resolve(K.focusNode);this.anchorOffset=K.anchorOffset;this.focusOffset=K.focusOffset;this.anchorTextNode=B.one(K.anchorNode);this.focusTextNode=B.one(K.focusNode);}if(B.Lang.isString(K.text)){this.text=K.text;}else{if(K.toString){this.text=K.toString();}else{this.text="";}}};B.Selection.filter=function(E){var H=(new Date()).getTime();var G=B.all(B.Selection.ALL),K=B.all("strong,em"),N=B.config.doc,P=N.getElementsByTagName("hr"),F={},I="",L;var J=(new Date()).getTime();G.each(function(R){var Q=B.Node.getDOMNode(R);if(Q.style[C]){F["."+R._yuid]=Q.style[C];R.addClass(R._yuid);Q.style[C]="inherit";Q.removeAttribute("face");if(Q.getAttribute("style")===""){Q.removeAttribute("style");}if(Q.getAttribute("style")){if(Q.getAttribute("style").toLowerCase()==="font-family: "){Q.removeAttribute("style");}}}});var O=(new Date()).getTime();B.all(".hr").addClass("yui-skip").addClass("yui-non");B.each(P,function(R){var Q=N.createElement("div");Q.className="hr yui-non yui-skip";Q.setAttribute("style","border: 1px solid #ccc; line-height: 0; font-size: 0;margin-top: 5px; margin-bottom: 5px;");Q.setAttribute("readonly",true);Q.setAttribute("contenteditable",false);if(R.parentNode){R.parentNode.replaceChild(Q,R);}});B.each(F,function(R,Q){I+=Q+" { font-family: "+R.replace(/"/gi,"")+"; }";});B.StyleSheet(I,"editor");K.each(function(T,Q){var R=T.get("tagName").toLowerCase(),S="i";if(R==="strong"){S="b";}B.Selection.prototype._swap(K.item(Q),S);});L=B.all("ol,ul");L.each(function(R,Q){var S=R.all("li");if(!S.size()){R.remove();}});if(E){B.Selection.filterBlocks();}var M=(new Date()).getTime();};B.Selection.filterBlocks=function(){var F=(new Date()).getTime();var M=B.config.doc.body.childNodes,H,G,P=false,J=true,E,Q,R,O,L,N,S;if(M){for(H=0;H<M.length;H++){G=B.one(M[H]);if(!G.test(B.Selection.BLOCKS)){J=true;if(M[H].nodeType==3){N=M[H][A].match(B.Selection.REG_CHAR);S=M[H][A].match(B.Selection.REG_NON);if(N===null&&S){J=false;}}if(J){if(!P){P=[];}P.push(M[H]);}}else{P=B.Selection._wrapBlock(P);}}P=B.Selection._wrapBlock(P);}Q=B.all("p");if(Q.size()===1){R=Q.item(0).all("br");if(R.size()===1){R.item(0).remove();var I=Q.item(0).get("innerHTML");if(I==""||I==" "){Q.set("innerHTML",B.Selection.CURSOR);E=new B.Selection();E.focusCursor(true,true);}}}else{Q.each(function(U){var T=U.get("innerHTML");if(T===""){U.remove();}});}if(!B.UA.ie){}var K=(new Date()).getTime();};B.Selection.REG_CHAR=/[a-zA-Z-0-9_]/gi;B.Selection.REG_NON=/[\s\S|\n|\t]/gi;B.Selection._wrapBlock=function(F){if(F){var E=B.Node.create("<p></p>"),H=B.one(F[0]),G;for(G=1;G<F.length;G++){E.append(F[G]);}H.replace(E);E.prepend(H);}return false;};B.Selection.unfilter=function(){var G=B.all("body [class]"),H="",F,I,E=B.one("body");G.each(function(J){if(J.hasClass(J._yuid)){J.setStyle(C,J.getStyle(C));J.removeClass(J._yuid);if(J.getAttribute("class")===""){J.removeAttribute("class");}}});F=B.all(".yui-non");F.each(function(J){if(!J.hasClass("yui-skip")&&J.get("innerHTML")===""){J.remove();
}else{J.removeClass("yui-non").removeClass("yui-skip");}});I=B.all("body [id]");I.each(function(J){if(J.get("id").indexOf("yui_3_")===0){J.removeAttribute("id");J.removeAttribute("_yuid");}});if(E){H=E.get("innerHTML");}B.all(".hr").addClass("yui-skip").addClass("yui-non");G.each(function(J){J.addClass(J._yuid);J.setStyle(C,"");if(J.getAttribute("style")===""){J.removeAttribute("style");}});return H;};B.Selection.resolve=function(E){if(E&&E.nodeType===3){E=E.parentNode;}return B.one(E);};B.Selection.getText=function(G){var E=G.get("innerHTML").replace(B.Selection.STRIP_HTML,""),H=E.match(B.Selection.REG_CHAR),F=E.match(B.Selection.REG_NON);if(H===null&&F){E="";}return E;};B.Selection.ALL="[style],font[face]";B.Selection.STRIP_HTML=/<\S[^><]*>/g;B.Selection.BLOCKS="p,div,ul,ol,table,style";B.Selection.TMP="yui-tmp";B.Selection.DEFAULT_TAG="span";B.Selection.CURID="yui-cursor";B.Selection.CUR_WRAPID="yui-cursor-wrapper";B.Selection.CURSOR='<span id="'+B.Selection.CURID+'"><br class="yui-cursor"></span>';B.Selection.hasCursor=function(){var E=B.all("#"+B.Selection.CUR_WRAPID);return E.size();};B.Selection.cleanCursor=function(){var E=B.all("#"+B.Selection.CUR_WRAPID);if(E.size()){E.each(function(G){var F=G.get("innerHTML");if(F=="&nbsp;"||F=="<br>"){if(G.previous()||G.next()){G.remove();}}});}};B.Selection.prototype={text:null,isCollapsed:null,anchorNode:null,anchorOffset:null,anchorTextNode:null,focusNode:null,focusOffset:null,focusTextNode:null,_selection:null,_wrap:function(G,E){var F=B.Node.create("<"+E+"></"+E+">");F.set(D,G.get(D));G.set(D,"");G.append(F);return B.Node.getDOMNode(F);},_swap:function(G,E){var F=B.Node.create("<"+E+"></"+E+">");F.set(D,G.get(D));G.replace(F,G);return B.Node.getDOMNode(F);},getSelected:function(){B.Selection.filter();B.config.doc.execCommand("fontname",null,B.Selection.TMP);var F=B.all(B.Selection.ALL),E=[];F.each(function(H,G){if(H.getStyle(C)==B.Selection.TMP){H.setStyle(C,"");H.removeAttribute("face");if(H.getAttribute("style")===""){H.removeAttribute("style");}if(!H.test("body")){E.push(B.Node.getDOMNode(F.item(G)));}}});return B.all(E);},insertContent:function(E){return this.insertAtCursor(E,this.anchorTextNode,this.anchorOffset,true);},insertAtCursor:function(K,F,H,N){var P=B.Node.create("<"+B.Selection.DEFAULT_TAG+' class="yui-non"></'+B.Selection.DEFAULT_TAG+">"),E,I,G,O,J=this.createRange(),M;if(F&&F.test("body")){M=B.Node.create("<span></span>");F.append(M);F=M;}if(J.pasteHTML){O=B.Node.create(K);try{J.pasteHTML('<span id="rte-insert"></span>');}catch(L){}E=B.one("#rte-insert");if(E){E.set("id","");E.replace(O);return O;}else{B.on("available",function(){E.set("id","");E.replace(O);},"#rte-insert");}}else{if(H>0){E=F.get(A);I=B.one(B.config.doc.createTextNode(E.substr(0,H)));G=B.one(B.config.doc.createTextNode(E.substr(H)));F.replace(I,F);O=B.Node.create(K);if(O.get("nodeType")===11){M=B.Node.create("<span></span>");M.append(O);O=M;}I.insert(O,"after");if(G){O.insert(P,"after");P.insert(G,"after");this.selectNode(P,N);}}else{if(F.get("nodeType")===3){F=F.get("parentNode");}O=B.Node.create(K);K=F.get("innerHTML").replace(/\n/gi,"");if(K==""||K=="<br>"){F.append(O);}else{F.insert(O,"before");}if(F.get("firstChild").test("br")){F.get("firstChild").remove();}}}return O;},wrapContent:function(F){F=(F)?F:B.Selection.DEFAULT_TAG;if(!this.isCollapsed){var H=this.getSelected(),K=[],G,I,J,E;H.each(function(N,L){var M=N.get("tagName").toLowerCase();if(M==="font"){K.push(this._swap(H.item(L),F));}else{K.push(this._wrap(H.item(L),F));}},this);G=this.createRange();J=K[0];I=K[K.length-1];if(this._selection.removeAllRanges){G.setStart(K[0],0);G.setEnd(I,I.childNodes.length);this._selection.removeAllRanges();this._selection.addRange(G);}else{G.moveToElementText(B.Node.getDOMNode(J));E=this.createRange();E.moveToElementText(B.Node.getDOMNode(I));G.setEndPoint("EndToEnd",E);G.select();}K=B.all(K);return K;}else{return B.all([]);}},replace:function(K,I){var F=this.createRange(),J,E,G,H;if(F.getBookmark){G=F.getBookmark();E=this.anchorNode.get("innerHTML").replace(K,I);this.anchorNode.set("innerHTML",E);F.moveToBookmark(G);H=B.one(F.parentElement());}else{J=this.anchorTextNode;E=J.get(A);G=E.indexOf(K);E=E.replace(K,"");J.set(A,E);H=this.insertAtCursor(I,J,G,true);}return H;},remove:function(){this._selection.removeAllRanges();return this;},createRange:function(){if(B.config.doc.selection){return B.config.doc.selection.createRange();}else{return B.config.doc.createRange();}},selectNode:function(H,J,E){E=E||0;H=B.Node.getDOMNode(H);var F=this.createRange();if(F.selectNode){F.selectNode(H);this._selection.removeAllRanges();this._selection.addRange(F);if(J){try{this._selection.collapse(H,E);}catch(G){this._selection.collapse(H,0);}}}else{if(H.nodeType===3){H=H.parentNode;}try{F.moveToElementText(H);}catch(I){}if(J){F.collapse(((E)?false:true));}F.select();}return this;},setCursor:function(){this.removeCursor(false);return this.insertContent(B.Selection.CURSOR);},getCursor:function(){return B.all("#"+B.Selection.CURID);},removeCursor:function(E){var F=this.getCursor();if(F){if(E){F.removeAttribute("id");F.set("innerHTML",'<br class="yui-cursor">');}else{F.remove();}}return F;},focusCursor:function(G,E){if(G!==false){G=true;}if(E!==false){E=true;}var F=this.removeCursor(true);if(F){F.each(function(H){this.selectNode(H,G,E);},this);}},toString:function(){return"Selection Object";}};},"@VERSION@",{skinnable:false,requires:["node"]});YUI.add("exec-command",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.extend(A,B.Base,{_lastKey:null,_inst:null,command:function(E,D){var C=A.COMMANDS[E];if(C){return C.call(this,E,D);}else{return this._command(E,D);}},_command:function(E,D){var C=this.getInstance();try{C.config.doc.execCommand(E,null,D);}catch(F){}},getInstance:function(){if(!this._inst){this._inst=this.get("host").getInstance();}return this._inst;},initializer:function(){B.mix(this.get("host"),{execCommand:function(D,C){return this.exec.command(D,C);
},_execCommand:function(D,C){return this.exec._command(D,C);}});this.get("host").on("dom:keypress",B.bind(function(C){this._lastKey=C.keyCode;},this));}},{NAME:"execCommand",NS:"exec",ATTRS:{host:{value:false}},COMMANDS:{wrap:function(E,C){var D=this.getInstance();return(new D.Selection()).wrapContent(C);},inserthtml:function(E,C){var D=this.getInstance();if(D.Selection.hasCursor()||B.UA.ie){return(new D.Selection()).insertContent(C);}else{this._command("inserthtml",C);}},insertandfocus:function(G,D){var F=this.getInstance(),C,E;if(F.Selection.hasCursor()){D+=F.Selection.CURSOR;C=this.command("inserthtml",D);E=new F.Selection();E.focusCursor(true,true);}else{this.command("inserthtml",D);}return C;},insertbr:function(E){var D=this.getInstance(),F,C=new D.Selection();C.setCursor();F=C.getCursor();F.insert("<br>","before");C.focusCursor(true,false);return F.previous();},insertimage:function(D,C){return this.command("inserthtml",'<img src="'+C+'">');},addclass:function(E,C){var D=this.getInstance();return(new D.Selection()).getSelected().addClass(C);},removeclass:function(E,C){var D=this.getInstance();return(new D.Selection()).getSelected().removeClass(C);},forecolor:function(E,F){var D=this.getInstance(),C=new D.Selection(),G;if(!B.UA.ie){this._command("styleWithCSS","true");}if(D.Selection.hasCursor()){if(C.isCollapsed){if(C.anchorNode&&(C.anchorNode.get("innerHTML")==="&nbsp;")){C.anchorNode.setStyle("color",F);G=C.anchorNode;}else{G=this.command("inserthtml",'<span style="color: '+F+'">'+D.Selection.CURSOR+"</span>");C.focusCursor(true,true);}return G;}else{return this._command(E,F);}}else{this._command(E,F);}if(!B.UA.ie){this._command("styleWithCSS",false);}},backcolor:function(E,F){var D=this.getInstance(),C=new D.Selection(),H;if(B.UA.gecko||B.UA.opera){E="hilitecolor";}if(!B.UA.ie){this._command("styleWithCSS","true");}if(D.Selection.hasCursor()){if(C.isCollapsed){if(C.anchorNode&&(C.anchorNode.get("innerHTML")==="&nbsp;")){C.anchorNode.setStyle("backgroundColor",F);H=C.anchorNode;}else{H=this.command("inserthtml",'<span style="background-color: '+F+'">'+D.Selection.CURSOR+"</span>");C.focusCursor(true,true);}return H;}else{return this._command(E,F);}}else{if(B.UA.gecko&&C.isCollapsed){this._command("inserthtml",'<span id="yui3-bcolor" style="background-color: '+F+'"></span>');var G=D.one("#yui3-bcolor");if(G){G.set("id","");G.removeAttribute("id");}}else{this._command(E,F);}}if(!B.UA.ie){this._command("styleWithCSS",false);}},hilitecolor:function(){return A.COMMANDS.backcolor.apply(this,arguments);},fontname:function(E,F){this._command("fontname",F);var D=this.getInstance(),C=new D.Selection();if(C.isCollapsed&&(this._lastKey!=32)){if(C.anchorNode.test("font")){C.anchorNode.set("face",F);}}},fontsize:function(E,G){this._command("fontsize",G);var D=this.getInstance(),C=new D.Selection();if(C.isCollapsed&&(this._lastKey!=32)){if(C.anchorNode.test("font")){C.anchorNode.set("size",G);}else{if(B.UA.gecko){var F=C.anchorNode.ancestor("p");if(F){F.setStyle("fontSize","");}}}}}}});B.namespace("Plugin");B.Plugin.ExecCommand=A;},"@VERSION@",{skinnable:false,requires:["frame"]});YUI.add("editor-tab",function(C){var B=function(){B.superclass.constructor.apply(this,arguments);},A="host";C.extend(B,C.Base,{_onNodeChange:function(E){var D="indent";if(E.changedType==="tab"){if(!E.changedNode.test("li, li *")){E.changedEvent.halt();E.preventDefault();if(E.changedEvent.shiftKey){D="outdent";}this.get(A).execCommand(D,"");}}},initializer:function(){this.get(A).on("nodeChange",C.bind(this._onNodeChange,this));}},{NAME:"editorTab",NS:"tab",ATTRS:{host:{value:false}}});C.namespace("Plugin");C.Plugin.EditorTab=B;},"@VERSION@",{skinnable:false,requires:["editor-base"]});YUI.add("createlink-base",function(B){var A={};A.STRINGS={PROMPT:"Please enter the URL for the link to point to:",DEFAULT:"http://"};B.namespace("Plugin");B.Plugin.CreateLinkBase=A;B.mix(B.Plugin.ExecCommand.COMMANDS,{createlink:function(H){var G=this.get("host").getInstance(),E,C,F,D=prompt(A.STRINGS.PROMPT,A.STRINGS.DEFAULT);if(D){this.get("host")._execCommand(H,D);F=new G.Selection();E=F.getSelected();if(!F.isCollapsed&&E.size()){C=E.item(0).one("a");if(C){E.item(0).replace(C);}}else{this.get("host").execCommand("inserthtml",'<a href="'+D+'">'+D+"</a>");}}return C;}});},"@VERSION@",{skinnable:false,requires:["editor-base"]});YUI.add("editor-base",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.extend(A,B.Base,{frame:null,initializer:function(){var C=new B.Frame({designMode:true,title:A.STRINGS.title,use:A.USE,dir:this.get("dir"),extracss:this.get("extracss"),linkedcss:this.get("linkedcss"),host:this}).plug(B.Plugin.ExecCommand);C.after("ready",B.bind(this._afterFrameReady,this));C.addTarget(this);this.frame=C;this.publish("nodeChange",{emitFacade:true,bubbles:true,defaultFn:this._defNodeChangeFn});this.plug(B.Plugin.EditorPara);},destructor:function(){this.frame.destroy();this.detachAll();},copyStyles:function(F,E){if(F.test("a")){return;}var C=["color","fontSize","fontFamily","backgroundColor","fontStyle"],D={};B.each(C,function(G){D[G]=F.getStyle(G);});if(F.ancestor("b,strong")){D.fontWeight="bold";}if(F.ancestor("u")){if(!D.textDecoration){D.textDecoration="underline";}}E.setStyles(D);},_lastBookmark:null,_defNodeChangeFn:function(T){var M=(new Date()).getTime();var E=this.getInstance(),R;if(B.UA.ie){R=E.config.doc.selection.createRange();this._lastBookmark=R.getBookmark();}switch(T.changedType){case"keydown":E.Selection.cleanCursor();break;case"enter":if(B.UA.webkit){if(T.changedEvent.shiftKey){this.execCommand("insertbr");T.changedEvent.preventDefault();}}break;case"tab":if(!T.changedNode.test("li, li *")&&!T.changedEvent.shiftKey){T.changedEvent.preventDefault();var R=new E.Selection();R.setCursor();var D=R.getCursor();D.insert(A.TABKEY,"before");R.focusCursor();}break;case"enter-up":var C=((this._lastPara)?this._lastPara:T.changedNode),V=C.one("br.yui-cursor");if(this._lastPara){delete this._lastPara;
}if(V){if(V.previous()||V.next()){V.remove();}}if(!C.test("p")){var L=C.ancestor("p");if(L){C=L;L=null;}}if(C.test("p")){var N=C.previous(),Q,H,J=false;if(N){Q=N.one(":last-child");while(!J){if(Q){H=Q.one(":last-child");if(H){Q=H;}else{J=true;}}else{J=true;}}if(Q){this.copyStyles(Q,C);}}}break;}if(B.UA.gecko){if(!T.changedNode.test("p")){var O=T.changedNode.ancestor("p");if(O){this._lastPara=O;}}}var G=this.getDomPath(T.changedNode,false),P={},S,K,U=[],I="",W="";if(T.commands){P=T.commands;}B.each(G,function(c){var Y=c.tagName.toLowerCase(),d=A.TAG2CMD[Y];if(d){P[d]=1;}var b=c.currentStyle||c.style;if((""+b.fontWeight)=="bold"){P.bold=1;}if(b.fontStyle=="italic"){P.italic=1;}if(b.textDecoration=="underline"){P.underline=1;}if(b.textDecoration=="line-through"){P.strikethrough=1;}var e=E.one(c);if(e.getStyle("fontFamily")){var a=e.getStyle("fontFamily").split(",")[0].toLowerCase();if(a){S=a;}if(S){S=S.replace(/'/g,"").replace(/"/g,"");}}K=e.getStyle("fontSize");var Z=c.className.split(" ");B.each(Z,function(f){if(f!==""&&(f.substr(0,4)!=="yui_")){U.push(f);}});I=A.FILTER_RGB(e.getStyle("color"));var X=A.FILTER_RGB(b.backgroundColor);if(X!=="transparent"){if(X!==""){W=X;}}});T.dompath=E.all(G);T.classNames=U;T.commands=P;if(!T.fontFamily){T.fontFamily=S;}if(!T.fontSize){T.fontSize=K;}if(!T.fontColor){T.fontColor=I;}if(!T.backgroundColor){T.backgroundColor=W;}var F=(new Date()).getTime();},getDomPath:function(E,C){var G=[],D,F=this.frame.getInstance();D=F.Node.getDOMNode(E);while(D!==null){if((D===F.config.doc.documentElement)||(D===F.config.doc)||!D.tagName){D=null;break;}if(!F.DOM.inDoc(D)){D=null;break;}if(D.nodeName&&D.nodeType&&(D.nodeType==1)){G.push(D);}if(D==F.config.doc.body){D=null;break;}D=D.parentNode;}if(G.length===0){G[0]=F.config.doc.body;}if(C){return F.all(G.reverse());}else{return G.reverse();}},_afterFrameReady:function(){var C=this.frame.getInstance();this.frame.on("dom:mouseup",B.bind(this._onFrameMouseUp,this));this.frame.on("dom:mousedown",B.bind(this._onFrameMouseDown,this));this.frame.on("dom:keydown",B.bind(this._onFrameKeyDown,this));if(B.UA.ie){this.frame.on("dom:activate",B.bind(this._onFrameActivate,this));this.frame.on("dom:keyup",B.throttle(B.bind(this._onFrameKeyUp,this),800));this.frame.on("dom:keypress",B.throttle(B.bind(this._onFrameKeyPress,this),800));}else{this.frame.on("dom:keyup",B.bind(this._onFrameKeyUp,this));this.frame.on("dom:keypress",B.bind(this._onFrameKeyPress,this));}C.Selection.filter();this.fire("ready");},_onFrameActivate:function(){if(this._lastBookmark){var E=this.getInstance(),D=E.config.doc.selection.createRange(),C=D.moveToBookmark(this._lastBookmark);D.select();this._lastBookmark=null;}},_onFrameMouseUp:function(C){this.fire("nodeChange",{changedNode:C.frameTarget,changedType:"mouseup",changedEvent:C.frameEvent});},_onFrameMouseDown:function(C){this.fire("nodeChange",{changedNode:C.frameTarget,changedType:"mousedown",changedEvent:C.frameEvent});},_currentSelection:null,_currentSelectionTimer:null,_currentSelectionClear:null,_onFrameKeyDown:function(E){if(!this._currentSelection){if(this._currentSelectionTimer){this._currentSelectionTimer.cancel();}this._currentSelectionTimer=B.later(850,this,function(){this._currentSelectionClear=true;});var D=this.frame.getInstance(),C=new D.Selection(E);this._currentSelection=C;}else{var C=this._currentSelection;}var D=this.frame.getInstance(),C=new D.Selection();this._currentSelection=C;if(C&&C.anchorNode){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:"keydown",changedEvent:E.frameEvent});if(A.NC_KEYS[E.keyCode]){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:A.NC_KEYS[E.keyCode],changedEvent:E.frameEvent});this.fire("nodeChange",{changedNode:C.anchorNode,changedType:A.NC_KEYS[E.keyCode]+"-down",changedEvent:E.frameEvent});}}},_onFrameKeyPress:function(D){var C=this._currentSelection;if(C&&C.anchorNode){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:"keypress",changedEvent:D.frameEvent});if(A.NC_KEYS[D.keyCode]){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:A.NC_KEYS[D.keyCode]+"-press",changedEvent:D.frameEvent});}}},_onFrameKeyUp:function(D){var C=this._currentSelection;if(C&&C.anchorNode){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:"keyup",selection:C,changedEvent:D.frameEvent});if(A.NC_KEYS[D.keyCode]){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:A.NC_KEYS[D.keyCode]+"-up",selection:C,changedEvent:D.frameEvent});}}if(this._currentSelectionClear){this._currentSelectionClear=this._currentSelection=null;}},execCommand:function(G,I){var D=this.frame.execCommand(G,I),F=this.frame.getInstance(),E=new F.Selection(),C={},H={changedNode:E.anchorNode,changedType:"execcommand",nodes:D};switch(G){case"forecolor":H.fontColor=I;break;case"backcolor":H.backgroundColor=I;break;case"fontsize":H.fontSize=I;break;case"fontname":H.fontFamily=I;break;}C[G]=1;H.commands=C;this.fire("nodeChange",H);return D;},getInstance:function(){return this.frame.getInstance();},render:function(C){this.frame.set("content",this.get("content"));this.frame.render(C);return this;},focus:function(C){this.frame.focus(C);return this;},show:function(){this.frame.show();return this;},hide:function(){this.frame.hide();return this;},getContent:function(){var C="",D=this.getInstance();if(D&&D.Selection){C=D.Selection.unfilter();}C=C.replace(/ _yuid="([^>]*)"/g,"");return C;}},{TABKEY:'<span class="tab">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',FILTER_RGB:function(E){if(E.toLowerCase().indexOf("rgb")!=-1){var H=new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)","gi");var D=E.replace(H,"$1,$2,$3,$4,$5").split(",");if(D.length==5){var G=parseInt(D[1],10).toString(16);var F=parseInt(D[2],10).toString(16);var C=parseInt(D[3],10).toString(16);G=G.length==1?"0"+G:G;F=F.length==1?"0"+F:F;C=C.length==1?"0"+C:C;E="#"+G+F+C;}}return E;},TAG2CMD:{"b":"bold","strong":"bold","i":"italic","em":"italic","u":"underline","sup":"superscript","sub":"subscript","img":"insertimage","a":"createlink","ul":"insertunorderedlist","ol":"insertorderedlist"},NC_KEYS:{8:"backspace",9:"tab",13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",46:"delete"},USE:["substitute","node","selector-css3","selection","stylesheet"],NAME:"editorBase",STRINGS:{title:"Rich Text Editor"},ATTRS:{content:{value:"<br>",setter:function(C){if(C.substr(0,1)==="\n"){C=C.substr(1);
}if(C===""){C="<br>";}return this.frame.set("content",C);},getter:function(){return this.frame.get("content");}},dir:{writeOnce:true,value:"ltr"},linkedcss:{value:"",setter:function(C){if(this.frame){this.frame.set("linkedcss",C);}return C;}},extracss:{value:false,setter:function(C){if(this.frame){this.frame.set("extracss",C);}return C;}}}});B.EditorBase=A;},"@VERSION@",{skinnable:false,requires:["base","frame","node","exec-command"]});YUI.add("editor-lists",function(F){var E=function(){E.superclass.constructor.apply(this,arguments);},B="li",C="ol",D="ul",A="host";F.extend(E,F.Base,{_onNodeChange:function(L){var J=this.get(A).getInstance(),G,O,P,H,I,M,N=false,Q,K=false;if(F.UA.ie&&L.changedType==="enter"){if(L.changedNode.test(B+", "+B+" *")){L.changedEvent.halt();L.preventDefault();O=L.changedNode;P=J.Node.create("<"+B+">"+E.NON+"</"+B+">");if(!O.test(B)){O=O.ancestor(B);}O.insert(P,"after");G=new J.Selection();G.selectNode(P.get("firstChild"),true,false);}}if(L.changedType==="tab"){if(L.changedNode.test(B+", "+B+" *")){L.changedEvent.halt();L.preventDefault();O=L.changedNode;I=L.changedEvent.shiftKey;M=O.ancestor(C+","+D);Q=D;if(M.get("tagName").toLowerCase()===C){Q=C;}if(!O.test(B)){O=O.ancestor(B);}if(I){if(O.ancestor(B)){O.ancestor(B).insert(O,"after");N=true;K=true;}}else{if(O.previous(B)){H=J.Node.create("<"+Q+"></"+Q+">");O.previous(B).append(H);H.append(O);N=true;}}}if(N){if(!O.test(B)){O=O.ancestor(B);}O.all(E.REMOVE).remove();if(F.UA.ie){O=O.append(E.NON).one(E.NON_SEL);}(new J.Selection()).selectNode(O,true,K);}}},initializer:function(){this.get(A).on("nodeChange",F.bind(this._onNodeChange,this));}},{NON:'<span class="yui-non">&nbsp;</span>',NON_SEL:"span.yui-non",REMOVE:"br",NAME:"editorLists",NS:"lists",ATTRS:{host:{value:false}}});F.namespace("Plugin");F.Plugin.EditorLists=E;F.mix(F.Plugin.ExecCommand.COMMANDS,{insertunorderedlist:function(I){var H=this.get("host").getInstance(),G;this.get("host")._execCommand(I,"");},insertorderedlist:function(I){var H=this.get("host").getInstance(),G;this.get("host")._execCommand(I,"");}});},"@VERSION@",{skinnable:false,requires:["editor-base"]});YUI.add("editor-bidi",function(H){var G=function(){G.superclass.constructor.apply(this,arguments);},C="host",B="dir",D="BODY",A="nodeChange",F="bidiContextChange",E=D+" > p";H.extend(G,H.Base,{lastDirection:null,firstEvent:null,_checkForChange:function(){var J=this.get(C),L=J.getInstance(),K=new L.Selection(),I,M;if(K.isCollapsed){I=G.blockParent(K.focusNode);M=I.getStyle("direction");if(M!==this.lastDirection){J.fire(F,{changedTo:M});this.lastDirection=M;}}else{J.fire(F,{changedTo:"select"});this.lastDirection=null;}},_afterNodeChange:function(I){if(this.firstEvent||G.EVENTS[I.changedType]){this._checkForChange();this.firstEvent=false;}},_afterMouseUp:function(I){this._checkForChange();this.firstEvent=false;},initializer:function(){var I=this.get(C);this.firstEvent=true;I.after(A,H.bind(this._afterNodeChange,this));I.after("dom:mouseup",H.bind(this._afterMouseUp,this));}},{EVENTS:{"backspace-up":true,"pageup-up":true,"pagedown-down":true,"end-up":true,"home-up":true,"left-up":true,"up-up":true,"right-up":true,"down-up":true,"delete-up":true},BLOCKS:H.Selection.BLOCKS+",LI,HR,"+D,DIV_WRAPPER:"<DIV></DIV>",blockParent:function(K,J){var I=K,M,L;if(!I){I=H.one(D);}if(!I.test(G.BLOCKS)){I=I.ancestor(G.BLOCKS);}if(J&&I.test(D)){M=H.Node.create(G.DIV_WRAPPER);I.get("children").each(function(O,N){if(N===0){L=O;}else{M.append(O);}});L.replace(M);M.prepend(L);I=M;}return I;},_NODE_SELECTED:"bidiSelected",addParents:function(L){var I,K,J;for(I=0;I<L.length;I+=1){L[I].setData(G._NODE_SELECTED,true);}for(I=0;I<L.length;I+=1){K=L[I].get("parentNode");if(!K.test(D)&&!K.getData(G._NODE_SELECTED)){J=true;K.get("children").some(function(M){if(!M.getData(G._NODE_SELECTED)){J=false;return true;}});if(J){L.push(K);K.setData(G._NODE_SELECTED,true);}}}for(I=0;I<L.length;I+=1){L[I].clearData(G._NODE_SELECTED);}return L;},NAME:"editorBidi",NS:"editorBidi",ATTRS:{host:{value:false}}});H.namespace("Plugin");H.Plugin.EditorBidi=G;H.Plugin.ExecCommand.COMMANDS.bidi=function(M,N){var L=this.getInstance(),K=new L.Selection(),J,P,I,O;L.Selection.filterBlocks();if(K.isCollapsed){P=G.blockParent(K.anchorNode);P.setAttribute(B,N);J=P;}else{I=K.getSelected();O=[];I.each(function(Q){if(!Q.test(D)){O.push(G.blockParent(Q));}});O=L.all(G.addParents(O));O.setAttribute(B,N);J=O;}this.get(C).get(C).editorBidi.checkForChange();return J;};},"@VERSION@",{skinnable:false,requires:["editor-base","selection"]});YUI.add("editor-para",function(F){var C=function(){C.superclass.constructor.apply(this,arguments);},B="host",D="body",A="nodeChange",E=D+" > p";F.extend(C,F.Base,{_fixFirstPara:function(){var G=this.get(B),I=G.getInstance(),H;I.one("body").setContent("<p>"+I.Selection.CURSOR+"</p>");H=new I.Selection();H.focusCursor(true,false);},_onNodeChange:function(M){var K=this.get(B),L=K.getInstance();switch(M.changedType){case"keydown":if(L.config.doc.childNodes.length<2){var G=L.config.doc.body.innerHTML;if(G&&G.length<5&&G.toLowerCase()=="<br>"){this._fixFirstPara();}}break;case"backspace-up":case"backspace-down":case"delete-up":if(!F.UA.ie){var N=L.all(E),I,J,H;J=L.one(D);if(N.item(0)){J=N.item(0);}I=J.one("br");if(I){I.removeAttribute("id");I.removeAttribute("class");}H=J.get("innerHTML");if(L.Selection.getText(J)===""&&!J.test("p")){this._fixFirstPara();}else{if(J.test("p")&&(H.length===0)||(H=="<span><br></span>")){M.changedEvent.frameEvent.halt();}}}break;}},_afterEditorReady:function(){var G=this.get(B),H=G.getInstance();if(H){H.Selection.filterBlocks();}},_afterContentChange:function(){var G=this.get(B),H=G.getInstance();if(H&&H.Selection){H.Selection.filterBlocks();}},_afterPaste:function(){var G=this.get(B),I=G.getInstance(),H=new I.Selection();F.later(50,G,function(){I.Selection.filterBlocks();});},initializer:function(){var G=this.get(B);G.on(A,F.bind(this._onNodeChange,this));G.after("ready",F.bind(this._afterEditorReady,this));G.after("contentChange",F.bind(this._afterContentChange,this));
if(F.Env.webkit){G.after("dom:paste",F.bind(this._afterPaste,this));}}},{NAME:"editorPara",NS:"editorPara",ATTRS:{host:{value:false}}});F.namespace("Plugin");F.Plugin.EditorPara=C;},"@VERSION@",{skinnable:false,requires:["editor-base","selection"]});YUI.add("editor",function(A){},"@VERSION@",{use:["frame","selection","exec-command","editor-base"],skinnable:false});