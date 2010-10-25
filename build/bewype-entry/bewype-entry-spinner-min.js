YUI.add("bewype-entry-spinner",function(C){var B=null,A=null;B='<button type="button"></button>';A=function(D){A.superclass.constructor.apply(this,arguments);};A.NAME="entry-spinner";A.NS="entrySpinner";A.ATTRS={min:{value:0},max:{value:100},value:{value:0,validator:function(D){return this._validateValue(D);}},minorStep:{value:1},majorStep:{value:10},strings:{value:{tooltip:"Press the arrow up/down keys for minor increments, page up/down for major increments.",increment:"Increment",decrement:"Decrement"}}};A.INPUT_CLASS=C.ClassNameManager.getClassName(A.NAME,"value");A.INPUT_TEMPLATE='<input type="text" class="'+A.INPUT_CLASS+'">';A.BTN_TEMPLATE='<button type="button"></button>';A.HTML_PARSER={value:function(D){var E=parseInt(D.get("value"),10);return C.Lang.isNumber(E)?E:null;}};C.extend(A,C.Widget,{initializer:function(){this.publish("entry:onChange");},destructor:function(){this._keyUpHandle.detach();this._mouseUpHandle.detach();this.inputNode=null;this.incrementNode=null;this.decrementNode=null;},renderUI:function(){this._renderInput();this._renderButtons();},bindUI:function(){this.after("valueChange",this._afterValueChange);var G=this.get("boundingBox"),F=C.bind(this._onKeyDown,this),H=C.bind(this._onKeyUp,this),D=C.bind(this._onMouseDown,this),J=C.bind(this._onMouseUp,this),E=G.get("ownerDocument"),I=(!C.UA.opera)?"down:":"press:";I+="38, 40, 33, 34";C.on("keydown",F,G,I);this._keyUpHandle=C.on("keyup",H,E);C.on("mousedown",D,G);this._mouseUpHandle=C.on("mouseup",J,E);C.on("change",C.bind(this._onInputChange,this),this.inputNode);},syncUI:function(){this._uiSetValue(this.get("value"));},_renderInput:function(){var E=this.get("contentBox"),F=E.one("."+A.INPUT_CLASS),D=this.get("strings");if(!F){F=C.Node.create(A.INPUT_TEMPLATE);E.appendChild(F);}F.set("title",D.tooltip);this.inputNode=F;},_renderButtons:function(){var E=this.get("contentBox"),D=this.get("strings"),F=this._createButton(D.increment,this.getClassName("increment")),G=this._createButton(D.decrement,this.getClassName("decrement"));this.incrementNode=E.appendChild(F);this.decrementNode=E.appendChild(G);},_createButton:function(F,E){var D=C.Node.create(A.BTN_TEMPLATE);D.set("innerHTML",F);D.set("title",F);D.addClass(E);return D;},_onMouseDown:function(I){var G=I.target,D=null,H=false,F=this.get("value"),E=this.get("minorStep");if(G.hasClass(this.getClassName("increment"))){this.set("value",F+E);D=1;H=true;}else{if(G.hasClass(this.getClassName("decrement"))){this.set("value",F-E);D=-1;H=true;}}if(H){this._setMouseDownTimers(D,E);}},_defaultCB:function(){return null;},_onKeyUp:function(D){this._clearKeyDownTimers();},_onMouseUp:function(D){this._clearMouseDownTimers();},_onKeyDown:function(K){K.preventDefault();var H=this.get("value"),E=H,J=false,G=null,D=null,F=this.get("minorStep"),I=this.get("majorStep");switch(K.charCode){case 38:E+=F;J=true;G=F;D=1;break;case 40:E-=F;J=true;G=F;D=-1;break;case 33:E+=I;E=Math.min(E,this.get("max"));J=true;G=I;D=1;break;case 34:E-=I;E=Math.max(E,this.get("min"));J=true;G=I;D=-1;break;}if(E!==H){this.set("value",E);}if(J){this._setKeyDownTimers(D,G);}},_onInputChange:function(D){if(!this._validateValue(this.inputNode.get("value"))){this.syncUI();}},_setKeyDownTimers:function(D,E){this._keyDownTimer=C.later(500,this,function(){this._keyPressTimer=C.later(100,this,function(){this.set("value",this.get("value")+(D*E));},null,true);});},_setMouseDownTimers:function(D,E){this._mouseDownTimer=C.later(500,this,function(){this._mousePressTimer=C.later(100,this,function(){this.set("value",this.get("value")+(D*E));},null,true);});},_clearKeyDownTimers:function(){if(this._keyDownTimer){this._keyDownTimer.cancel();this._keyDownTimer=null;}if(this._keyPressTimer){this._keyPressTimer.cancel();this._keyPressTimer=null;}},_clearMouseDownTimers:function(){if(this._mouseDownTimer){this._mouseDownTimer.cancel();this._mouseDownTimer=null;}if(this._mousePressTimer){this._mousePressTimer.cancel();this._mousePressTimer=null;}},_afterValueChange:function(D){this._uiSetValue(D.newVal);this.fire("entry:onChange");},_uiSetValue:function(D){this.inputNode.set("value",D);},_validateValue:function(F){var E=this.get("min"),D=this.get("max");return(C.Lang.isNumber(F)&&F>=E&&F<=D);},getValue:function(){return this.get("value");},setValue:function(D){this.set("value",D);}});C.namespace("Bewype");C.Bewype.EntrySpinner=A;},"@VERSION@",{requires:["event-key","widget"]});