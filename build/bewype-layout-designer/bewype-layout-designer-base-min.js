YUI.add("bewype-layout-designer-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NODE_SRC_TEMPLATE='<div class="{designerClass}-sources"></div>';b.NODE_PAN_TEMPLATE='<div class="{designerClass}-edit-panel"></div>';b.NODE_LAYOUT_TEMPLATE='<div class="{designerClass}-layout {designerClass}-places"></div>';b.NAME="layout-designer";b.NS="layoutDesigner";a.extend(b,a.Bewype.LayoutDesignerConfig,{nodeLayout:null,initializer:function(c){this.setAttrs(c);var e=this.get("host"),g=null,f=null,d=this.get("designerClass"),h=this.get("layoutWidth");g=new a.Node.create(a.substitute(b.NODE_SRC_TEMPLATE,{designerClass:d}));e.append(g);g.plug(a.Bewype.LayoutDesignerSources,c);f=new a.Node.create(a.substitute(b.NODE_PAN_TEMPLATE,{designerClass:d}));e.append(f);this.nodeLayout=new a.Node.create(a.substitute(b.NODE_LAYOUT_TEMPLATE,{designerClass:d}));e.append(this.nodeLayout);this.nodeLayout.setStyle("width",h);c.baseNode=e;c.targetType=this.get("startingTargetType");this.nodeLayout.plug(a.Bewype.LayoutDesignerPlaces,c);this.nodeLayout.plug(a.Bewype.LayoutDesignerTarget,c);this.nodeLayout.layoutDesignerTarget.refresh();a.DD.DDM.on("drop:enter",a.bind(this._dropHitGotcha,this));a.DD.DDM.on("drop:hit",a.bind(this._dropHitGotcha,this));},destructor:function(){var e=this.get("host"),d=this.get("designerClass"),f=e.one("."+d+"-sources"),c=e.one("."+d+"-edit-panel"),g=this.nodeLayout.one("table")||this.nodeLayout.one("ul");f.remove();c.remove();this.nodeLayout.unplug(a.Bewype.LayoutDesignerTarget);if(g){this.nodeLayout.replace(g);}else{this.nodeLayout.remove();}},_dropHitGotcha:function(l){var d=l.drag.get("node"),n=d.get("tagName").toLowerCase(),h="."+this.get("designerClass")+"-places",m="."+this.get("designerClass")+"-container",j=d.one(m),g=d.one(h)?j:d.one(m),e=null,f=n==="li"?"ul":"table",i=j?j.ancestor(f):null,k=i?i.ancestor("div"):null,c=null;if(!g||!k.layoutDesignerPlaces){return;}else{if(g.layoutDesignerContent){e=g.layoutDesignerContent.get("parentNode");}else{if(g.layoutDesignerPlaces){e=g.layoutDesignerPlaces.get("parentNode");}else{return;}}}if(e!=k){e.layoutDesignerPlaces.unRegisterContent(g);k.layoutDesignerPlaces.registerContent(g);g.layoutDesignerContent.set("parentNode",k);c=k.layoutDesignerPlaces.getMaxWidth();k.layoutDesignerTarget.refresh(c);}},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});a.namespace("Bewype");a.Bewype.LayoutDesigner=b;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});