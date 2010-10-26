YUI.add("bewype-layout-designer-target",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-target";A.NS="layoutDesignerTarget";A.ATTRS={targetOverHeight:{value:20,validator:function(C){return B.Lang.isNumber(C);}},targetMinHeight:{value:8,validator:function(C){return B.Lang.isNumber(C);}},targetOverWidth:{value:20,validator:function(C){return B.Lang.isNumber(C);}},targetMinWidth:{value:8,validator:function(C){return B.Lang.isNumber(C);}},targetType:{value:"vertical",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},targetClass:{value:"target",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},targetZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},placesClass:{value:"places",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},parentNode:{value:null},contentHeight:{value:40,validator:function(C){return B.Lang.isNumber(C);}},contentWidth:{value:140,validator:function(C){return B.Lang.isNumber(C);}},contentZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},contentClass:{value:"content",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},defaultContent:{value:"Click to change your content..",validator:function(C){return B.Lang.isString(C);}},editCallback:{value:null},idDest:{value:"layout-dest",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},layoutWidth:{value:600,setter:"_setLayoutWidth",validator:function(C){return B.Lang.isNumber(C);}}};B.extend(A,B.Plugin.Base,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","content"],initializer:function(D){var G=this.get("host"),F=this.get("targetType"),C=this.get("layoutWidth"),I=this.get("contentHeight"),H=this.get("contentWidth"),J=this.get("targetMinHeight"),K=this.get("targetMinWidth"),E=null;this._targetNode=new B.Node.create('<div class="'+this.get("targetClass")+"-"+F+'" />');G.append(this._targetNode);if(F==="vertical"||F==="start"){E=G.ancestor("table")?H:C;this._targetNode.setStyle("height",J);this._targetNode.setStyle("width",E);}else{if(F==="horizontal"){this._targetNode.setStyle("height",I);this._targetNode.setStyle("width",K);}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new B.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":B.bind(this._onDropEnter,this),"drop:hit":B.bind(this._onDropHit,this),"drop:exit":B.bind(this._afterDropExit,this)}});if(F!="start"){B.on("mouseenter",B.bind(this._onMouseEnter,this),this._targetNode);B.on("mouseleave",B.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var C=this.get("host"),E=this.get("parentNode"),D=this._targetNode.one("div"),F=null;if(C.layoutDesignerPlaces){C.unplug(B.Bewype.LayoutDesignerPlaces);}this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(D){D.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(E){E.layoutDesignerTarget.refresh();}else{F=B.one("#"+this.get("idDest"));F.setStyle("height",this.get("targetMinHeight"));this._addTarget(F,"start");}},_getHeight:function(D,C){C=C?C:0;return parseInt(D.getComputedStyle("height")||D.getAttribute("height"),C);},_getWidth:function(D,C){C=C?C:0;return parseInt(D.getComputedStyle("width")||D.getAttribute("width"),C);},_onDropEnter:function(C){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh(C);},_afterDropExit:function(C){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh(C);},_onClickRemove:function(C){var D=this.get("host"),E=null;D.unplug(B.Bewype.LayoutDesignerTarget);if(!this.get("parentNode")){E=B.one("#"+this.get("idDest"));E.setStyle("height",this.get("targetMinHeight"));this._addTarget(E,"start");}},_onMouseEnter:function(D){var C=this.get("targetClass"),E=this.get("targetType"),F=this._targetNode.one("div");switch(E){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(F){F.setStyle("display","block");}else{F=new B.Node.create('<div class="'+C+"-"+E+'-remove" />');this._targetNode.append(F);B.on("click",B.bind(this._onClickRemove,this),F);}this.refresh(D);},_onMouseLeave:function(C){var D=this._targetNode.one("div");D.setStyle("display","none");this._afterDropExit(C);},_addPlaces:function(F,D){var C=this.get("host"),E=(F.ancestor("td"))?C:null;F.plug(B.Bewype.LayoutDesignerPlaces,{placesMinHeight:this.get("targetMinHeight"),placesMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),placesClass:this.get("placesClass"),placesType:D,parentNode:E});},_addTarget:function(F,D){var C=this.get("host"),E=(F.ancestor("td"))?C:null;F.plug(B.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetMinHeight:this.get("targetMinHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),targetType:D,parentNode:E});},_getHitType:function(C){var D=C.drag;if(D._groups.vertical){return"vertical";}else{if(D._groups.horizontal){return"horizontal";}else{if(D._groups.content){return"content";
}else{return null;}}}},_onDropHitStart:function(C){var E=this._getHitType(C),D=this.get("host");if(E==="content"){return this._afterDropExit(C);}D.unplug(B.Bewype.LayoutDesignerTarget);this._addPlaces(D,E);this._addTarget(D,E);D.layoutDesignerTarget.refresh();},_onDropHitHorizontal:function(C){var D=this.get("host"),E=this._getHitType(C),F=null;switch(E){case"content":D.layoutDesignerPlaces.addContent();break;case"vertical":F=D.layoutDesignerPlaces.addDestNode();this._addPlaces(F,E);this._addTarget(F,E);F.layoutDesignerTarget.refresh();break;}this._afterDropExit(C);},_onDropHitVertical:function(C){var D=this.get("host"),E=this._getHitType(C),F=null;switch(E){case"content":D.layoutDesignerPlaces.addContent();break;case"horizontal":F=D.layoutDesignerPlaces.addDestNode();this._addPlaces(F,E);this._addTarget(F,E);F.layoutDesignerTarget.refresh();break;}this._afterDropExit(C);},_onDropHit:function(C){switch(this.get("targetType")){case"start":return this._onDropHitStart(C);case"horizontal":return this._onDropHitHorizontal(C);case"vertical":return this._onDropHitVertical(C);}},refresh:function(){var H=this.get("host"),D=this.get("targetType"),I=null,G=null,F=null,E=null,C=null,J=null;if(H.layoutDesignerPlaces){I=H.layoutDesignerPlaces.refresh();}else{return;}G=I[0];F=I[1];E=this._getHeight(this._targetNode);C=this._getWidth(this._targetNode);J=this._targetNode.ancestor("td")||this._targetNode.ancestor("div");switch(D){case"vertical":G=this._getHeight(J);if(J.get("tagName").toLowerCase()==="div"){this._targetNode.setY(J.getY()+G-E);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",F);break;case"horizontal":F=this._getWidth(J);this._targetNode.setX(J.getX()+F-C);if(J.get("tagName").toLowerCase()==="div"){this._targetNode.setY(J.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("height",G);break;}J=H.layoutDesignerPlaces.get("parentNode");if(J){J.layoutDesignerTarget.refresh();}}});B.namespace("Bewype");B.Bewype.LayoutDesignerTarget=A;},"@VERSION@",{requires:["bewype-layout-designer-places"]});