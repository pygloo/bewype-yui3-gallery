YUI.add("bewype-layout-designer-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NODE_SRC_TEMPLATE='<div class="{designerClass}-sources"></div>';b.NODE_PAN_TEMPLATE='<div class="{designerClass}-edit-panel"></div>';b.NODE_LAYOUT_TEMPLATE='<div class="{designerClass}-layout"></div>';b.NAME="layout-designer";b.NS="layoutDesigner";a.extend(b,a.Bewype.LayoutDesignerConfig,{nodeLayout:null,initializer:function(c){this.setAttrs(c);var d=this.get("host"),f=null,e=null;f=new a.Node.create(a.substitute(b.NODE_SRC_TEMPLATE,{designerClass:this.get("designerClass")}));d.append(f);f.plug(a.Bewype.LayoutDesignerSources,{layoutWidth:this.get("layoutWidth")});e=new a.Node.create(a.substitute(b.NODE_PAN_TEMPLATE,{designerClass:this.get("designerClass")}));d.append(e);this.nodeLayout=new a.Node.create(a.substitute(b.NODE_LAYOUT_TEMPLATE,{designerClass:this.get("designerClass")}));d.append(this.nodeLayout);this.nodeLayout.setStyle("width",this.get("layoutWidth"));c.baseNode=d;c.targetType="start";this.nodeLayout.plug(a.Bewype.LayoutDesignerTarget,c);a.DD.DDM.on("drop:hit",a.bind(this._dropHitGotcha,this));},destructor:function(){this.nodeLayout.unplug(a.Bewype.LayoutDesignerTarget);},_dropHitGotcha:function(m){var e=m.drag.get("node"),o=e.get("tagName").toLowerCase(),i="."+this.get("designerClass")+"-places",n="."+this.get("designerClass")+"-container",k=e.one(n),h=e.one(i)?k:e.one(n),c=null,f=null,g=o==="li"?"ul":"table",j=k?k.ancestor(g):null,l=j?j.ancestor("div"):null,d=null;if(!h||!l.layoutDesignerPlaces){return;}else{if(h.layoutDesignerContent){f=h.layoutDesignerContent.get("parentNode");}else{if(h.layoutDesignerPlaces){f=h.layoutDesignerPlaces.get("parentNode");}else{return;}}}if(f!=l){f.layoutDesignerPlaces.unRegisterContent(h);l.layoutDesignerPlaces.registerContent(h);h.layoutDesignerContent.set("parentNode",l);d=l.layoutDesignerPlaces.getMaxWidth();l.layoutDesignerTarget.refresh(d);}},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});a.namespace("Bewype");a.Bewype.LayoutDesigner=b;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});