YUI.add("bewype-layout-designer-target",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-target";a.NS="layoutDesignerTarget";a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},targetOverHeight:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinHeight:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetOverWidth:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinWidth:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},targetZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},defaultContent:{value:"Text..",validator:function(c){return b.Lang.isString(c);}},layoutWidth:{value:600,setter:"_setLayoutWidth",validator:function(c){return b.Lang.isNumber(c);}},baseNode:{value:null,writeOnce:true},parentNode:{value:null}};b.extend(a,b.Plugin.Base,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","content"],initializer:function(d){var h=this.get("host"),f=this.get("targetType"),g=this.get("designerClass")+"-target",c=this.get("layoutWidth"),j=this.get("contentHeight"),i=this.get("contentWidth"),k=this.get("targetMinHeight"),l=this.get("targetMinWidth"),e=null;this._targetNode=new b.Node.create('<div class="'+g+" "+g+"-"+f+'" />');h.append(this._targetNode);if(f==="vertical"||f==="start"){e=h.ancestor("table")?i:c;this._targetNode.setStyle("height",k);this._targetNode.setStyle("width",e);}else{if(f==="horizontal"){this._targetNode.setStyle("height",j);this._targetNode.setStyle("width",l);}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new b.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":b.bind(this._onDropEnter,this),"drop:hit":b.bind(this._onDropHit,this),"drop:exit":b.bind(this._afterDropExit,this)}});if(f!="start"){b.on("mouseenter",b.bind(this._onMouseEnter,this),this._targetNode);b.on("mouseleave",b.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var c=this.get("host"),e=this.get("parentNode"),d=this._targetNode.one("div");if(c.layoutDesignerPlaces){c.unplug(b.Bewype.LayoutDesignerPlaces);}this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(d){d.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(e){e.layoutDesignerTarget.refresh();}else{c.setStyle("height",this.get("targetMinHeight"));this._addTarget(c,"start");}},_onDropEnter:function(c){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh(c);},_afterDropExit:function(c){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh(c);},_onClickRemove:function(c){var d=this.get("host");d.unplug(b.Bewype.LayoutDesignerTarget);if(!this.get("parentNode")){d.setStyle("height",this.get("targetMinHeight"));this._addTarget(d,"start");}},_onMouseEnter:function(c){var e=this.get("targetType"),d=this.get("designerClass")+"-target",f=this._targetNode.one("div");switch(e){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(f){f.setStyle("display","block");}else{f=new b.Node.create('<div class="'+d+"-remove "+d+"-"+e+'-remove" />');this._targetNode.append(f);b.on("click",b.bind(this._onClickRemove,this),f);}this.refresh(c);},_onMouseLeave:function(c){var d=this._targetNode.one("div");d.setStyle("display","none");this._afterDropExit(c);},_addPlaces:function(f,d){var c=this.get("host"),e=(f.ancestor("td"))?c:null;f.plug(b.Bewype.LayoutDesignerPlaces,{placesMinHeight:this.get("targetMinHeight"),placesMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),designerClass:this.get("designerClass"),placesType:d,baseNode:this.get("baseNode"),parentNode:e});},_addTarget:function(f,d){var c=this.get("host"),e=(f.ancestor("td"))?c:null;f.plug(b.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetMinHeight:this.get("targetMinHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),designerClass:this.get("designerClass"),targetType:d,baseNode:this.get("baseNode"),parentNode:e});},_getHitType:function(c){var d=c.drag;if(d._groups.vertical){return"vertical";}else{if(d._groups.horizontal){return"horizontal";}else{if(d._groups.content){return"content";}else{return null;}}}},_onDropHitStart:function(c){var e=this._getHitType(c),d=this.get("host");if(e==="content"){return this._afterDropExit(c);}d.unplug(b.Bewype.LayoutDesignerTarget);this._addPlaces(d,e);this._addTarget(d,e);d.layoutDesignerTarget.refresh();},_onDropHitHorizontal:function(c){var d=this.get("host"),e=this._getHitType(c),f=null;switch(e){case"content":d.layoutDesignerPlaces.addContent();break;case"vertical":f=d.layoutDesignerPlaces.addDestNode();this._addPlaces(f,e);this._addTarget(f,e);f.layoutDesignerTarget.refresh();break;}this._afterDropExit(c);},_onDropHitVertical:function(c){var d=this.get("host"),e=this._getHitType(c),f=null;
switch(e){case"content":d.layoutDesignerPlaces.addContent();break;case"horizontal":f=d.layoutDesignerPlaces.addDestNode();this._addPlaces(f,e);this._addTarget(f,e);f.layoutDesignerTarget.refresh();break;}this._afterDropExit(c);},_onDropHit:function(c){switch(this.get("targetType")){case"start":return this._onDropHitStart(c);case"horizontal":return this._onDropHitHorizontal(c);case"vertical":return this._onDropHitVertical(c);}},refresh:function(){var h=this.get("host"),d=this.get("targetType"),i=null,g=null,f=null,e=null,c=null,j=null;if(h.layoutDesignerPlaces){i=h.layoutDesignerPlaces.refresh();}else{return;}g=i[0];f=i[1];e=b.Bewype.Utils.getHeight(this._targetNode);c=b.Bewype.Utils.getWidth(this._targetNode);j=this._targetNode.ancestor("td")||this._targetNode.ancestor("div");switch(d){case"vertical":g=b.Bewype.Utils.getHeight(j);if(j.get("tagName").toLowerCase()==="div"){this._targetNode.setY(j.getY()+g-e);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",f);break;case"horizontal":f=b.Bewype.Utils.getWidth(j);this._targetNode.setX(j.getX()+f-c);if(j.get("tagName").toLowerCase()==="div"){this._targetNode.setY(j.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("height",g);break;}j=h.layoutDesignerPlaces.get("parentNode");if(j){j.layoutDesignerTarget.refresh();}}});b.namespace("Bewype");b.Bewype.LayoutDesignerTarget=a;},"@VERSION@",{requires:["bewype-layout-designer-places"]});