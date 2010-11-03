YUI.add("bewype-editor-text",function(C){var B="",A=null;B+='<div class="{editorClass}-place">';B+="</div>";A=function(D){A.superclass.constructor.apply(this,arguments);};A.NAME="bewype-editor-text";A.NS="bewypeEditorText";A.ATTRS={};C.extend(A,C.Bewype.EditorBase,{_editor:null,_oMainCssdict:{},_initEditor:function(){var E=this.get("host"),F=this.get("editorClass"),D=C.Bewype.Utils.getCssDict(E),H=null,G=new C.Node.create('<div><div class="main" /></div>');G.one(".main").append(this.getInnerHTML(E));E.set("innerHTML","");H=new C.Node.create(C.substitute(B,{editorClass:F}));E.append(H);this._editor=new C.EditorBase({content:G.get("innerHTML")});this._editor.render(H);this._editor.after("nodeChange",C.bind(this._onEditorChange,this));return D;},_initContent:function(F){var E=this.get("host"),G=this.get("editorClass")+"-place",K=E.one("."+G),I=this._editor.getInstance().one("body"),H=I.one(".main"),J=null,D={};I.setStyle("cssText","padding: 0; margin: 0; height: 100%; width: 100%;");J=function(M,P){var Q=["height","width"].indexOf(M)!=-1,O=M.split("-"),N=O.indexOf("border")!=-1,L=O.indexOf("padding")!=-1;if(Q||N||L){K.setStyle(C.Bewype.Utils.camelize(M),P);D[M]=P;}else{if(M){H.setStyle(C.Bewype.Utils.camelize(M),P);}}return P;};this._oMainCssdict.height="100%";this._oMainCssdict.width="100%";H.setStyle("height","100%");H.setStyle("width","100%");C.JSON.stringify(F,C.bind(J,this));E.setStyle("cssText","");return D;},initializer:function(F){var E=this._initEditor(),D=this._initContent(E);this._init(F,D);},destructor:function(){if(!this._editor){return;}var D=this.get("host"),G=this.get("editorClass"),F="."+G+"-place",K=D.one(F),I=this._editor.getInstance().one("body"),H=I.one(".main"),E=H.one(".selection"),J=null;this._editor.hide();if(E){E.replace(this.getInnerHTML(E));}D.set("innerHTML",H.get("innerHTML"));J=function(L,M,N){if(M){if(L==="content"&&(M.split("-").indexOf("padding")!=-1||M==="height"||M==="width")){}else{D.setStyle(C.Bewype.Utils.camelize(M),N);}}return N;};C.JSON.stringify(C.Bewype.Utils.getCssDict(K),C.bind(J,this,"place"));C.JSON.stringify(C.Bewype.Utils.getCssDict(H),C.bind(J,this,"content"));this._editor.destroy();this._destroy();},updateStyle:function(F){var H=this.get("host"),K=["height","width"].indexOf(F)!=-1,J=F.split("-"),D=J.indexOf("padding")!=-1,G=null,I=this._panel.getButton(F),E=I?I.getValue():null;if(K||D){G=H.one("."+this.get("editorClass")+"-place");}else{G=this._editor.getInstance().one(".main");}G.setStyle(C.Bewype.Utils.camelize(F),E);},_clearSelection:function(G,E,D){if(G.clear){G.clear();}else{if(G.removeAllRanges){E.detach();G.removeAllRanges();}else{return;}}if(D!==false){var F=this._editor.getInstance(),H=F.one("body").one(".main");this.removeTagOrStyle(H,".selection");}},_isFocusNodeFisrt:function(M){var F=this._editor.getInstance(),I=F.one("body").one(".main")._node,J=M.anchorNode,O=M.focusNode,E=M.anchorOffset,N=M.focusOffset,K=I.innerHTML?I.innerHTML:I.textContent,L=J.innerHTML?J.innerHTML:J.textContent,D=O.innerHTML?O.innerHTML:O.textContent,H=0,G=0;if(J==O){return N<E;}else{H=K.indexOf(L);G=K.indexOf(D);return G<H;}},_ensureRangeFirstNode:function(G,D,J){var F=this._editor.getInstance(),K=F.one("body").one(".main"),E=K._node,I=0;if(J.parentNode!=E){try{while(J.parentNode&&J.parentNode!=E){J=J.parentNode;I+=1;if(I==10){break;}}D.setStartBefore(J);}catch(H){return this._clearSelection(G,D);}}else{if(G.anchorOffset===0&&!G.anchorNode.previousSibling){D.setStart(E,0);}}return true;},_ensureRangeLastNode:function(G,D,J){var F=this._editor.getInstance(),K=F.one("body").one(".main"),E=K._node,I=0;if(J.parentNode!=E){try{while(J.parentNode&&J.parentNode!=E){J=J.parentNode;I+=1;if(I==10){break;}}D.setEndAfter(J);}catch(H){return this._clearSelection(G,D);}}return true;},_refreshSelectionNode:function(){var D=this._editor.getInstance(),E=D.one(".selection"),F=this.get("selectionColor");if(!E){return;}E.setStyle("backgroundColor",F);E.setStyle("display","inline-block");},_updateSelection:function(){var K=this.get("host"),G=this._editor.getInstance(),H=G.one("body"),D=H.one(".main"),F=D.one(".selection"),L=C.Bewype.Utils.getSelection(K),J=C.Bewype.Utils.getRange(L),M=null,E=null;if(!L.anchorNode||!L.focusNode){return this._clearSelection(L,J);}if(F){F.replace(this.getInnerHTML(F));}if(L.anchorNode!=L.focusNode||L.anchorOffset!=L.focusOffset){if(this._isFocusNodeFisrt(L)){M=L.focusNode;E=L.anchorNode;}else{M=L.anchorNode;E=L.focusNode;}if(!this._ensureRangeFirstNode(L,J,M)){return;}if(!this._ensureRangeLastNode(L,J,E)){return;}try{F=C.Node.create('<span class="selection"></span>');D.append(F);J.surroundContents(D.one(".selection")._node);}catch(I){return this._clearSelection(L,J);}this._clearSelection(L,J,false);}else{this.removeTagOrStyle(D,".selection");}this._panel.refreshButtons(F);this._refreshSelectionNode();},_onEditorChange:function(D){if(D.changedEvent.type=="dblclick"){}else{if(D.changedEvent.type=="mouseup"){this._updateSelection();}}},onButtonClick:function(D,G){var E=this._editor.getInstance(),F=E.one(".selection");this._panel.refreshButtons(F,false,D);},onButtonChange:function(E,K){switch(E){case"apply":this.get("host").unplug(C.Bewype.EditorText);C.fire("bewype-editor:onClose");return false;case"cancel":break;default:break;}var H=this._editor.getInstance(),I=H.one("body"),D=I.one(".main"),G=D.one(".selection"),M=this._panel.getButton(E),N=M?M.getValue():null,F=null,J=null,L=null;if(!G){if(this._panel.isCssButton(E)){this.updateStyle(E);return true;}else{if(E==="reset"){this.resetStyle(D,true);C.Bewype.Utils.setCssDict(D,this._oMainCssdict);return true;}}}else{F=this._panel.getWorkingTagName(E,true);if(F){this.removeTagOrStyle(G,F,E);}F=this._panel.getWorkingTagName(E);if(N&&(N===true||N.trim()!=="")){if(E==="url"){J=C.Node.create('<a href="'+N+'"></a>');}else{J=C.Node.create("<"+F+"></"+F+">");}if(this._panel.isCssButton(E)){J.setStyle(C.Bewype.Utils.camelize(E),N);if(E==="background-color"){J.setStyle("display","inline-block");}}L=C.Node.create('<span class="selection"></span>');
L.append(J);L.one(F).append(this.getInnerHTML(G));G.replace(L);}else{if(E==="reset"){this.resetStyle(G);this._panel.refreshButtons(G,true);}}this._refreshSelectionNode();return true;}return false;},onSpinnerChange:function(E,D){var F=this.get("host"),G=this.get("editorClass")+"-place",H=F.one("."+G);return this._onSpinnerChange(H,E,D);}});C.augment(A,C.EventTarget);C.namespace("Bewype");C.Bewype.EditorText=A;},"@VERSION@",{requires:["bewype-editor-base","editor"]});