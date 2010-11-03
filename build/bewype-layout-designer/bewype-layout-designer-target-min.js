YUI.add("bewype-layout-designer-target",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-target";A.NS="layoutDesignerTarget";A.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},targetOverHeight:{value:20,validator:function(C){return B.Lang.isNumber(C);}},targetMinHeight:{value:8,validator:function(C){return B.Lang.isNumber(C);}},targetOverWidth:{value:20,validator:function(C){return B.Lang.isNumber(C);}},targetMinWidth:{value:8,validator:function(C){return B.Lang.isNumber(C);}},targetType:{value:"vertical",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},targetZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},contentHeight:{value:40,validator:function(C){return B.Lang.isNumber(C);}},contentWidth:{value:140,validator:function(C){return B.Lang.isNumber(C);}},contentZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},defaultContent:{value:"Text..",validator:function(C){return B.Lang.isString(C);}},layoutWidth:{value:600,setter:"_setLayoutWidth",validator:function(C){return B.Lang.isNumber(C);}},baseNode:{value:null,writeOnce:true},parentNode:{value:null}};B.extend(A,B.Plugin.Base,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","text","image"],initializer:function(D){var H=this.get("host"),F=this.get("targetType"),G=this.get("designerClass")+"-target",C=this.get("layoutWidth"),J=this.get("contentHeight"),I=this.get("contentWidth"),K=this.get("targetMinHeight"),L=this.get("targetMinWidth"),E=null;this._targetNode=new B.Node.create('<div class="'+G+" "+G+"-"+F+'" />');H.append(this._targetNode);if(F==="vertical"||F==="start"){E=H.ancestor("table")?I:C;this._targetNode.setStyle("height",K);this._targetNode.setStyle("width",E);}else{if(F==="horizontal"){this._targetNode.setStyle("height",J);this._targetNode.setStyle("width",L);}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new B.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":B.bind(this._onDropEnter,this),"drop:hit":B.bind(this._onDropHit,this),"drop:exit":B.bind(this._afterDropExit,this)}});if(F!="start"){B.on("mouseenter",B.bind(this._onMouseEnter,this),this._targetNode);B.on("mouseleave",B.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var C=this.get("host"),E=this.get("parentNode"),D=this._targetNode.one("div");if(C.layoutDesignerPlaces){C.unplug(B.Bewype.LayoutDesignerPlaces);}this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(D){D.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(E){E.layoutDesignerTarget.refresh();}else{C.setStyle("height",this.get("targetMinHeight"));this._addTarget(C,"start");}},_onDropEnter:function(C){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh(C);},_afterDropExit:function(C){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh(C);},_onClickRemove:function(C){var D=this.get("host");D.unplug(B.Bewype.LayoutDesignerTarget);if(!this.get("parentNode")){D.setStyle("height",this.get("targetMinHeight"));this._addTarget(D,"start");}},_onMouseEnter:function(C){var E=this.get("targetType"),D=this.get("designerClass")+"-target",F=this._targetNode.one("div");switch(E){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(F){F.setStyle("display","block");}else{F=new B.Node.create('<div class="'+D+"-remove "+D+"-"+E+'-remove" />');this._targetNode.append(F);B.on("click",B.bind(this._onClickRemove,this),F);}this.refresh(C);},_onMouseLeave:function(C){var D=this._targetNode.one("div");D.setStyle("display","none");this._afterDropExit(C);},_addPlaces:function(F,D){var C=this.get("host"),E=(F.ancestor("td"))?C:null;F.plug(B.Bewype.LayoutDesignerPlaces,{placesMinHeight:this.get("targetMinHeight"),placesMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),designerClass:this.get("designerClass"),placesType:D,baseNode:this.get("baseNode"),parentNode:E});},_addTarget:function(F,D){var C=this.get("host"),E=(F.ancestor("td"))?C:null;F.plug(B.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetMinHeight:this.get("targetMinHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),designerClass:this.get("designerClass"),targetType:D,baseNode:this.get("baseNode"),parentNode:E});},_getHitType:function(C){var D=C.drag;if(D._groups.vertical){return"vertical";}else{if(D._groups.horizontal){return"horizontal";}else{if(D._groups.text){return"text";}else{if(D._groups.image){return"image";}else{return null;}}}}},_onDropHitStart:function(C){var E=this._getHitType(C),D=this.get("host");if(E==="text"||E==="image"){return this._afterDropExit(C);}D.unplug(B.Bewype.LayoutDesignerTarget);this._addPlaces(D,E);this._addTarget(D,E);D.layoutDesignerTarget.refresh();},_onDropHitHorizontal:function(C){var D=this.get("host"),E=this._getHitType(C),F=null;if(E==="vertical"){F=D.layoutDesignerPlaces.addDestNode();this._addPlaces(F,E);this._addTarget(F,E);F.layoutDesignerTarget.refresh();}else{D.layoutDesignerPlaces.addContent(E);}this._afterDropExit(C);
},_onDropHitVertical:function(C){var D=this.get("host"),E=this._getHitType(C),F=null;if(E==="horizontal"){F=D.layoutDesignerPlaces.addDestNode();this._addPlaces(F,E);this._addTarget(F,E);F.layoutDesignerTarget.refresh();}else{D.layoutDesignerPlaces.addContent(E);}this._afterDropExit(C);},_onDropHit:function(C){switch(this.get("targetType")){case"start":return this._onDropHitStart(C);case"horizontal":return this._onDropHitHorizontal(C);case"vertical":return this._onDropHitVertical(C);}},refresh:function(){var H=this.get("host"),D=this.get("targetType"),I=null,G=null,F=null,E=null,C=null,J=null;if(H.layoutDesignerPlaces){I=H.layoutDesignerPlaces.refresh();}else{return;}G=I[0];F=I[1];E=B.Bewype.Utils.getHeight(this._targetNode);C=B.Bewype.Utils.getWidth(this._targetNode);J=this._targetNode.ancestor("td")||this._targetNode.ancestor("div");switch(D){case"vertical":G=B.Bewype.Utils.getHeight(J);if(J.get("tagName").toLowerCase()==="div"){this._targetNode.setY(J.getY()+G-E);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",F);break;case"horizontal":F=B.Bewype.Utils.getWidth(J);this._targetNode.setX(J.getX()+F-C);if(J.get("tagName").toLowerCase()==="div"){this._targetNode.setY(J.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("height",G);break;}J=H.layoutDesignerPlaces.get("parentNode");if(J){J.layoutDesignerTarget.refresh();}}});B.namespace("Bewype");B.Bewype.LayoutDesignerTarget=A;},"@VERSION@",{requires:["bewype-layout-designer-places"]});