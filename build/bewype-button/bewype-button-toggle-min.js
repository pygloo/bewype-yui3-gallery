YUI.add("bewype-button-toggle",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="buttonToggle";A.NS="buttonToggle";A.ATTRS={buttonClass:{value:"yui3-button-toggle",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},label:{value:null,writeOnce:true,validator:function(C){return B.Lang.isString(C);}},imageUrl:{value:null,writeOnce:true,validator:function(C){return B.Lang.isString(C);}},width:{value:80,writeOnce:true,validator:function(C){return B.Lang.isNumber(C);}}};B.extend(A,B.Bewype.Button,{_toggleState:false,initializer:function(C){this._init(C);this._toggleState=false;},renderUI:function(){this._renderBaseUI();},refresh:function(C){var D=this.get("buttonClass"),E=C||this.get("contentBox").one("div");if(E){E.set("className",this._toggleState?D+"-active":D);}},_onClick:function(C){var D=this.get("contentBox"),E=D.one("div");if(E){this._toggleState=!this._toggleState;this.refresh(E);this.fire("button:onChange");this.fire("button:onClick");}},getValue:function(){return this._toggleState;},setValue:function(C){if(this._toggleState!=C){this._toggleState=C;this.refresh();}}});B.namespace("Bewype");B.Bewype.ButtonToggle=A;},"@VERSION@",{requires:["bewype-button-base"]});