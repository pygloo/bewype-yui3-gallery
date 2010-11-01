YUI.add("bewype-layout-designer-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NODE_SRC_TEMPLATE='<div class="{designerClass}-sources"></div>';b.NODE_DST_TEMPLATE='<div class="{designerClass}-base"></div>';b.NAME="layout-designer";b.NS="layoutDesigner";b.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return a.Lang.isString(c);}},targetOverHeight:{value:20,validator:function(c){return a.Lang.isNumber(c);}},targetMinHeight:{value:8,validator:function(c){return a.Lang.isNumber(c);}},targetOverWidth:{value:20,validator:function(c){return a.Lang.isNumber(c);}},targetMinWidth:{value:8,validator:function(c){return a.Lang.isNumber(c);}},targetZIndex:{value:1,validator:function(c){return a.Lang.isNumber(c);}},contentHeight:{value:40,validator:function(c){return a.Lang.isNumber(c);}},contentWidth:{value:120,validator:function(c){return a.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return a.Lang.isNumber(c);}},defaultContent:{value:"Text..",validator:function(c){return a.Lang.isString(c);}},layoutWidth:{value:600,validator:function(c){return a.Lang.isNumber(c);}},editPanelNode:{value:null,writeOnce:true}};a.extend(b,a.Plugin.Base,{nodeLayout:null,initializer:function(c){var d=null;d=new a.Node.create(a.substitute(b.NODE_SRC_TEMPLATE,{designerClass:this.get("designerClass")}));this.get("host").append(d);d.plug(a.Bewype.LayoutDesignerSources,{layoutWidth:this.get("layoutWidth")});this.nodeLayout=new a.Node.create(a.substitute(b.NODE_DST_TEMPLATE,{designerClass:this.get("designerClass")}));this.get("host").append(this.nodeLayout);this.nodeLayout.setStyle("width",this.get("layoutWidth"));this.nodeLayout.plug(a.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinHeight:this.get("targetMinHeight"),targetMinWidth:this.get("targetMinWidth"),targetType:"start",targetZIndex:this.get("targetZIndex"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),designerClass:this.get("designerClass"),editPanelNode:this.get("editPanelNode"),});},destructor:function(){},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});a.namespace("Bewype");a.Bewype.LayoutDesigner=b;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});YUI.add("bewype-layout-designer-content",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.C_TEMPLATE='<div class="{designerClass}-content">{defaultContent}</div>';a.NAME="layout-designer-content";a.NS="layoutDesignerContent";a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},defaultContent:{value:"Text..",validator:function(c){return b.Lang.isString(c);}},parentNode:{value:null,writeOnce:false},editPanelNode:{value:null,writeOnce:true}};b.extend(a,b.Plugin.Base,{_q:null,editing:false,initializer:function(c){var d=this.get("host"),f=this.get("parentNode"),e=null;e=new b.Node.create(b.substitute(a.C_TEMPLATE,{designerClass:this.get("designerClass")}));d.append(e);e.setStyle("height",this.get("contentHeight"));e.setStyle("width",this.get("contentWidth"));e.set("innerHTML",this.get("defaultContent"));b.on("mouseenter",b.bind(this._onMouseEnter,this),d);f.layoutDesignerPlaces.registerContent(d);this._q=new b.AsyncQueue();},destructor:function(){var d=this.get("host"),f=this.get("parentNode"),c=this.get("designerClass")+"-content",e=d.one("div."+c),e=d.one("div."+c+"-clone");this._detachEditor();f.layoutDesignerPlaces.unRegisterContent(d);b.detach(d);if(e){b.Event.purgeElement(e,true);e.remove();}d.remove();},_detachEditor:function(){var d=this.get("host"),c=this.get("designerClass")+"-content",e=d.one("div."+c);d.detachAll("bewype-editor:onClose");d.detachAll("bewype-editor:onChange");this.editing=false;this.refresh();if(e.bewypeEditor){e.unplug(b.Bewype.Editor);}},_attachEditor:function(){var f=this.get("host"),j=this.get("parentNode"),i=this.get("editPanelNode"),e=j.layoutDesignerPlaces.getAvailablePlace(),d=this.get("designerClass")+"-content",h=f.one("div."+d),c=null,g=null;if(i){if(e){g=e;g+=this.getContentWidth();c={panelNode:i,spinnerMaxWidth:g};}else{c={panelNode:i};}h.plug(b.Bewype.Editor,c);this.editing=true;b.on("bewype-editor:onClose",b.bind(this._detachEditor,this),h);b.on("bewype-editor:onChange",b.bind(this.refresh,this),h);}},_onClickEdit:function(c){var e=this.get("parentNode"),d=this.get("editPanelNode");if(d){b.each(e.layoutDesignerPlaces.getContents(),function(g,f){g.layoutDesignerContent._detachEditor();});this._attachEditor();}},_onClickRemove:function(c){var d=this.get("host"),e=this.get("parentNode");e.layoutDesignerPlaces.removeContent(d);},hideClone:function(c){if(!c){var e=this.get("host"),d=this.get("designerClass")+"-content";c=e.one("div."+d+"-clone");}if(c){b.each(c.all("div"),function(g,f){g.setStyle("visibility","hidden");});c.setStyle("visibility","hidden");}},_addCloneNode:function(){var f=this.get("host"),e=this.get("designerClass")+"-content",c=new b.Node.create('<div class="'+e+'-clone-callbacks" />'),d=null,g=null,h=null;d=f.cloneNode(false);d.set("innerHTML","");d.set("className",e+"-clone");f.append(d);d.setStyle("z-index",this.get("contentZIndex"));d.setStyle("position","absolute");d.setStyle("bottom",0);d.append(c);g=new b.Node.create('<div class="'+e+'-clone-edit" />');c.append(g);b.on("click",b.bind(this._onClickEdit,this),g);h=new b.Node.create('<div class="'+e+'-clone-remove" />');c.append(h);b.on("click",b.bind(this._onClickRemove,this),h);this._refreshCloneNode();
return d;},_onMouseEnter:function(c){if(this.editing){return;}var e=this.get("host"),g=this.get("parentNode"),d=this.get("designerClass")+"-content",f=e.one("div."+d+"-clone");g.layoutDesignerPlaces.cleanContentOver();if(f){b.each(f.all("div"),function(i,h){i.setStyle("visibility","visible");});f.setStyle("visibility","visible");}else{f=this._addCloneNode();}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[f]});this._q.run();},getContentHeight:function(){var e=this.get("host"),d=this.get("designerClass")+"-content",g=e.one("div."+d),c=b.Bewype.Utils.getHeight(g),f=b.Bewype.Utils.getStyleValue(g,"paddingTop")||0;return c+f;},getContentWidth:function(){var e=this.get("host"),d=this.get("designerClass")+"-content",g=e.one("div."+d),f=b.Bewype.Utils.getWidth(g),c=b.Bewype.Utils.getStyleValue(g,"paddingLeft")||0;return f+c;},_refreshCloneNode:function(){var f=this.get("host"),e=this.get("designerClass")+"-content",d=f.one("div."+e+"-clone"),g=this.getContentHeight(),c=this.getContentWidth();if(d){d.setStyle("height",g);d.setStyle("width",c);}},refresh:function(){this._refreshCloneNode();var c=this.get("parentNode");c.layoutDesignerTarget.refresh();}});b.namespace("Bewype");b.Bewype.LayoutDesignerContent=a;},"@VERSION@",{requires:["async-queue","plugin","substitute","bewype-editor"]});YUI.add("bewype-layout-designer-places",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-places";a.NS="layoutDesignerPlaces";a.H_PLACES_TEMPLATE='<table class="{designerClass}-places {designerClass}-places-horizontal">';a.H_PLACES_TEMPLATE+="<tr />";a.H_PLACES_TEMPLATE+="</table>";a.V_PLACES_TEMPLATE='<table class="{designerClass}-places {designerClass}-places-vertical"></table>';a.H_DEST_TEMPLATE='<td class="{designerClass}-cell {designerClass}-cell-horizontal">';a.H_DEST_TEMPLATE+='<div class="{designerClass}-container">';a.H_DEST_TEMPLATE+="</div>";a.H_DEST_TEMPLATE+="</td>";a.V_DEST_TEMPLATE='<tr class="{designerClass}-cell {designerClass}-cell-vertical">';a.V_DEST_TEMPLATE+="<td>";a.V_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';a.V_DEST_TEMPLATE+="</td>";a.V_DEST_TEMPLATE+="</tr>";a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},placesType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultContent:{value:"Text..",validator:function(c){return b.Lang.isString(c);}},parentNode:{value:null,writeOnce:false},editPanelNode:{value:null,writeOnce:true}};b.extend(a,b.Plugin.Base,{placesNode:null,contents:null,sortable:null,initializer:function(d){var f=this.get("host"),e=this.get("placesType"),c=a.H_PLACES_TEMPLATE,h=a.V_PLACES_TEMPLATE,i=(e==="horizontal")?c:h,g=this.get("parentNode");this.placesNode=new b.Node.create(b.substitute(i,{designerClass:this.get("designerClass")}));f.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));this._initSortable();if(g){g.layoutDesignerPlaces.registerContent(f);}this.contents=[];},_initSortable:function(){var c=this.get("placesType"),d=(c==="horizontal")?"td":"tr";if(this.sortable){this.sortable.destroy();}this.sortable=new b.Sortable({container:this.placesNode,nodes:d,opacity:".2"});b.DD.DDM.on("drop:hit",b.bind(this._dropHitGotcha,this),this.placesNode);},_dropHitGotcha:function(m){var f=m.drag.get("node"),k="."+this.get("designerClass")+"-places",n="."+this.get("designerClass")+"-container",l=f.one(n),j=f.one(k)?l:f.one(n),c=null,g=null,d=l?l.ancestor("table"):null,i=d?d.ancestor("div").layoutDesignerPlaces:null,h=null,e=null;if(!j||!i){return;}else{if(j.layoutDesignerContent){g=j.layoutDesignerContent.get("parentNode");c=j.layoutDesignerContent.getContentWidth();}else{if(j.layoutDesignerPlaces){g=j.layoutDesignerPlaces.get("parentNode");c=j.layoutDesignerPlaces.getPlacesWidth();}else{return;}}}if(g.layoutDesignerPlaces!=i){g.layoutDesignerPlaces.removeContent(j);h=i.hasPlace(c)?i:g.layoutDesignerPlaces;e=h.addDestNode();e.append(j);h.registerContent(j);if(j.layoutDesignerContent){j.layoutDesignerContent.set("parentNode",h.get("host"));j.layoutDesignerContent.refresh();}else{j.layoutDesignerPlaces.set("parentNode",h.get("host"));h.get("host").layoutDesignerTarget.refresh();}g.layoutDesignerTarget.refresh();}},destructor:function(){var c=this.get("host"),d=this.get("parentNode");b.Object.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){f.layoutDesignerPlaces.destroy();}else{this.removeContent(f);}},this);if(d){d.layoutDesignerPlaces.unRegisterContent(c);}this.placesNode.remove();},hasSubPlaces:function(){var c=false;b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=true;}});return c;},getAvailablePlace:function(){var e=this.get("parentNode")||this.placesNode.ancestor("div"),c=null,d=null;switch(this.get("placesType")){case"vertical":e=this.get("parentNode")||this.placesNode.ancestor("div");case"horizontal":c=b.Bewype.Utils.getWidth(e);d=this.getPlacesWidth();return c-d;}},hasPlace:function(c){var f=this.get("parentNode")||this.placesNode.ancestor("div"),d=null,e=null;c=c?c:this.get("contentWidth");switch(this.get("placesType")){case"vertical":return true;case"horizontal":d=b.Bewype.Utils.getWidth(f);e=this.getPlacesWidth();return d>=(e+c);}},getPlacesWidth:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesWidth();}else{f=e.layoutDesignerContent.getContentWidth();}if(f>c){c=f;}});break;case"horizontal":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesWidth();}else{c+=e.layoutDesignerContent.getContentWidth();}});break;}return(c===0)?this.get("contentWidth"):c;
},getPlacesHeight:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesHeight();}else{c+=e.layoutDesignerContent.getContentHeight();}});break;case"horizontal":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesHeight();}else{f=e.layoutDesignerContent.getContentHeight();}if(f>c){c=f;}});break;}return(c===0)?this.get("contentHeight"):c;},refresh:function(c){var d=this.get("placesType"),e=this.getPlacesHeight(),g=this.getPlacesWidth(),f=this.get("parentNode");this.placesNode.setStyle("height",e);this.placesNode.setStyle("width",g);switch(d){case"vertical":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;h.setStyle("width",g);}});break;case"horizontal":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;}else{h=j.layoutDesignerContent.get("host");}h.ancestor("td").setStyle("height",e);h.ancestor("td").setStyle("vertical-align","top");});break;}if(!c){if(f){f.layoutDesignerTarget.refresh();}else{this.placesNode.ancestor("div").setStyle("height",e);}}return[e,g];},cleanContentOver:function(){b.each(this.contents,function(d,c){if(d.layoutDesignerContent){d.layoutDesignerContent._q.stop();d.layoutDesignerContent.hideClone();}});},addDestNode:function(){if(!this.hasPlace()){return null;}var d=null,c=this.placesNode.one("tr");switch(this.get("placesType")){case"horizontal":d=new b.Node.create(b.substitute(a.H_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));c.append(d);break;case"vertical":d=new b.Node.create(b.substitute(a.V_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.append(d);break;}return d.one("div");},registerContent:function(c){this.contents.push(c);},unRegisterContent:function(c){var d=this.contents.indexOf(c);this.contents.splice(d,1);},addContent:function(){if(!this.hasPlace()){return null;}var c=this.addDestNode();c.plug(b.Bewype.LayoutDesignerContent,{designerClass:this.get("designerClass"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),parentNode:this.get("host"),editPanelNode:this.get("editPanelNode")});},removeContent:function(c){var e=null,d=this.get("host");switch(this.get("placesType")){case"horizontal":e=c.ancestor("td");break;case"vertical":e=c.ancestor("tr");break;}this.unRegisterContent(c);e.remove();d.layoutDesignerTarget.refresh();},getContents:function(){var c=[];b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=c.concat(e.layoutDesignerPlaces.getContents());}else{c.push(e);}});return c;}});b.namespace("Bewype");b.Bewype.LayoutDesignerPlaces=a;},"@VERSION@",{requires:["sortable","bewype-layout-designer-content"]});YUI.add("bewype-layout-designer-sources",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-sources";a.NS="layoutDesignerSources";a.ITEM_SRC_TEMPLATE='<div class="{designerClass}-src {designerClass}-src-{itemType}">{itemLabel}</div>';a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},sourceHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},sourceWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}}};b.extend(a,b.Plugin.Base,{_groups:["horizontal","vertical","content"],_labels:["Layout Horizontal","Layout Vertical","Content"],initializer:function(d){var c=new b.Node.create("<table><tr /></table>");this.get("host").append(c);b.Object.each(this._groups,function(g,f){var e=null,i=null,h=null;e=new b.Node.create(b.substitute(a.ITEM_SRC_TEMPLATE,{itemType:g,designerClass:this.get("designerClass"),itemLabel:this._labels[f]}));i=new b.Node.create("<td />");i.append(e);c.append(i);e.setStyle("height",this.get("sourceHeight"));e.setStyle("width",this.get("sourceWidth"));h=new b.DD.Drag({node:e,groups:[g],dragMode:"intersect"});h.plug(b.Plugin.DDProxy,{moveOnEnd:false});h.plug(b.Plugin.DDConstrained,{constrain2node:[this.get("host"),this.get("host").next()]});h.on("drag:start",b.bind(this._onDragStart,this,h));h.on("drag:end",b.bind(this._onDragEnd,this,h));},this);},destructor:function(){},_onDragStart:function(e,c){var d=e.get("node"),f=e.get("dragNode");d.setStyle("opacity",0.2);f.set("innerHTML",d.get("innerHTML"));f.setStyles({backgroundColor:d.getStyle("backgroundColor"),color:d.getStyle("color"),opacity:0.65});},_onDragEnd:function(d,c){d.get("node").setStyle("opacity",1);}});b.namespace("Bewype");b.Bewype.LayoutDesignerSources=a;},"@VERSION@",{requires:["dd","plugin","substitute"]});YUI.add("bewype-layout-designer-target",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-target";a.NS="layoutDesignerTarget";a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},targetOverHeight:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinHeight:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetOverWidth:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinWidth:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},targetZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},parentNode:{value:null},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},defaultContent:{value:"Text..",validator:function(c){return b.Lang.isString(c);}},layoutWidth:{value:600,setter:"_setLayoutWidth",validator:function(c){return b.Lang.isNumber(c);}},editPanelNode:{value:null,writeOnce:true}};
b.extend(a,b.Plugin.Base,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","content"],initializer:function(d){var h=this.get("host"),f=this.get("targetType"),g=this.get("designerClass")+"-target",c=this.get("layoutWidth"),j=this.get("contentHeight"),i=this.get("contentWidth"),k=this.get("targetMinHeight"),l=this.get("targetMinWidth"),e=null;this._targetNode=new b.Node.create('<div class="'+g+" "+g+"-"+f+'" />');h.append(this._targetNode);if(f==="vertical"||f==="start"){e=h.ancestor("table")?i:c;this._targetNode.setStyle("height",k);this._targetNode.setStyle("width",e);}else{if(f==="horizontal"){this._targetNode.setStyle("height",j);this._targetNode.setStyle("width",l);}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new b.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":b.bind(this._onDropEnter,this),"drop:hit":b.bind(this._onDropHit,this),"drop:exit":b.bind(this._afterDropExit,this)}});if(f!="start"){b.on("mouseenter",b.bind(this._onMouseEnter,this),this._targetNode);b.on("mouseleave",b.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var c=this.get("host"),e=this.get("parentNode"),d=this._targetNode.one("div");if(c.layoutDesignerPlaces){c.unplug(b.Bewype.LayoutDesignerPlaces);}this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(d){d.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(e){e.layoutDesignerTarget.refresh();}else{c.setStyle("height",this.get("targetMinHeight"));this._addTarget(c,"start");}},_onDropEnter:function(c){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh(c);},_afterDropExit:function(c){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh(c);},_onClickRemove:function(c){var d=this.get("host");d.unplug(b.Bewype.LayoutDesignerTarget);if(!this.get("parentNode")){d.setStyle("height",this.get("targetMinHeight"));this._addTarget(d,"start");}},_onMouseEnter:function(c){var e=this.get("targetType"),d=this.get("designerClass")+"-target",f=this._targetNode.one("div");switch(e){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(f){f.setStyle("display","block");}else{f=new b.Node.create('<div class="'+d+"-remove "+d+"-"+e+'-remove" />');this._targetNode.append(f);b.on("click",b.bind(this._onClickRemove,this),f);}this.refresh(c);},_onMouseLeave:function(c){var d=this._targetNode.one("div");d.setStyle("display","none");this._afterDropExit(c);},_addPlaces:function(f,d){var c=this.get("host"),e=(f.ancestor("td"))?c:null;f.plug(b.Bewype.LayoutDesignerPlaces,{placesMinHeight:this.get("targetMinHeight"),placesMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),designerClass:this.get("designerClass"),editPanelNode:this.get("editPanelNode"),placesType:d,parentNode:e});},_addTarget:function(f,d){var c=this.get("host"),e=(f.ancestor("td"))?c:null;f.plug(b.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetMinHeight:this.get("targetMinHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),designerClass:this.get("designerClass"),editPanelNode:this.get("editPanelNode"),targetType:d,parentNode:e});},_getHitType:function(c){var d=c.drag;if(d._groups.vertical){return"vertical";}else{if(d._groups.horizontal){return"horizontal";}else{if(d._groups.content){return"content";}else{return null;}}}},_onDropHitStart:function(c){var e=this._getHitType(c),d=this.get("host");if(e==="content"){return this._afterDropExit(c);}d.unplug(b.Bewype.LayoutDesignerTarget);this._addPlaces(d,e);this._addTarget(d,e);d.layoutDesignerTarget.refresh();},_onDropHitHorizontal:function(c){var d=this.get("host"),e=this._getHitType(c),f=null;switch(e){case"content":d.layoutDesignerPlaces.addContent();break;case"vertical":f=d.layoutDesignerPlaces.addDestNode();this._addPlaces(f,e);this._addTarget(f,e);f.layoutDesignerTarget.refresh();break;}this._afterDropExit(c);},_onDropHitVertical:function(c){var d=this.get("host"),e=this._getHitType(c),f=null;switch(e){case"content":d.layoutDesignerPlaces.addContent();break;case"horizontal":f=d.layoutDesignerPlaces.addDestNode();this._addPlaces(f,e);this._addTarget(f,e);f.layoutDesignerTarget.refresh();break;}this._afterDropExit(c);},_onDropHit:function(c){switch(this.get("targetType")){case"start":return this._onDropHitStart(c);case"horizontal":return this._onDropHitHorizontal(c);case"vertical":return this._onDropHitVertical(c);}},refresh:function(){var h=this.get("host"),d=this.get("targetType"),i=null,g=null,f=null,e=null,c=null,j=null;if(h.layoutDesignerPlaces){i=h.layoutDesignerPlaces.refresh();}else{return;}g=i[0];f=i[1];e=b.Bewype.Utils.getHeight(this._targetNode);c=b.Bewype.Utils.getWidth(this._targetNode);j=this._targetNode.ancestor("td")||this._targetNode.ancestor("div");switch(d){case"vertical":g=b.Bewype.Utils.getHeight(j);if(j.get("tagName").toLowerCase()==="div"){this._targetNode.setY(j.getY()+g-e);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",f);break;case"horizontal":f=b.Bewype.Utils.getWidth(j);this._targetNode.setX(j.getX()+f-c);
if(j.get("tagName").toLowerCase()==="div"){this._targetNode.setY(j.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("height",g);break;}j=h.layoutDesignerPlaces.get("parentNode");if(j){j.layoutDesignerTarget.refresh();}}});b.namespace("Bewype");b.Bewype.LayoutDesignerTarget=a;},"@VERSION@",{requires:["bewype-layout-designer-places"]});YUI.add("bewype-layout-designer",function(a){},"@VERSION@",{use:["bewype-layout-designer-base","bewype-layout-designer-content","bewype-layout-designer-places","bewype-layout-designer-sources","bewype-layout-designer-target"]});