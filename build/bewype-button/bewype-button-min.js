YUI.add("bewype-button-base",function(D){var A="",C="",E="",B=null;A+='<div class="{buttonClass}">';A+="</div>";C+='<div class="{buttonClass}-label">';C+="  {label}";C+="</div>";E+='<div class="{buttonClass}-image">';E+='  <img src="{imageUrl}" />';E+="</div>";B=function(F){B.superclass.constructor.apply(this,arguments);};B.NAME="button";B.NS="button";B.ATTRS={buttonClass:{value:"yui3-button-base",writeOnce:true,validator:function(F){return D.Lang.isString(F);}},label:{value:null,writeOnce:true,validator:function(F){return D.Lang.isString(F);}},imageUrl:{value:null,writeOnce:true,validator:function(F){return D.Lang.isString(F);}},width:{value:80,writeOnce:true,validator:function(F){return D.Lang.isNumber(F);}}};D.extend(B,D.Widget,{_init:function(F){this.publish("button:onClick");this.publish("button:onChange");},initializer:function(F){this._init(F);},_renderBaseUI:function(){var I=this.get("contentBox"),H=this.get("buttonClass"),K=this.get("label"),F=this.get("imageUrl"),L=null,G=null,J=null;L=new D.Node.create(D.substitute(A,{buttonClass:H}));I.append(L);if(K){G=new D.Node.create(D.substitute(C,{buttonClass:H,label:K}));L.append(G);}if(F){J=new D.Node.create(D.substitute(E,{buttonClass:H,imageUrl:F}));L.append(J);}D.on("yui3-button-event|click",D.bind(this._onClick,this),L);},renderUI:function(){this._renderBaseUI();},bindUI:function(){},syncUI:function(){},destructor:function(){var F=this.get("contentBox"),G=F.one("div");if(G){D.detach("yui3-button-event|click");G.remove();}},_onClick:function(G){var F=G?G.target:null;if(F){this.fire("button:onClick");}},getValue:function(){return null;}});D.augment(B,D.EventTarget);D.namespace("Bewype");D.Bewype.Button=B;},"@VERSION@",{requires:["stylesheet","substitute","widget","yui-base"]});YUI.add("bewype-button-toggle",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="buttonToggle";A.NS="buttonToggle";A.ATTRS={buttonClass:{value:"yui3-button-toggle",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},label:{value:null,writeOnce:true,validator:function(C){return B.Lang.isString(C);}},imageUrl:{value:null,writeOnce:true,validator:function(C){return B.Lang.isString(C);}},width:{value:80,writeOnce:true,validator:function(C){return B.Lang.isNumber(C);}}};B.extend(A,B.Bewype.Button,{_toggleState:false,initializer:function(C){this._init(C);this._toggleState=false;},renderUI:function(){this._renderBaseUI();},_onClick:function(C){var E=this.get("contentBox"),F=E.one("div"),D=this.get("buttonClass");if(F){this._toggleState=!this._toggleState;F.set("className",this._toggleState?D+"-active":D);this.fire("button:onChange");this.fire("button:onClick");}},getValue:function(){return this._toggleState;}});B.namespace("Bewype");B.Bewype.ButtonToggle=A;},"@VERSION@",{requires:["bewype-button-base"]});YUI.add("bewype-button",function(A){},"@VERSION@",{use:["bewype-button-base","bewype-button-toggle"]});