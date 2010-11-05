YUI.add("bewype-editor-config",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="bewype-editor-config";A.ATTRS={editorClass:{value:"bewype-editor-panel",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},activeButtons:{value:["height","width","padding-top","padding-right","padding-bottom","padding-left","bold","italic","underline","title","font-family","font-size","text-align","color","background-color","url","file","reset","apply"],writeOnce:true},spinnerLabelHeight:{value:"height",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},spinnerLabelWidth:{value:"width",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},spinnerMaxHeight:{value:480,writeOnce:true,validator:function(C){return B.Lang.isNumber(C);}},spinnerMaxWidth:{value:640,writeOnce:true,validator:function(C){return B.Lang.isNumber(C);}},spinnerLabelPaddingTop:{value:"padding-top",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},spinnerLabelPaddingRight:{value:"padding-right",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},spinnerLabelPaddingBottom:{value:"padding-bottom",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},spinnerLabelPaddingLeft:{value:"padding-left",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},fileStaticPath:{value:B.config.doc.location.href+"static/",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},uploadUrl:{value:B.config.doc.location.href+"upload",writeOnce:true},panelNode:{value:null,writeOnce:true},spinnerValues:{value:{}},selectionColor:{value:"#ddd",writeOnce:true,validator:function(C){return B.Lang.isString(C);}}};B.extend(A,B.Plugin.Base);B.namespace("Bewype");B.Bewype.EditorConfig=A;},"@VERSION@",{requires:["plugin"]});YUI.add("bewype-editor-panel",function(D){var B="",A="",C=null;B+='<div class="{editorClass} {buttonClass}">';B+="</div>";A+='<div class="{editorClass}">';A+="{label}";A+='<div class="{spinnerClass}"></div>';A+="</div>";C=function(E){C.superclass.constructor.apply(this,arguments);};C.NAME="bewype-editor-panel";C.NS="bewypeEditorPanel";D.extend(C,D.Bewype.EditorConfig,{_buttonDict:{},_editors:[],_spinnerButtons:["height","width","padding-top","padding-right","padding-bottom","padding-left"],_toggleButtons:["bold","italic","underline"],_pickerButtons:["title","font-family","font-size","text-align","color","background-color","url","file"],_pickerObjDict:{"background-color":D.Bewype.PickerColor,"color":D.Bewype.PickerColor,"file":D.Bewype.PickerFile,"font-family":D.Bewype.PickerFontFamily,"font-size":D.Bewype.PickerFontSize,"text-align":D.Bewype.PickerTextAlign,"title":D.Bewype.PickerTitle,"url":D.Bewype.PickerUrl},_tagButtons:["bold","italic","title","underline","url"],_cssButtons:["font-family","font-size","text-align","color","background-color"],_addSpinnerButton:function(E,F){var J=this.get("host"),I=this.get("editorClass")+"-button",G=this.get("editorClass")+"-spinner-"+E,L=null,K=null,H=F.spinnerValues[E],M=H?parseInt(H.replace(/px/i,""),10):0;L=new D.Node.create(D.substitute(A,{editorClass:I,label:this.get(D.Bewype.Utils.camelize("spinner-label-"+E)),spinnerClass:G}));J.append(L);K=new D.Bewype.EntrySpinner({srcNode:L.one("."+G),max:this.get(D.Bewype.Utils.camelize("spinner-max-"+E)),min:0,value:M});K.render();K.on("entry:onChange",D.bind(this._onSpinnerChange,this,E));this._buttonDict[E]=K;},__buttonFactory:function(G,F,J){var I=this.get("host"),K=this.get("editorClass"),L=null,E=null,H=null;L=new D.Node.create(D.substitute(B,{editorClass:K+"-button",buttonClass:K+"-button-"+G}));I.append(L);J.render(L);if(F==="button"){E="button:onClick";}else{E="button:onChange";}J.on(E,D.bind(this._onButtonChange,this,G));if(this._pickerButtons.indexOf(G)!=-1){H="button:onClick";J.before(H,D.bind(this._onButtonClick,this,G));}this._buttonDict[G]=J;},_addButton:function(E){var F=new D.Bewype.Button({label:E});this.__buttonFactory(E,"button",F);},_addToggleButton:function(E){var F=new D.Bewype.ButtonToggle({label:E});this.__buttonFactory(E,"toggle-button",F);},_addPickerButton:function(E,G){var F=new D.Bewype.ButtonPicker({label:E,pickerObj:G});this.__buttonFactory(E,"picker-button",F);},_initPanel:function(E){var F=this.get("activeButtons");D.Object.each(this._spinnerButtons,function(H,G){if(F.indexOf(H)!=-1){this._addSpinnerButton(H,E);}},this);this.updateSpinnerMaxWidth();D.Object.each(this._toggleButtons,function(H,G){if(F.indexOf(H)!=-1){this._addToggleButton(H);}},this);D.Object.each(this._pickerButtons,function(H,G){if(F.indexOf(H)!=-1){this._addPickerButton(H,this._pickerObjDict[H]);}},this);this._addButton("reset");this._addButton("apply");},initializer:function(E){this._initPanel(E);D.publish("bewype-editor:onClose");D.publish("bewype-editor:onChange");},destructor:function(){var E=this.get("host"),F=this.get("editorClass");D.Object.each(this.get("activeButtons"),function(H,G){this._buttonDict[H].destroy();delete (this._buttonDict[H]);},this);E.all("."+F+"-button").each(function(H,G){H.remove();});D.Object.each(this._editors,function(H,G){if(H.bewypeEditorTag){H.unplug(D.Bewype.EditorTag);}else{if(H.bewypeEditorText){H.unplug(D.Bewype.EditorText);}else{return;}}this.unRegisterEditor(H);},this);},registerEditor:function(E){if(this._editors.indexOf(E)==-1){this._editors.push(E);}},unRegisterEditor:function(E){var F=this._editors.indexOf(E);if(F!=-1){this._editors.splice(F,1);}},getWorkingTagName:function(F,G){switch(F){case"bold":return"b";case"italic":return"i";case"title":var H=this._buttonDict[F],E=G?H.getPrevious():H.getValue();return E==="normal"?null:E;case"underline":return"u";case"url":return"a";default:return"span";}},getButton:function(E){return this._buttonDict[E];},isCssButton:function(E){return this._cssButtons.indexOf(E)!=-1;},_getStyleValue:function(G,F){if(!G){return null;}else{if(F==="url"){return G.get("href");}else{var E=D.Bewype.Utils.getCssDict(G);return E[F];}}},refreshButtons:function(G,F,E){if(!G){return;
}var H=E?[E]:this.get("activeButtons");D.Object.each(H,function(K,J){if(this.get("activeButtons").indexOf(K)===-1){return;}var I=null;switch(K){case"bold":I=F?false:G.one("b")!==null;return this._buttonDict[K].setValue(I);case"italic":I=F?false:G.one("i")!==null;return this._buttonDict[K].setValue(I);case"underline":I=F?false:G.one("u")!==null;return this._buttonDict[K].setValue(I);case"file":this._buttonDict.height.setValue(G._node.height);this._buttonDict.width.setValue(G._node.width);return;case"font-family":case"font-size":case"color":case"background-color":I=F?false:this._getStyleValue(G,K);return this._buttonDict[K].setValue(I);case"url":I=F?false:this._getStyleValue(G,K);return this._buttonDict[K].setValue(I);}},this);},updateSpinnerMaxWidth:function(){var I=this.get("spinnerMaxWidth"),L=this._buttonDict["padding-left"],K=this._buttonDict["padding-right"],E=this._buttonDict.width,J=L?L.getValue():0,F=K?K.getValue():0,G=E?E.getValue():0,N=E?I-G-F:I,H=E?I-G-J:I,M=L?I-J-F:I;if(L){L.set("max",N);}if(E){E.set("max",M);}return{"padding-left":N,"padding-right":H,"width":M};},_onButtonClick:function(E,G){var F=this.get("activeButtons");D.Object.each(this._pickerButtons,function(I,H){if(F.indexOf(I)!=-1&&I!=E){this._buttonDict[I].hidePicker();}},this);D.each(this._editors,function(J,I){var H=J.bewypeEditorTag||J.bewypeEditorText;H.onButtonClick(E,G);});},_onButtonChange:function(E,G){if(E==="apply"){this.get("host").unplug(D.Bewype.EditorPanel);return D.fire("bewype-editor:onClose");}var F=false;D.each(this._editors,function(J,I){var H=J.bewypeEditorTag||J.bewypeEditorText;F|=H.onButtonChange(E,G);});return F?D.fire("bewype-editor:onChange"):null;},_onSpinnerChange:function(E,G){var F=false;D.each(this._editors,function(J,I){var H=J.bewypeEditorTag||J.bewypeEditorText;F|=H.onSpinnerChange(E,G);});return F?D.fire("bewype-editor:onChange"):null;}});D.augment(C,D.EventTarget);D.namespace("Bewype");D.Bewype.EditorPanel=C;},"@VERSION@",{requires:["bewype-button","bewype-entry-spinner","bewype-utils","dataschema","event-custom","json-stringify","bewype-editor-config"]});YUI.add("bewype-editor-base",function(B){var A=null;A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="bewype-editor-base";B.extend(A,B.Bewype.EditorConfig,{_panel:null,_init:function(E,D){var C=this.get("panelNode");if(!C.bewypeEditorPanel){E.spinnerValues=D;C.plug(B.Bewype.EditorPanel,E);C.bewypeEditorPanel.registerEditor(this.get("host"));}this._panel=C.bewypeEditorPanel;},initializer:function(C){},destructor:function(){},_hasLeftBlank:function(C){if(C.length===0){return false;}else{if(C.substring(0,1).trim().length===0){return true;}}return false;},_hasRightBlank:function(C){if(C.length===0){return false;}else{if(C.substring(C.length-1,C.length).trim().length===0){return true;}}return false;},getInnerHTML:function(F,D){var E=F._node?F._node:F,C=E.innerHTML,G="";G+=this._hasLeftBlank(C)?"&nbsp;":"";G+=C.trim();G+=this._hasRightBlank(C)?"&nbsp;":"";return D?G:G.trim()===""?null:new B.Node.create(G);},removeTagOrStyle:function(D,C,E){if(D&&D._node.innerHTML){D.all(C).each(function(H,G){var I=null,F=null,J=null;if(E){I=B.Bewype.Utils.getCssDict(H);if(I[E]){delete (I[E]);if(E==="background-color"){delete (I.display);}}B.Bewype.Utils.setCssDict(H,I);J=B.Object.keys(I).length;if(J!==0){return;}}F=this.getInnerHTML(H);if(!F){H.remove();}else{H.replace(F);}},this);}},updateStyle:function(E,D){var F=this._panel.getButton(D),C=F?F.getValue():null;if(C){E.setStyle(B.Bewype.Utils.camelize(D),C);}},resetStyle:function(E,D){B.Object.each(["h1","h2","h3","h4","span","a","b","i","u"],function(G,F){this.removeTagOrStyle(E,G);},this);if(!D){var C=B.Bewype.Utils.getCssDict(E);B.Object.each(this._panel.get("activeButtons"),function(G,F){if(this._panel._cssButtons.indexOf(G)!=-1){delete (C[G]);}},this);B.Bewype.Utils.setCssDict(E,C);}},onButtonClick:function(C,D){},onButtonChange:function(C,D){return false;},_onSpinnerChange:function(G,C,K){var J=this._panel.getButton(C),I=B.Bewype.Utils.getCssDict(G),F=I[C],D=F?parseInt(F.replace(/px/i,""),10):0,E=J?J.getValue():0,H=(C=="padding-left"||C=="padding-right")?E/2:E,M=J?this._panel.updateSpinnerMaxWidth():0,L=M[C];if(!J){return false;}if(L&&H>L){J.setValue(D);return false;}else{G.setStyle(B.Bewype.Utils.camelize(C),E+"px");return true;}},onSpinnerChange:function(D,C){return false;}});B.namespace("Bewype");B.Bewype.EditorBase=A;},"@VERSION@",{requires:["bewype-editor-panel"]});YUI.add("bewype-editor-tag",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="bewype-editor-tag";A.NS="bewypeEditorTag";A.ATTRS={};B.extend(A,B.Bewype.EditorBase,{_initSpinnerValues:function(){var F=this.get("host"),D=B.Bewype.Utils.getCssDict(F),H=null,G=B.Bewype.Utils.getHeight(F)+"px",E=B.Bewype.Utils.getWidth(F)+"px",C={};if(!B.Object.hasKey(D,"height")){D.height=G;}if(!B.Object.hasKey(D,"width")){D.width=E;}H=function(J,O){var N=J==="height",K=J==="width",M=J.split("-"),L=M.indexOf("border")!=-1,I=M.indexOf("padding")!=-1;if(N||K||L||I){C[J]=O;}return O;};B.JSON.stringify(D,B.bind(H,this));return C;},initializer:function(D){var C=this._initSpinnerValues();this._init(D,C);},onButtonClick:function(C,D){this._panel.refreshButtons(this.get("host"),false,C);},onButtonChange:function(C,H){var I=this.get("host"),D=I.get("tagName"),J=this._panel.getButton(C),K=J?J.getValue():null,G=(C==="file")?(this.get("fileStaticPath")+K):null,E=null,F=null;switch(C){case"cancel":break;case"file":if(D&&D.toLowerCase()==="img"){I.setAttribute("src",G);I.setStyle("height","");I.setStyle("width","");this._panel.refreshButtons(I,false,C);return true;}return false;default:break;}E=this._panel.getWorkingTagName(C,true);if(E){this.removeTagOrStyle(I,E,C);}E=this._panel.getWorkingTagName(C);if(K&&(K===true||K.trim()!=="")){if(this._panel.isCssButton(C)){I.setStyle(B.Bewype.Utils.camelize(C),K);}else{if(C==="url"){F=B.Node.create('<a href="'+K+'"></a>');}else{F=B.Node.create("<"+E+"></"+E+">");}F.append(this.getInnerHTML(I));
I.setContent(F);}}else{if(C==="reset"){this.resetStyle(I);this._panel.refreshButtons(I,true);}}return true;},onSpinnerChange:function(D,C){return this._onSpinnerChange(this.get("host"),D,C);}});B.namespace("Bewype");B.Bewype.EditorTag=A;},"@VERSION@",{requires:["bewype-editor-base"]});YUI.add("bewype-editor-text",function(C){var B="",A=null;B+='<div class="{editorClass}-place">';B+="</div>";A=function(D){A.superclass.constructor.apply(this,arguments);};A.NAME="bewype-editor-text";A.NS="bewypeEditorText";A.ATTRS={};C.extend(A,C.Bewype.EditorBase,{_editor:null,_oMainCssdict:{},_initEditor:function(){var E=this.get("host"),F=this.get("editorClass"),D=C.Bewype.Utils.getCssDict(E),H=null,G=new C.Node.create('<div><div class="main" /></div>');G.one(".main").append(this.getInnerHTML(E));E.set("innerHTML","");H=new C.Node.create(C.substitute(B,{editorClass:F}));E.append(H);this._editor=new C.EditorBase({content:G.get("innerHTML")});this._editor.render(H);this._editor.after("nodeChange",C.bind(this._onEditorChange,this));return D;},_initContent:function(F){var E=this.get("host"),G=this.get("editorClass")+"-place",K=E.one("."+G),I=this._editor.getInstance().one("body"),H=I.one(".main"),J=null,D={};I.setStyle("cssText","padding: 0; margin: 0; height: 100%; width: 100%;");J=function(M,P){var Q=["height","width"].indexOf(M)!=-1,O=M.split("-"),N=O.indexOf("border")!=-1,L=O.indexOf("padding")!=-1;if(Q||N||L){K.setStyle(C.Bewype.Utils.camelize(M),P);D[M]=P;}else{if(M){H.setStyle(C.Bewype.Utils.camelize(M),P);}}return P;};this._oMainCssdict.height="100%";this._oMainCssdict.width="100%";H.setStyle("height","100%");H.setStyle("width","100%");C.JSON.stringify(F,C.bind(J,this));E.setStyle("cssText","");return D;},initializer:function(F){var E=this._initEditor(),D=this._initContent(E);this._init(F,D);},destructor:function(){if(!this._editor){return;}var D=this.get("host"),G=this.get("editorClass"),F="."+G+"-place",K=D.one(F),I=this._editor.getInstance().one("body"),H=I.one(".main"),E=H.one(".selection"),J=null;this._editor.hide();if(E){E.replace(this.getInnerHTML(E));}D.set("innerHTML",H.get("innerHTML"));J=function(L,M,N){if(M){if(L==="content"&&(M.split("-").indexOf("padding")!=-1||M==="height"||M==="width")){}else{D.setStyle(C.Bewype.Utils.camelize(M),N);}}return N;};C.JSON.stringify(C.Bewype.Utils.getCssDict(K),C.bind(J,this,"place"));C.JSON.stringify(C.Bewype.Utils.getCssDict(H),C.bind(J,this,"content"));this._editor.destroy();},updateStyle:function(F){var H=this.get("host"),K=["height","width"].indexOf(F)!=-1,J=F.split("-"),D=J.indexOf("padding")!=-1,G=null,I=this._panel.getButton(F),E=I?I.getValue():null;if(K||D){G=H.one("."+this.get("editorClass")+"-place");}else{G=this._editor.getInstance().one(".main");}G.setStyle(C.Bewype.Utils.camelize(F),E);},_clearSelection:function(G,E,D){if(G.clear){G.clear();}else{if(G.removeAllRanges){E.detach();G.removeAllRanges();}else{return;}}if(D!==false){var F=this._editor.getInstance(),H=F.one("body").one(".main");this.removeTagOrStyle(H,".selection");}},_isFocusNodeFisrt:function(M){var F=this._editor.getInstance(),I=F.one("body").one(".main")._node,J=M.anchorNode,O=M.focusNode,E=M.anchorOffset,N=M.focusOffset,K=I.innerHTML?I.innerHTML:I.textContent,L=J.innerHTML?J.innerHTML:J.textContent,D=O.innerHTML?O.innerHTML:O.textContent,H=0,G=0;if(J==O){return N<E;}else{H=K.indexOf(L);G=K.indexOf(D);return G<H;}},_ensureRangeFirstNode:function(G,D,J){var F=this._editor.getInstance(),K=F.one("body").one(".main"),E=K._node,I=0;if(J.parentNode!=E){try{while(J.parentNode&&J.parentNode!=E){J=J.parentNode;I+=1;if(I==10){break;}}D.setStartBefore(J);}catch(H){return this._clearSelection(G,D);}}else{if(G.anchorOffset===0&&!G.anchorNode.previousSibling){D.setStart(E,0);}}return true;},_ensureRangeLastNode:function(G,D,J){var F=this._editor.getInstance(),K=F.one("body").one(".main"),E=K._node,I=0;if(J.parentNode!=E){try{while(J.parentNode&&J.parentNode!=E){J=J.parentNode;I+=1;if(I==10){break;}}D.setEndAfter(J);}catch(H){return this._clearSelection(G,D);}}return true;},_refreshSelectionNode:function(){var D=this._editor.getInstance(),E=D.one(".selection"),F=this.get("selectionColor");if(!E){return;}E.setStyle("backgroundColor",F);E.setStyle("display","inline-block");},_updateSelection:function(){var K=this.get("host"),G=this._editor.getInstance(),H=G.one("body"),D=H.one(".main"),F=D.one(".selection"),L=C.Bewype.Utils.getSelection(K),J=C.Bewype.Utils.getRange(L),M=null,E=null;if(!L.anchorNode||!L.focusNode){return this._clearSelection(L,J);}if(F){F.replace(this.getInnerHTML(F));}if(L.anchorNode!=L.focusNode||L.anchorOffset!=L.focusOffset){if(this._isFocusNodeFisrt(L)){M=L.focusNode;E=L.anchorNode;}else{M=L.anchorNode;E=L.focusNode;}if(!this._ensureRangeFirstNode(L,J,M)){return;}if(!this._ensureRangeLastNode(L,J,E)){return;}try{F=C.Node.create('<span class="selection"></span>');D.append(F);J.surroundContents(D.one(".selection")._node);}catch(I){return this._clearSelection(L,J);}this._clearSelection(L,J,false);}else{this.removeTagOrStyle(D,".selection");}this._panel.refreshButtons(F);this._refreshSelectionNode();},_onEditorChange:function(D){if(D.changedEvent.type=="dblclick"){}else{if(D.changedEvent.type=="mouseup"){this._updateSelection();}}},onButtonClick:function(D,G){var E=this._editor.getInstance(),F=E.one(".selection");this._panel.refreshButtons(F,false,D);},onButtonChange:function(E,K){var H=this._editor.getInstance(),I=H.one("body"),D=I.one(".main"),G=D.one(".selection"),M=this._panel.getButton(E),N=M?M.getValue():null,F=null,J=null,L=null;if(!G){if(this._panel.isCssButton(E)){this.updateStyle(E);return true;}else{if(E==="reset"){this.resetStyle(D);C.Bewype.Utils.setCssDict(D,this._oMainCssdict);return true;}}}else{F=this._panel.getWorkingTagName(E,true);if(F){this.removeTagOrStyle(G,F,E);}F=this._panel.getWorkingTagName(E);if(N&&(N===true||N.trim()!=="")){if(E==="url"){J=C.Node.create('<a href="'+N+'"></a>');}else{J=C.Node.create("<"+F+"></"+F+">");}if(this._panel.isCssButton(E)){J.setStyle(C.Bewype.Utils.camelize(E),N);
if(E==="background-color"){J.setStyle("display","inline-block");}}L=C.Node.create('<span class="selection"></span>');L.append(J);L.one(F).append(this.getInnerHTML(G));G.replace(L);}else{if(E==="reset"){this.resetStyle(G,true);this._panel.refreshButtons(G,true);}}this._refreshSelectionNode();return true;}return false;},onSpinnerChange:function(E,D){var F=this.get("host"),G=this.get("editorClass")+"-place",H=F.one("."+G);return this._onSpinnerChange(H,E,D);}});C.augment(A,C.EventTarget);C.namespace("Bewype");C.Bewype.EditorText=A;},"@VERSION@",{requires:["bewype-editor-base","editor"]});YUI.add("bewype-editor",function(A){},"@VERSION@",{use:["bewype-editor-config","bewype-editor-panel","bewype-editor-base","bewype-editor-tag","bewype-editor-text"]});