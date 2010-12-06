YUI.add("bewype-entry-base",function(c){var a="",b=null;a+='<div class="{entryClass}">';a+=' <input class="{entryClass}-input" type="text" value="{value}"></input>';a+="</div>";b=function(d){b.superclass.constructor.apply(this,arguments);};b.NAME="entry";b.NS="entry";b.ATTRS={entryClass:{value:"bewype-entry-base",writeOnce:true,validator:function(d){return c.Lang.isString(d);}}};c.extend(b,c.Widget,{_value:null,_init:function(d){this.publish("entry:onChange");},initializer:function(d){this._init(d);},_renderBaseUI:function(){var f=this.get("contentBox"),e=this.get("entryClass"),d=null;d=new c.Node.create(c.substitute(a,{entryClass:e,value:this._value?this._value:""}));f.append(d);d.on("yui3-entry-event|blur",c.bind(this._onChange,this,null));},renderUI:function(){this._renderBaseUI();},bindUI:function(){},syncUI:function(){},_destroyBase:function(){var e=this.get("contentBox"),d=e.one("div");if(d){c.detach("yui3-entry-event|blur");d.remove();}},destructor:function(){this._destroyBase();},_onChange:function(d,e){var f=e?e.target:null;if(f){this._value=f.get("value");this.fire("entry:onChange");}},setValue:function(e){this._value=(e&&c.Bewype.Utils.trim(e)==="")?null:e;var f=this.get("contentBox"),d=f.one("input");if(d){d.set("value",this._value?this._value:"");}},getValue:function(){return this._value;}});c.augment(b,c.EventTarget);c.namespace("Bewype");c.Bewype.Entry=b;},"@VERSION@",{requires:["stylesheet","substitute","widget","yui-base"]});YUI.add("bewype-entry-spinner",function(c){var b=null,a=null;b='<button type="button"></button>';a=function(d){a.superclass.constructor.apply(this,arguments);};a.NAME="entry-spinner";a.NS="entrySpinner";a.ATTRS={min:{value:0},max:{value:100},value:{value:0,validator:function(d){return this._validateValue(d);}},minorStep:{value:1},majorStep:{value:10},strings:{value:{tooltip:"Press the arrow up/down keys for minor increments, page up/down for major increments.",increment:"Increment",decrement:"Decrement"}}};a.INPUT_CLASS=c.ClassNameManager.getClassName(a.NAME,"value");a.INPUT_TEMPLATE='<input type="text" class="'+a.INPUT_CLASS+'">';a.BTN_TEMPLATE='<button type="button"></button>';a.HTML_PARSER={value:function(d){var e=parseInt(d.get("value"),10);return c.Lang.isNumber(e)?e:null;}};c.extend(a,c.Widget,{initializer:function(){this.publish("entry:onChange");},destructor:function(){this._keyUpHandle.detach();this._mouseUpHandle.detach();this.inputNode=null;this.incrementNode=null;this.decrementNode=null;},renderUI:function(){this._renderInput();this._renderButtons();},bindUI:function(){this.after("valueChange",this._afterValueChange);var g=this.get("boundingBox"),f=c.bind(this._onKeyDown,this),h=c.bind(this._onKeyUp,this),d=c.bind(this._onMouseDown,this),j=c.bind(this._onMouseUp,this),e=g.get("ownerDocument"),i=(!c.UA.opera)?"down:":"press:";i+="38, 40, 33, 34";c.on("keydown",f,g,i);this._keyUpHandle=c.on("keyup",h,e);c.on("mousedown",d,g);this._mouseUpHandle=c.on("mouseup",j,e);c.on("change",c.bind(this._onInputChange,this),this.inputNode);},syncUI:function(){this._uiSetValue(this.get("value"));},_renderInput:function(){var e=this.get("contentBox"),f=e.one("."+a.INPUT_CLASS),d=this.get("strings");if(!f){f=c.Node.create(a.INPUT_TEMPLATE);e.appendChild(f);}f.set("title",d.tooltip);this.inputNode=f;},_renderButtons:function(){var e=this.get("contentBox"),d=this.get("strings"),f=this._createButton(d.increment,this.getClassName("increment")),g=this._createButton(d.decrement,this.getClassName("decrement"));this.incrementNode=e.appendChild(f);this.decrementNode=e.appendChild(g);},_createButton:function(f,e){var d=c.Node.create(a.BTN_TEMPLATE);d.set("innerHTML",f);d.set("title",f);d.addClass(e);return d;},_onMouseDown:function(j){var h=j.target,d=null,i=false,g=this.get("value"),f=this.get("minorStep");if(h.hasClass(this.getClassName("increment"))){this.set("value",g+f);d=1;i=true;}else{if(h.hasClass(this.getClassName("decrement"))){this.set("value",g-f);d=-1;i=true;}}if(i){this._setMouseDownTimers(d,f);}},_defaultCB:function(){return null;},_onKeyUp:function(d){this._clearKeyDownTimers();},_onMouseUp:function(d){this._clearMouseDownTimers();},_onKeyDown:function(l){var i=this.get("value"),f=i,k=false,h=null,d=null,g=this.get("minorStep"),j=this.get("majorStep");switch(l.charCode){case 38:f+=g;k=true;h=g;d=1;break;case 40:f-=g;k=true;h=g;d=-1;break;case 33:f+=j;f=Math.min(f,this.get("max"));k=true;h=j;d=1;break;case 34:f-=j;f=Math.max(f,this.get("min"));k=true;h=j;d=-1;break;}if(f!==i){this.set("value",f);}if(k){this._setKeyDownTimers(d,h);}},_onInputChange:function(f){var d=parseInt(this.inputNode.get("value"),10);if(this._validateValue(d)){this.set("value",d);}else{this.inputNode.set("value",this.get("value"));}},_setKeyDownTimers:function(d,e){this._keyDownTimer=c.later(500,this,function(){this._keyPressTimer=c.later(100,this,function(){this.set("value",this.get("value")+(d*e));},null,true);});},_setMouseDownTimers:function(d,e){this._mouseDownTimer=c.later(500,this,function(){this._mousePressTimer=c.later(100,this,function(){this.set("value",this.get("value")+(d*e));},null,true);});},_clearKeyDownTimers:function(){if(this._keyDownTimer){this._keyDownTimer.cancel();this._keyDownTimer=null;}if(this._keyPressTimer){this._keyPressTimer.cancel();this._keyPressTimer=null;}},_clearMouseDownTimers:function(){if(this._mouseDownTimer){this._mouseDownTimer.cancel();this._mouseDownTimer=null;}if(this._mousePressTimer){this._mousePressTimer.cancel();this._mousePressTimer=null;}},_afterValueChange:function(d){this._uiSetValue(d.newVal);this.fire("entry:onChange");},_uiSetValue:function(d){this.inputNode.set("value",d);},_validateValue:function(f){var e=this.get("min"),d=this.get("max");return(c.Lang.isNumber(f)&&f>=e&&f<=d);},getValue:function(){return this.get("value");},setValue:function(d){this.set("value",d);}});c.namespace("Bewype");c.Bewype.EntrySpinner=a;},"@VERSION@",{requires:["event-key","widget"]});YUI.add("bewype-entry",function(a){},"@VERSION@",{use:["bewype-entry-base","bewype-entry-spinner"]});
