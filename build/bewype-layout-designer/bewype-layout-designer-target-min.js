YUI.add("bewype-layout-designer-target",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-target";a.NS="layoutDesignerTarget";b.extend(a,b.Bewype.LayoutDesignerConfig,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","text","image"],initializer:function(d){this.setAttrs(d);var h=this.get("host"),f=this.get("targetType"),g=this.get("designerClass")+"-target",c=this.get("layoutWidth"),j=this.get("contentHeight"),i=this.get("contentWidth"),k=this.get("targetMinHeight"),l=this.get("targetMinWidth"),e=null;this._targetNode=new b.Node.create('<div class="'+g+" "+g+"-"+f+'" />');h.append(this._targetNode);if(f==="vertical"||f==="start"){e=h.ancestor("table")?i:c;this._targetNode.setStyle("height",k);this._targetNode.setStyle("width",e);}else{if(f==="horizontal"){this._targetNode.setStyle("height",j);this._targetNode.setStyle("width",l);}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new b.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":b.bind(this._onDropEnter,this),"drop:hit":b.bind(this._onDropHit,this),"drop:exit":b.bind(this._afterDropExit,this)}});if(f!="start"){b.on("mouseenter",b.bind(this._onMouseEnter,this),this._targetNode);b.on("mouseleave",b.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var c=this.get("host"),e=this.get("parentNode"),d=this._targetNode.one("div");if(c.layoutDesignerPlaces){c.unplug(b.Bewype.LayoutDesignerPlaces);}this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(d){d.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(e){e.layoutDesignerTarget.refresh();}else{c.setStyle("height",this.get("targetMinHeight"));this._addTarget(c,"start");}},_onDropEnter:function(c){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh();},_afterDropExit:function(c,d){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh(d);},_onClickRemove:function(c){var d=this.get("host");d.unplug(b.Bewype.LayoutDesignerTarget);if(!this.get("parentNode")){d.setStyle("height",this.get("targetMinHeight"));this._addTarget(d,"start");}},_onMouseEnter:function(c){var e=this.get("targetType"),d=this.get("designerClass")+"-target",f=this._targetNode.one("div");switch(e){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(f){f.setStyle("display","block");}else{f=new b.Node.create('<div class="'+d+"-remove "+d+"-"+e+'-remove" />');this._targetNode.append(f);b.on("click",b.bind(this._onClickRemove,this),f);}this.refresh();},_onMouseLeave:function(c){var d=this._targetNode.one("div");d.setStyle("display","none");this._afterDropExit(c);},_addPlaces:function(g,e){var d=this.get("host"),c=this.get("targetType"),f=this.getAttrs();f.placesType=e;f.parentNode=(c==="start"||e==="start")?null:d;g.plug(b.Bewype.LayoutDesignerPlaces,f);},_addTarget:function(g,e){var d=this.get("host"),c=this.get("targetType"),f=this.getAttrs();f.targetType=e;f.parentNode=(c==="start"||e==="start")?null:d;g.plug(b.Bewype.LayoutDesignerTarget,f);},_getHitType:function(c){var d=c.drag;if(d._groups.vertical){return"vertical";}else{if(d._groups.horizontal){return"horizontal";}else{if(d._groups.text){return"text";}else{if(d._groups.image){return"image";}else{return null;}}}}},_onDropHit:function(c){var e=this.get("host"),d=this.get("targetType"),f=this._getHitType(c),i=null,h=e.layoutDesignerPlaces,g=null;if(d==="start"){if(f==="text"||f==="image"){return this._afterDropExit(c);}e.unplug(b.Bewype.LayoutDesignerTarget);}if(f===d){return;}else{if(f==="start"||f==="horizontal"||f==="vertical"){if(h&&h.get("placesType")!=="vertical"){g=h.getMaxWidth();}i=d==="start"?e:h.addDestNode();this._addPlaces(i,f);this._addTarget(i,f);if(f!=="start"){i.layoutDesignerTarget.refresh();}}else{g=h.addContent(f);g=h.get("placesType")==="vertical"?null:g;}}this._afterDropExit(c,g);},refresh:function(g){var h=this.get("host"),e=this.get("targetType"),i=this.get("parentNode")||h,l=null,k=null,j=null,f=null,c=null,d=null;if(h.layoutDesignerPlaces){l=h.layoutDesignerPlaces.refresh(g);}else{return;}k=l[0];j=l[1];f=b.Bewype.Utils.getHeight(this._targetNode);c=b.Bewype.Utils.getWidth(this._targetNode);d=this._targetNode.ancestor("div");switch(e){case"vertical":k=b.Bewype.Utils.getHeight(i);if(i==h){this._targetNode.setY(i.getY()+k-f);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",j);break;case"horizontal":j=b.Bewype.Utils.getWidth(i);this._targetNode.setX(i.getX()+j-c);if(i==h){this._targetNode.setY(i.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("height",k);break;default:return;}if(i!=h&&!g){i.layoutDesignerTarget.refresh();}}});b.namespace("Bewype");b.Bewype.LayoutDesignerTarget=a;},"@VERSION@",{requires:["bewype-layout-designer-places"]});