YUI.add("bewype-editor-config",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="bewype-editor-config";a.ATTRS={editorClass:{value:"bewype-editor-panel",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},activeButtons:{value:["height","width","padding-top","padding-right","padding-bottom","padding-left","bold","italic","underline","title","font-family","font-size","text-align","color","background-color","url","file","reset","apply"],writeOnce:true},spinnerLabelHeight:{value:"height",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},spinnerLabelWidth:{value:"width",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},spinnerMaxHeight:{value:480,writeOnce:true,validator:function(c){return b.Lang.isNumber(c);}},spinnerMaxWidth:{value:640,writeOnce:true,validator:function(c){return b.Lang.isNumber(c);}},spinnerLabelPaddingTop:{value:"padding-top",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},spinnerLabelPaddingRight:{value:"padding-right",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},spinnerLabelPaddingBottom:{value:"padding-bottom",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},spinnerLabelPaddingLeft:{value:"padding-left",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},fileStaticPath:{value:"http://www.bewype.org/uploads/",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},uploadUrl:{value:"http://www.bewype.org/upload",writeOnce:true},panelNode:{value:null,writeOnce:true},spinnerValues:{value:{}},selectionColor:{value:"#ddd",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},panelPosition:{value:"left",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},panelOffsetY:{value:50,writeOnce:true,validator:function(c){return b.Lang.isNumber(c);}},panelOffsetX:{value:50,writeOnce:true,validator:function(c){return b.Lang.isNumber(c);}},panelPadding:{value:10,writeOnce:true,validator:function(c){return b.Lang.isNumber(c);}},pickerColorSize:{value:180,writeOnce:true,validator:function(c){return b.Lang.isNumber(c);}}};b.extend(a,b.Plugin.Base);b.namespace("Bewype");b.Bewype.EditorConfig=a;},"@VERSION@",{requires:["plugin"]});YUI.add("bewype-editor-panel",function(d){var b="",a="",c=null;b+='<div class="{editorClass} {buttonClass}">';b+="</div>";a+='<div class="{editorClass} {buttonClass}">';a+='<div class="{editorClass}-label {buttonClass}-label">{label}</div>';a+='<div class="{spinnerClass}"></div>';a+="</div>";c=function(e){c.superclass.constructor.apply(this,arguments);};c.NAME="bewype-editor-panel";c.NS="bewypeEditorPanel";d.extend(c,d.Bewype.EditorConfig,{_buttonDict:{},_editors:[],_spinnerButtons:["height","width","padding-top","padding-right","padding-bottom","padding-left"],_toggleButtons:["bold","italic","underline"],_pickerButtons:["title","font-family","font-size","text-align","color","background-color","url","file"],_pickerObjDict:{"background-color":d.Bewype.PickerColor,"color":d.Bewype.PickerColor,"file":d.Bewype.PickerFile,"font-family":d.Bewype.PickerFontFamily,"font-size":d.Bewype.PickerFontSize,"text-align":d.Bewype.PickerTextAlign,"title":d.Bewype.PickerTitle,"url":d.Bewype.PickerUrl},_tagButtons:["bold","italic","title","underline","url"],_cssButtons:["font-family","font-size","text-align","color","background-color","padding-top","padding-right","padding-bottom","padding-left"],_addSpinnerButton:function(e,f){var j=this.get("host"),i=this.get("editorClass")+"-button",g=this.get("editorClass")+"-spinner-"+e,l=null,k=null,h=f.spinnerValues[e],m=h?parseInt(h.replace(/px/i,""),10):0;l=new d.Node.create(d.substitute(a,{editorClass:i,buttonClass:i+"-button-"+e,label:this.get(d.Bewype.Utils.camelize("spinner-label-"+e)),spinnerClass:g}));j.append(l);k=new d.Bewype.EntrySpinner({srcNode:l.one("."+g),max:this.get(d.Bewype.Utils.camelize("spinner-max-"+e)),min:0,value:m});k.render();k.on("entry:onChange",d.bind(this._onSpinnerChange,this,e));this._buttonDict[e]=k;return{height:d.Bewype.Utils.getHeight(l),width:d.Bewype.Utils.getWidth(l)};},__buttonFactory:function(g,f,j){var i=this.get("host"),k=this.get("editorClass"),l=null,e=null,h=null;l=new d.Node.create(d.substitute(b,{editorClass:k+"-button",buttonClass:k+"-button-"+g}));i.append(l);j.render(l);if(f==="button"){e="button:onClick";}else{e="button:onChange";}j.on(e,d.bind(this._onButtonChange,this,g));if(this._pickerButtons.indexOf(g)!=-1){h="button:onClick";j.before(h,d.bind(this._onButtonClick,this,g));}this._buttonDict[g]=j;return{height:d.Bewype.Utils.getHeight(l),width:d.Bewype.Utils.getWidth(l)};},_addButton:function(e){var f=new d.Bewype.Button({label:e});return this.__buttonFactory(e,"button",f);},_addToggleButton:function(e){var f=new d.Bewype.ButtonToggle({label:e});return this.__buttonFactory(e,"toggle-button",f);},_addPickerButton:function(f,h){var e=f==="background-color"||f==="color",i={fileStaticPath:f==="file"?this.get("fileStaticPath"):null,uploadUrl:f==="file"?this.get("uploadUrl"):null,pickerSize:e?this.get("pickerColorSize"):null},g=new d.Bewype.ButtonPicker({label:f,pickerObj:h,pickerParams:i,pickerPosition:this.get("panelPosition")});return this.__buttonFactory(f,"picker-button",g);},_initPanel:function(f){var m=this.get("host"),k=this.get("editorClass"),j=this.get("panelPosition"),i=this.get("panelOffsetX"),h=this.get("panelOffsetY"),e=this.get("activeButtons"),l=null,n=this.get("panelPadding"),o=0,g=0;d.Object.each(this._spinnerButtons,function(q,p){var r=null;if(e.indexOf(q)!=-1){r=this._addSpinnerButton(q,f);o+=r.height+4;g+=r.width+4;}},this);this.updateSpinnerMaxWidth();d.Object.each(this._toggleButtons,function(q,p){var r=null;if(e.indexOf(q)!=-1){r=this._addToggleButton(q);o+=r.height+4;g+=r.width+4;}},this);d.Object.each(this._pickerButtons,function(q,p){var r=null;if(e.indexOf(q)!=-1){r=this._addPickerButton(q,this._pickerObjDict[q]);o+=r.height+4;g+=r.width+4;}},this);l=this._addButton("reset");o+=l.height;
g+=l.width;l=this._addButton("apply");o+=l.height;g+=l.width;o+=n;g+=n;m.addClass(k);m.addClass(k+"-"+j);m.setStyle("display","block");m.setStyle(j,i);m.setStyle("top",h);if(j==="left"||j==="right"){m.setStyle("height",o);}else{m.setStyle("width",g);}},initializer:function(e){this._initPanel(e);d.publish("bewype-editor:onClose");d.publish("bewype-editor:onChange");},destructor:function(){var e=this.get("host"),f=this.get("editorClass"),g=this.get("panelPosition");e.removeClass(f);e.removeClass(f+"-"+g);e.setStyle("display","none");d.Object.each(this.get("activeButtons"),function(i,h){this._buttonDict[i].destroy();delete (this._buttonDict[i]);},this);e.all("."+f+"-button").each(function(i,h){i.remove();});d.Object.each(this._editors,function(i,h){if(i.bewypeEditorTag){i.unplug(d.Bewype.EditorTag);}else{if(i.bewypeEditorText){i.unplug(d.Bewype.EditorText);}else{return;}}this.unRegisterEditor(i);},this);},registerEditor:function(e){if(this._editors.indexOf(e)==-1){this._editors.push(e);}},unRegisterEditor:function(e){var f=this._editors.indexOf(e);if(f!=-1){this._editors.splice(f,1);}},getWorkingTagName:function(f,g){switch(f){case"bold":return"b";case"italic":return"i";case"title":var h=this._buttonDict[f],e=g?h.getPrevious():h.getValue();return e==="normal"?null:e;case"underline":return"u";case"url":return"a";default:return"span";}},getButton:function(e){return this._buttonDict[e];},isCssButton:function(e){return this._cssButtons.indexOf(e)!=-1;},_getStyleValue:function(g,f){if(!g){return null;}else{if(f==="url"){return g.get("href");}else{var e=d.Bewype.Utils.getCssDict(g);return e[f];}}},refreshButtons:function(g,f,e){if(!g){return;}var h=e?[e]:this.get("activeButtons");d.Object.each(h,function(l,j){if(this.get("activeButtons").indexOf(l)===-1){return;}var i=null;switch(l){case"bold":i=f?false:g.one("b")!==null;return this._buttonDict[l].setValue(i);case"italic":i=f?false:g.one("i")!==null;return this._buttonDict[l].setValue(i);case"underline":i=f?false:g.one("u")!==null;return this._buttonDict[l].setValue(i);case"file":if(this._buttonDict.height){this._buttonDict.height.setValue(g._node.height);}if(this._buttonDict.width){this._buttonDict.width.setValue(g._node.width);}return;case"font-family":case"font-size":case"color":case"background-color":i=f?false:this._getStyleValue(g,l);return this._buttonDict[l].setValue(i);case"url":i=f?false:this._getStyleValue(g,l);return this._buttonDict[l].setValue(i);}},this);},updateSpinnerMaxWidth:function(){var i=this.get("spinnerMaxWidth"),l=this._buttonDict["padding-left"],k=this._buttonDict["padding-right"],e=this._buttonDict.width,j=l?l.getValue():0,f=k?k.getValue():0,g=e?e.getValue():0,n=e?i-g-f:i,h=e?i-g-j:i,m=e?i-j-f:i;if(l){l.set("max",n);}if(e){e.set("max",m);}if(k){k.set("max",h);}return{"padding-left":n,"padding-right":h,"width":m};},_onButtonClick:function(f,h){var g=this.get("activeButtons");d.Object.each(this._pickerButtons,function(i,e){if(g.indexOf(i)!=-1&&i!=f){this._buttonDict[i].hidePicker();}},this);d.each(this._editors,function(j,i){var e=j.bewypeEditorTag||j.bewypeEditorText;e.onButtonClick(f,h);});},_onButtonChange:function(f,h){if(f==="apply"){this.get("host").unplug(d.Bewype.EditorPanel);return d.fire("bewype-editor:onClose");}var g=false;d.each(this._editors,function(j,i){var e=j.bewypeEditorTag||j.bewypeEditorText;g|=e.onButtonChange(f,h);});return g?d.fire("bewype-editor:onChange"):null;},_onSpinnerChange:function(f,h){var g=false;d.each(this._editors,function(j,i){var e=j.bewypeEditorTag||j.bewypeEditorText;g|=e.onSpinnerChange(f,h);});return g?d.fire("bewype-editor:onChange"):null;}});d.augment(c,d.EventTarget);d.namespace("Bewype");d.Bewype.EditorPanel=c;},"@VERSION@",{requires:["bewype-button","bewype-entry-spinner","bewype-utils","dataschema","event-custom","json-stringify","bewype-editor-config"]});YUI.add("bewype-editor-base",function(b){var a=null;a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="bewype-editor-base";b.extend(a,b.Bewype.EditorConfig,{_panel:null,_init:function(e,d){var c=this.get("panelNode");if(!c.bewypeEditorPanel){e.spinnerValues=d;c.plug(b.Bewype.EditorPanel,e);c.bewypeEditorPanel.registerEditor(this.get("host"));}this._panel=c.bewypeEditorPanel;},initializer:function(c){},destructor:function(){},_hasLeftBlank:function(c){if(c.length===0){return false;}else{if(c.substring(0,1).trim().length===0){return true;}}return false;},_hasRightBlank:function(c){if(c.length===0){return false;}else{if(c.substring(c.length-1,c.length).trim().length===0){return true;}}return false;},getInnerHTML:function(f,d){var e=f._node?f._node:f,c=e.innerHTML,g="";g+=this._hasLeftBlank(c)?"&nbsp;":"";g+=c.trim();g+=this._hasRightBlank(c)?"&nbsp;":"";return d?g:g.trim()===""?null:new b.Node.create(g);},removeTagOrStyle:function(d,c,e){if(d&&d._node.innerHTML){d.all(c).each(function(h,g){var i=null,f=null,j=null;if(e){i=b.Bewype.Utils.getCssDict(h);if(i[e]){delete (i[e]);if(e==="background-color"){delete (i.display);}}b.Bewype.Utils.setCssDict(h,i);j=b.Object.keys(i).length;if(j!==0){return;}}f=this.getInnerHTML(h);if(!f){h.remove();}else{h.replace(f);}},this);}},updateStyle:function(e,d){var f=this._panel.getButton(d),c=f?f.getValue():null;if(c){e.setStyle(b.Bewype.Utils.camelize(d),c);}},resetStyle:function(e,d){b.Object.each(["h1","h2","h3","h4","span","a","b","i","u"],function(g,f){this.removeTagOrStyle(e,g);},this);if(!d){var c=b.Bewype.Utils.getCssDict(e);b.Object.each(this._panel.get("activeButtons"),function(g,f){if(this._panel._cssButtons.indexOf(g)!=-1){delete (c[g]);}},this);b.Bewype.Utils.setCssDict(e,c);}},onButtonClick:function(c,d){},onButtonChange:function(c,d){return false;},_onSpinnerChange:function(g,c,k){var j=this._panel.getButton(c),i=b.Bewype.Utils.getCssDict(g),f=i[c],d=f?parseInt(f.replace(/px/i,""),10):0,e=j?j.getValue():0,h=(c==="padding-left"||c==="padding-right")?e/2:e,m=j?this._panel.updateSpinnerMaxWidth():0,l=m[c];if(!j){return false;}if(l&&h>l){j.setValue(d);return false;}else{g.setStyle(b.Bewype.Utils.camelize(c),e+"px");
return true;}},onSpinnerChange:function(d,c){return false;}});b.namespace("Bewype");b.Bewype.EditorBase=a;},"@VERSION@",{requires:["bewype-editor-panel"]});YUI.add("bewype-editor-tag",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="bewype-editor-tag";a.NS="bewypeEditorTag";a.ATTRS={};b.extend(a,b.Bewype.EditorBase,{_initSpinnerValues:function(){var f=this.get("host"),d=b.Bewype.Utils.getCssDict(f),h=null,g=b.Bewype.Utils.getHeight(f)+"px",e=b.Bewype.Utils.getWidth(f)+"px",c={};if(!b.Object.hasKey(d,"height")){d.height=g;}if(!b.Object.hasKey(d,"width")){d.width=e;}h=function(j,o){var n=j==="height",k=j==="width",m=j.split("-"),l=m.indexOf("border")!=-1,i=m.indexOf("padding")!=-1;if(n||k||l||i){c[j]=o;}return o;};b.JSON.stringify(d,b.bind(h,this));return c;},initializer:function(d){var c=this._initSpinnerValues();this._init(d,c);},onButtonClick:function(c,d){this._panel.refreshButtons(this.get("host"),false,c);},onButtonChange:function(c,h){var i=this.get("host"),j=i.one("img"),k=this._panel.getButton(c),l=k?k.getValue():null,g=(c==="file")?(this.get("fileStaticPath")+l.fileName):null,d=null,f=null;switch(c){case"cancel":break;case"file":if(j){j.setAttribute("src",g);j.setStyle("height",l.imgHeight);j.setStyle("width",l.imgWidth);if(l.imgHeight>b.Bewype.Utils.getHeight(i)){i.setStyle("height",l.imgHeight);}if(l.imgWidth>b.Bewype.Utils.getWidth(i)){i.setStyle("width",l.imgWidth);}this._panel.refreshButtons(i,false,c);return true;}return false;default:break;}d=this._panel.getWorkingTagName(c,true);if(d){this.removeTagOrStyle(i,d,c);}d=this._panel.getWorkingTagName(c);if(l&&(l===true||l.trim()!=="")){if(this._panel.isCssButton(c)){i.setStyle(b.Bewype.Utils.camelize(c),l);}else{if(c==="url"){f=b.Node.create('<a href="'+l+'"></a>');}else{f=b.Node.create("<"+d+"></"+d+">");}f.append(this.getInnerHTML(i));i.setContent(f);}}else{if(c==="reset"){this.resetStyle(i);this._panel.refreshButtons(i,true);}}return true;},onSpinnerChange:function(d,c){return this._onSpinnerChange(this.get("host"),d,c);}});b.namespace("Bewype");b.Bewype.EditorTag=a;},"@VERSION@",{requires:["bewype-editor-base"]});YUI.add("bewype-editor-text",function(c){var b="",d="",a=null;b+='<div class="{editorClass}-place">';b+="</div>";d+='<img src="{filePath}" />';a=function(e){a.superclass.constructor.apply(this,arguments);};a.NAME="bewype-editor-text";a.NS="bewypeEditorText";a.ATTRS={};c.extend(a,c.Bewype.EditorBase,{_editor:null,_oMainCssdict:{},_initEditor:function(){var g=this.get("host"),h=this.get("editorClass"),f=c.Bewype.Utils.getCssDict(g),e=g.get("innerHTML"),i=null;g.set("innerHTML","");i=new c.Node.create(c.substitute(b,{editorClass:h}));g.append(i);this._editor=new c.EditorBase({content:e});this._editor.render(i);this._editor.after("nodeChange",c.bind(this._onEditorChange,this));return f;},_initContent:function(h){var f=this.get("host"),i=this.get("editorClass")+"-place",l=f.one("."+i),g=this._editor.getInstance(),j=g.one("body"),k=null,e={};k=function(n,q){var r=["height","width"].indexOf(n)!=-1,p=n.split("-"),o=p.indexOf("border")!=-1,m=p.indexOf("padding")!=-1;if(r||o||m){l.setStyle(c.Bewype.Utils.camelize(n),q);e[n]=q;}else{if(n){j.setStyle(c.Bewype.Utils.camelize(n),q);}}return q;};this._oMainCssdict.height="100%";this._oMainCssdict.width="100%";this._oMainCssdict.padding="0";this._oMainCssdict.margin="0";c.each(["iframe","html","body"],function(n,m){var o=f.one(n)||g.one(n);o.setStyle("cssText","padding: 0px; margin: 0px; height: 100%; width: 100%;");});c.JSON.stringify(h,c.bind(k,this));f.setStyle("cssText","");return e;},initializer:function(g){var f=this._initEditor(),e=this._initContent(f);this._init(g,e);},destructor:function(){if(!this._editor){return;}var e=this.get("host"),h=this.get("editorClass"),g="."+h+"-place",k=e.one(g),i=this._editor.getInstance().one("body"),f=i.one(".selection"),j=null;this._editor.hide();if(f){f.replace(this.getInnerHTML(f));}e.set("innerHTML",i.get("innerHTML"));j=function(l,m,n){if(m){if(l==="content"&&(m.split("-").indexOf("padding")!=-1||m==="height"||m==="width")){}else{e.setStyle(c.Bewype.Utils.camelize(m),n);}}return n;};c.JSON.stringify(c.Bewype.Utils.getCssDict(k),c.bind(j,this,"place"));c.JSON.stringify(c.Bewype.Utils.getCssDict(i),c.bind(j,this,"content"));this._editor.destroy();},updateStyle:function(g){var i=this.get("host"),l=["height","width"].indexOf(g)!=-1,k=g.split("-"),e=k.indexOf("padding")!=-1,h=null,j=this._panel.getButton(g),f=j?j.getValue():null;if(l||e){h=i.one("."+this.get("editorClass")+"-place");}else{h=this._editor.getInstance().one("body");}h.setStyle(c.Bewype.Utils.camelize(g),f);},_clearSelection:function(h,f,e){if(h.clear){h.clear();}else{if(h.removeAllRanges){f.detach();h.removeAllRanges();}else{return;}}if(e!==false){var g=this._editor.getInstance(),i=g.one("body");this.removeTagOrStyle(i,".selection");}},_isFocusNodeFisrt:function(n){var g=this._editor.getInstance(),j=g.one("body")._node,k=n.anchorNode,p=n.focusNode,f=n.anchorOffset,o=n.focusOffset,l=j.innerHTML?j.innerHTML:j.textContent,m=k.innerHTML?k.innerHTML:k.textContent,e=p.innerHTML?p.innerHTML:p.textContent,i=0,h=0;if(k==p){return o<f;}else{i=l.indexOf(m);h=l.indexOf(e);return h<i;}},_ensureRangeFirstNode:function(h,e,l){var g=this._editor.getInstance(),f=g.one("body")._node,j=0,k=null;if(l.parentNode!=f){try{while(l.parentNode&&l.parentNode!=f){l=l.parentNode;j+=1;if(j==10){break;}}e.setStartBefore(l);}catch(i){k=i;return this._clearSelection(h,e);}}else{if(h.anchorOffset===0&&!h.anchorNode.previousSibling){e.setStart(f,0);}}return true;},_ensureRangeLastNode:function(h,e,k){var g=this._editor.getInstance(),f=g.one("body")._node,j=0,l=null;if(k.parentNode!=f){try{while(k.parentNode&&k.parentNode!=f){k=k.parentNode;j+=1;if(j==10){break;}}e.setEndAfter(k);}catch(i){l=i;return this._clearSelection(h,e);}}return true;},_refreshSelectionNode:function(){var e=this._editor.getInstance(),f=e.one(".selection"),g=this.get("selectionColor");if(!f){return;}f.setStyle("backgroundColor",g);
f.setStyle("display","inline-block");},_updateSelection:function(){var k=this.get("host"),g=this._editor.getInstance(),h=g.one("body"),f=h.one(".selection"),l=c.Bewype.Utils.getSelection(k),j=c.Bewype.Utils.getRange(l),m=null,e=null;if(!l.anchorNode||!l.focusNode){return this._clearSelection(l,j);}if(f){f.replace(this.getInnerHTML(f));}if(l.anchorNode!=l.focusNode||l.anchorOffset!=l.focusOffset){if(this._isFocusNodeFisrt(l)){m=l.focusNode;e=l.anchorNode;}else{m=l.anchorNode;e=l.focusNode;}if(!this._ensureRangeFirstNode(l,j,m)){return;}if(!this._ensureRangeLastNode(l,j,e)){return;}try{f=c.Node.create('<span class="selection"></span>');h.append(f);j.surroundContents(h.one(".selection")._node);}catch(i){return this._clearSelection(l,j);}this._clearSelection(l,j,false);}else{this.removeTagOrStyle(h,".selection");}this._panel.refreshButtons(f);this._refreshSelectionNode();},_insertNodeToSelection:function(i){var f=this.get("host"),h=this._editor.getInstance(),k=h.one("body"),l=c.Bewype.Utils.getWindow(f),e=c.Bewype.Utils.getDocument(f),g=null,j=null;if(l._node.getSelection){g=l._node.getSelection();if(g.rangeCount>0){j=g.getRangeAt(0);k.append(i);j.insertNode(i._node);}}else{j=e._node.selection.createRange();j.collapse(true);j.pasteHTML(i._node);}},_onEditorChange:function(f){if(f.changedEvent.type==="dblclick"){}else{if(f.changedEvent.type==="mouseup"){this._updateSelection();}}},onButtonClick:function(f,i){var g=this._editor.getInstance(),h=g.one(".selection");this._panel.refreshButtons(h,false,f);},onButtonChange:function(f,l){var i=this._editor.getInstance(),j=i.one("body"),h=j.one(".selection"),o=this._panel.getButton(f),p=o?o.getValue():null,m=null,g=null,k=null,n=null;if(!h){if(this._panel.isCssButton(f)){this.updateStyle(f);return true;}else{if(f==="file"){m=c.Node.create(c.substitute(d,{filePath:this.get("fileStaticPath")+p.fileName}));this._insertNodeToSelection(m);return true;}else{if(f==="reset"){this.resetStyle(j);c.Bewype.Utils.setCssDict(j,this._oMainCssdict);return true;}}}}else{if(f==="file"){}else{g=this._panel.getWorkingTagName(f,true);if(g){this.removeTagOrStyle(h,g,f);}g=this._panel.getWorkingTagName(f);if(g&&p&&(p===true||p.trim()!=="")){if(f==="url"){k=c.Node.create('<a href="'+p+'"></a>');}else{k=c.Node.create("<"+g+"></"+g+">");}if(this._panel.isCssButton(f)){k.setStyle(c.Bewype.Utils.camelize(f),p);if(f==="background-color"){k.setStyle("display","inline-block");}}n=c.Node.create('<span class="selection"></span>');n.append(k);n.one(g).append(this.getInnerHTML(h));h.replace(n);}else{if(f==="reset"){this.resetStyle(h,true);this._panel.refreshButtons(h,true);}}this._refreshSelectionNode();return true;}}return false;},onSpinnerChange:function(f,e){var g=this.get("host"),h=this.get("editorClass")+"-place",i=g.one("."+h);return this._onSpinnerChange(i,f,e);}});c.augment(a,c.EventTarget);c.namespace("Bewype");c.Bewype.EditorText=a;},"@VERSION@",{requires:["bewype-editor-base","editor"]});YUI.add("bewype-editor",function(a){},"@VERSION@",{use:["bewype-editor-config","bewype-editor-panel","bewype-editor-base","bewype-editor-tag","bewype-editor-text"]});