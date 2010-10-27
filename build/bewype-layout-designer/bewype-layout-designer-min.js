YUI.add("bewype-layout-designer-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NODE_SRC_TEMPLATE='<div id="{idSource}"></div>';b.NODE_DST_TEMPLATE='<div id="{idDest}"></div>';b.NAME="layout-designer";b.NS="layoutDesigner";b.ATTRS={idSource:{value:"layout-source",writeOnce:true,validator:function(c){return a.Lang.isString(c);}},idDest:{value:"layout-dest",writeOnce:true,validator:function(c){return a.Lang.isString(c);}},targetOverHeight:{value:20,validator:function(c){return a.Lang.isNumber(c);}},targetMinHeight:{value:8,validator:function(c){return a.Lang.isNumber(c);}},targetOverWidth:{value:20,validator:function(c){return a.Lang.isNumber(c);}},targetMinWidth:{value:8,validator:function(c){return a.Lang.isNumber(c);}},targetZIndex:{value:1,validator:function(c){return a.Lang.isNumber(c);}},contentHeight:{value:40,validator:function(c){return a.Lang.isNumber(c);}},contentWidth:{value:120,validator:function(c){return a.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return a.Lang.isNumber(c);}},contentClass:{value:"content",writeOnce:true,validator:function(c){return a.Lang.isString(c);}},defaultContent:{value:"Click to change your content..",validator:function(c){return a.Lang.isString(c);}},editCallback:{value:null},layoutWidth:{value:600,validator:function(c){return a.Lang.isNumber(c);}}};a.extend(b,a.Plugin.Base,{nodeLayout:null,initializer:function(c){var f=this.get("idSource"),d=this.get("idDest"),e=null;e=new a.Node.create(a.substitute(b.NODE_SRC_TEMPLATE,{idSource:f}));this.get("host").append(e);e.plug(a.Bewype.LayoutDesignerSources,{layoutWidth:this.get("layoutWidth")});this.nodeLayout=new a.Node.create(a.substitute(b.NODE_DST_TEMPLATE,{idDest:d}));this.get("host").append(this.nodeLayout);this.nodeLayout.setStyle("width",this.get("layoutWidth"));this.nodeLayout.plug(a.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinHeight:this.get("targetMinHeight"),targetMinWidth:this.get("targetMinWidth"),targetType:"start",targetZIndex:this.get("targetZIndex"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),idDest:d});},destructor:function(){},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});a.namespace("Bewype");a.Bewype.LayoutDesigner=b;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});YUI.add("bewype-layout-designer-content",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-content";a.NS="layoutDesignerContent";a.ATTRS={contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},contentClass:{value:"content",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultContent:{value:"Click to change your content..",validator:function(c){return b.Lang.isString(c);}},defaultStyle:{value:null},parentNode:{value:null},removeCallback:{value:null},editCallback:{value:null}};b.extend(a,b.Plugin.Base,{_q:null,editing:false,initializer:function(c){var d=this.get("host"),e=this.get("parentNode");d.setStyle("height",this.get("contentHeight"));d.setStyle("width",this.get("contentWidth"));d.set("innerHTML",this.get("defaultContent"));b.on("mouseenter",b.bind(this._onMouseEnter,this),d);e.layoutDesignerPlaces.registerContent(d);this._q=new b.AsyncQueue();},destructor:function(){var e=this.get("host"),g=this.get("parentNode"),d=this.get("contentClass"),c=e.ancestor("div"),f=c.one("div."+d+"-clone");g.layoutDesignerPlaces.unRegisterContent(e);b.detach(e);if(f){b.Event.purgeElement(f,true);f.remove();}e.remove();},_onClickEdit:function(c){var d=this.get("editCallback");if(d){this.editing=true;this.hideClone();d(this.get("host"));}},_onClickRemove:function(c){var d=this.get("removeCallback");if(d){d(this.get("host"));}},hideClone:function(d){if(!d){var f=this.get("host"),e=this.get("contentClass"),c=f.ancestor("div");d=c.one("div."+e+"-clone");}if(d){b.each(d.all("div"),function(h,g){h.setStyle("visibility","hidden");});d.setStyle("visibility","hidden");}},_addCloneNode:function(c){var j=this.get("host"),e=this.get("contentClass"),h=this.get("editCallback"),d=this.get("removeCallback"),i=new b.Node.create('<div class="'+e+'-clone-callbacks" />'),f=null,k=null,g=null;f=j.cloneNode(false);f.set("innerHTML","");f.set("className",e+"-clone");c.append(f);f.setStyle("z-index",this.get("contentZIndex"));f.setStyle("position","absolute");f.setStyle("bottom",0);f.append(i);if(h){k=new b.Node.create('<div class="'+e+'-clone-edit" />');i.append(k);b.on("click",b.bind(this._onClickEdit,this),k);}if(d){g=new b.Node.create('<div class="'+e+'-clone-remove" />');i.append(g);b.on("click",b.bind(this._onClickRemove,this),g);}return f;},_onMouseEnter:function(d){if(this.editing){return;}var f=this.get("host"),h=this.get("parentNode"),e=this.get("contentClass"),c=f.ancestor("div"),g=c.one("div."+e+"-clone");h.layoutDesignerPlaces.cleanContentOver();if(g){b.each(g.all("div"),function(j,i){j.setStyle("visibility","visible");});g.setStyle("visibility","visible");}else{g=this._addCloneNode(c);}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[g]});this._q.run();},_getHeight:function(d,c){c=c?c:0;return parseInt(d.getComputedStyle("height")||d.getAttribute("height"),c);},_getWidth:function(d,c){c=c?c:0;return parseInt(d.getComputedStyle("width")||d.getAttribute("width"),c);},getContentHeight:function(){var d=this.get("host"),c=b.Bewype.Utils.getHeight(d),e=b.Bewype.Utils.getStyleValue(d,"paddingTop")||0;return c+e;},getContentWidth:function(){var d=this.get("host"),e=b.Bewype.Utils.getWidth(d),c=b.Bewype.Utils.getStyleValue(d,"paddingLeft")||0;
return e+c;},refresh:function(d,h){var f=this.get("host"),i=this.get("parentNode"),e=this.get("contentClass"),c=f.ancestor("div"),g=c.one("div."+e+"-clone");if(g){g.setStyle("height",this.getContentHeight());g.setStyle("width",this.getContentWidth());}i.layoutDesignerTarget.refresh();}});b.namespace("Bewype");b.Bewype.LayoutDesignerContent=a;},"@VERSION@",{requires:["async-queue","plugin","substitute"]});YUI.add("bewype-layout-designer-places",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-places";a.NS="layoutDesignerPlaces";a.H_PLACES_TEMPLATE='<table class="{placesClass}-horizontal">';a.H_PLACES_TEMPLATE+="<tr />";a.H_PLACES_TEMPLATE+="</table>";a.V_PLACES_TEMPLATE='<table class="{placesClass}-vertical"></table>';a.C_TEMPLATE='<div class="{contentClass}">{defaultContent}</div>';a.H_DEST_TEMPLATE='<td class="{destClass}-horizontal"><div class="container-{destClass}"></div></td>';a.V_DEST_TEMPLATE='<tr class="{destClass}-vertical">';a.V_DEST_TEMPLATE+="<td>";a.V_DEST_TEMPLATE+='<div class="container-{destClass}"></div>';a.V_DEST_TEMPLATE+="</td>";a.V_DEST_TEMPLATE+="</tr>";a.ATTRS={contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},placesType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},placesClass:{value:"places",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},destClass:{value:"dest",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},contentClass:{value:"content",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultContent:{value:"Click to change your content..",validator:function(c){return b.Lang.isString(c);}},parentNode:{value:null},editCallback:{value:null}};b.extend(a,b.Plugin.Base,{placesNode:null,contents:null,sortable:null,initializer:function(d){var f=this.get("host"),e=this.get("placesType"),c=a.H_PLACES_TEMPLATE,h=a.V_PLACES_TEMPLATE,i=(e==="horizontal")?c:h,g=this.get("parentNode");this.placesNode=new b.Node.create(b.substitute(i,{placesClass:this.get("placesClass")}));f.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));this._initSortable();if(g){g.layoutDesignerPlaces.registerContent(f);}else{b.DD.DDM.on("drag:enter",this._onEnterGotcha);}this.contents=[];},_initSortable:function(){var c=this.get("placesType"),d=(c==="horizontal")?"td":"tr";if(this.sortable){this.sortable.destroy();}this.sortable=new b.Sortable({container:this.placesNode,nodes:d,opacity:".2"});},_onEnterGotcha:function(m){var f=m.drag,h=m.drag.get("node"),c=h.one("div.content"),l=m.drop.get("node"),g=l.ancestor("div"),j=c?c.layoutDesignerContent:null,d=g.layoutDesignerPlaces,k=null,i=null,e=null,o=null,n=null;if(j&&d.get("placesType")==="vertical"&&d.contents.indexOf(c)==-1){k=c.layoutDesignerContent.get("parentNode");i=c.get("innerHTML");e=c.getStyle("cssText");o=c.ancestor("td");if(o.drop){c.unplug(b.Bewype.LayoutDesignerContent);o.drop.removeFromGroup(k.layoutDesignerPlaces.sortable);o.remove();n=k.layoutDesignerPlaces.addContent();n.set("innerHTML",i);n.setStyle("cssText",e);k.layoutDesignerTarget.refresh();f.removeFromGroup(k.layoutDesignerPlaces.sortable);f.stopDrag();f.end();f.destroy();m.stopPropagation();}}},destructor:function(){var c=this.get("host"),d=this.get("parentNode");b.Object.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){f.layoutDesignerPlaces.destroy();}else{this.removeContent(f);}},this);if(d){d.layoutDesignerPlaces.unRegisterContent(c);}this.placesNode.remove();},_getHeight:function(d,c){c=c?c:0;return parseInt(d.getComputedStyle("height")||d.getAttribute("height"),c);},_getWidth:function(d,c){c=c?c:0;return parseInt(d.getComputedStyle("width")||d.getAttribute("width"),c);},hasSubPlaces:function(){var c=false;b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=true;}});return c;},getAvailablePlace:function(){var e=this.get("parentNode")||this.placesNode.ancestor("div"),c=null,d=null;switch(this.get("placesType")){case"vertical":return null;case"horizontal":c=this._getWidth(e);d=this.getPlacesWidth();return c-d;}},hasPlace:function(){var e=this.get("parentNode")||this.placesNode.ancestor("div"),c=null,d=null;switch(this.get("placesType")){case"vertical":return true;case"horizontal":c=this._getWidth(e);d=this.getPlacesWidth();return c>=(d+this.get("contentWidth"));}},getPlacesWidth:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesWidth();}else{f=e.layoutDesignerContent.getContentWidth();}if(f>c){c=f;}});break;case"horizontal":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesWidth();}else{c+=e.layoutDesignerContent.getContentWidth();}});break;}return(c===0)?this.get("contentWidth"):c;},getPlacesHeight:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesHeight();}else{c+=e.layoutDesignerContent.getContentHeight();}});break;case"horizontal":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesHeight();}else{f=e.layoutDesignerContent.getContentHeight();}if(f>c){c=f;}});break;}return(c===0)?this.get("contentHeight"):c;},refresh:function(c){var d=this.get("placesType"),e=this.getPlacesHeight(),g=this.getPlacesWidth(),f=this.get("parentNode");this.placesNode.setStyle("height",e);this.placesNode.setStyle("width",g);switch(d){case"vertical":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;h.setStyle("width",g);}});break;case"horizontal":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;}else{h=j.layoutDesignerContent.get("host");
}h.ancestor("td").setStyle("height",e);h.ancestor("td").setStyle("vertical-align","top");});break;}if(!c){if(f){f.layoutDesignerTarget.refresh();}else{this.placesNode.ancestor("div").setStyle("height",e);}}return[e,g];},cleanContentOver:function(){b.each(this.contents,function(d,c){if(d.layoutDesignerContent){d.layoutDesignerContent._q.stop();d.layoutDesignerContent.hideClone();}});},addDestNode:function(){if(!this.hasPlace()){return null;}var d=null,c=this.placesNode.one("tr");switch(this.get("placesType")){case"horizontal":d=new b.Node.create(b.substitute(a.H_DEST_TEMPLATE,{destClass:this.get("destClass")}));c.append(d);break;case"vertical":d=new b.Node.create(b.substitute(a.V_DEST_TEMPLATE,{destClass:this.get("destClass")}));this.placesNode.append(d);break;}return d.one("div");},registerContent:function(c){this.contents.push(c);},unRegisterContent:function(c){var d=this.contents.indexOf(c);this.contents.splice(d,1);},addContent:function(){if(!this.hasPlace()){return null;}var d=this.addDestNode(),c=new b.Node.create(b.substitute(a.C_TEMPLATE,{contentClass:this.get("contentClass")}));d.append(c);c.plug(b.Bewype.LayoutDesignerContent,{contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),parentNode:this.get("host"),editCallback:this.get("editCallback"),removeCallback:b.bind(this.removeContent,this)});return c;},removeContent:function(c){var e=null,d=this.get("host");switch(this.get("placesType")){case"horizontal":e=c.ancestor("td");break;case"vertical":e=c.ancestor("tr");break;}this.unRegisterContent(c);e.remove();d.layoutDesignerTarget.refresh();},getContents:function(){var c=[];b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=c.concat(e.layoutDesignerPlaces.getContents());}else{c.push(e);}});return c;}});b.namespace("Bewype");b.Bewype.LayoutDesignerPlaces=a;},"@VERSION@",{requires:["sortable","bewype-layout-designer-content"]});YUI.add("bewype-layout-designer-sources",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-sources";a.NS="layoutDesignerSources";a.ITEM_SRC_TEMPLATE='<div id="src-{itemType}" class="{itemClass}">{itemLabel}</div>';a.ATTRS={sourceHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},sourceWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},sourceClass:{value:"source-item",writeOnce:true,validator:function(c){return b.Lang.isString(c);}}};b.extend(a,b.Plugin.Base,{_groups:["horizontal","vertical","content"],_labels:["Layout Horizontal","Layout Vertical","Content"],initializer:function(d){var c=new b.Node.create("<table><tr /></table>");this.get("host").append(c);b.Object.each(this._groups,function(g,f){var e=null,i=null,h=null;e=new b.Node.create(b.substitute(a.ITEM_SRC_TEMPLATE,{itemType:g,itemClass:this.get("sourceClass"),itemLabel:this._labels[f]}));i=new b.Node.create("<td />");i.append(e);c.append(i);e.setStyle("height",this.get("sourceHeight"));e.setStyle("width",this.get("sourceWidth"));h=new b.DD.Drag({node:e,groups:[g],dragMode:"intersect"});h.plug(b.Plugin.DDProxy,{moveOnEnd:false});h.plug(b.Plugin.DDConstrained,{constrain2node:[this.get("host"),this.get("host").next()]});h.on("drag:start",b.bind(this._onDragStart,this,h));h.on("drag:end",b.bind(this._onDragEnd,this,h));},this);},destructor:function(){},_onDragStart:function(e,c){var d=e.get("node"),f=e.get("dragNode");d.setStyle("opacity",0.2);f.set("innerHTML",d.get("innerHTML"));f.setStyles({backgroundColor:d.getStyle("backgroundColor"),color:d.getStyle("color"),opacity:0.65});},_onDragEnd:function(d,c){d.get("node").setStyle("opacity",1);}});b.namespace("Bewype");b.Bewype.LayoutDesignerSources=a;},"@VERSION@",{requires:["dd","plugin","substitute"]});YUI.add("bewype-layout-designer-target",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-target";a.NS="layoutDesignerTarget";a.ATTRS={targetOverHeight:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinHeight:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetOverWidth:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinWidth:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},targetClass:{value:"target",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},targetZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},placesClass:{value:"places",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},parentNode:{value:null},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},contentClass:{value:"content",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultContent:{value:"Click to change your content..",validator:function(c){return b.Lang.isString(c);}},editCallback:{value:null},idDest:{value:"layout-dest",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},layoutWidth:{value:600,setter:"_setLayoutWidth",validator:function(c){return b.Lang.isNumber(c);}}};b.extend(a,b.Plugin.Base,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","content"],initializer:function(d){var g=this.get("host"),f=this.get("targetType"),c=this.get("layoutWidth"),i=this.get("contentHeight"),h=this.get("contentWidth"),j=this.get("targetMinHeight"),k=this.get("targetMinWidth"),e=null;this._targetNode=new b.Node.create('<div class="'+this.get("targetClass")+"-"+f+'" />');g.append(this._targetNode);if(f==="vertical"||f==="start"){e=g.ancestor("table")?h:c;this._targetNode.setStyle("height",j);this._targetNode.setStyle("width",e);}else{if(f==="horizontal"){this._targetNode.setStyle("height",i);this._targetNode.setStyle("width",k);
}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new b.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":b.bind(this._onDropEnter,this),"drop:hit":b.bind(this._onDropHit,this),"drop:exit":b.bind(this._afterDropExit,this)}});if(f!="start"){b.on("mouseenter",b.bind(this._onMouseEnter,this),this._targetNode);b.on("mouseleave",b.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var c=this.get("host"),e=this.get("parentNode"),d=this._targetNode.one("div"),f=null;if(c.layoutDesignerPlaces){c.unplug(b.Bewype.LayoutDesignerPlaces);}this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(d){d.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(e){e.layoutDesignerTarget.refresh();}else{f=b.one("#"+this.get("idDest"));f.setStyle("height",this.get("targetMinHeight"));this._addTarget(f,"start");}},_getHeight:function(d,c){c=c?c:0;return parseInt(d.getComputedStyle("height")||d.getAttribute("height"),c);},_getWidth:function(d,c){c=c?c:0;return parseInt(d.getComputedStyle("width")||d.getAttribute("width"),c);},_onDropEnter:function(c){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh(c);},_afterDropExit:function(c){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh(c);},_onClickRemove:function(c){var d=this.get("host"),e=null;d.unplug(b.Bewype.LayoutDesignerTarget);if(!this.get("parentNode")){e=b.one("#"+this.get("idDest"));e.setStyle("height",this.get("targetMinHeight"));this._addTarget(e,"start");}},_onMouseEnter:function(d){var c=this.get("targetClass"),e=this.get("targetType"),f=this._targetNode.one("div");switch(e){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(f){f.setStyle("display","block");}else{f=new b.Node.create('<div class="'+c+"-"+e+'-remove" />');this._targetNode.append(f);b.on("click",b.bind(this._onClickRemove,this),f);}this.refresh(d);},_onMouseLeave:function(c){var d=this._targetNode.one("div");d.setStyle("display","none");this._afterDropExit(c);},_addPlaces:function(f,d){var c=this.get("host"),e=(f.ancestor("td"))?c:null;f.plug(b.Bewype.LayoutDesignerPlaces,{placesMinHeight:this.get("targetMinHeight"),placesMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),placesClass:this.get("placesClass"),placesType:d,parentNode:e});},_addTarget:function(f,d){var c=this.get("host"),e=(f.ancestor("td"))?c:null;f.plug(b.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetMinHeight:this.get("targetMinHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),targetType:d,parentNode:e});},_getHitType:function(c){var d=c.drag;if(d._groups.vertical){return"vertical";}else{if(d._groups.horizontal){return"horizontal";}else{if(d._groups.content){return"content";}else{return null;}}}},_onDropHitStart:function(c){var e=this._getHitType(c),d=this.get("host");if(e==="content"){return this._afterDropExit(c);}d.unplug(b.Bewype.LayoutDesignerTarget);this._addPlaces(d,e);this._addTarget(d,e);d.layoutDesignerTarget.refresh();},_onDropHitHorizontal:function(c){var d=this.get("host"),e=this._getHitType(c),f=null;switch(e){case"content":d.layoutDesignerPlaces.addContent();break;case"vertical":f=d.layoutDesignerPlaces.addDestNode();this._addPlaces(f,e);this._addTarget(f,e);f.layoutDesignerTarget.refresh();break;}this._afterDropExit(c);},_onDropHitVertical:function(c){var d=this.get("host"),e=this._getHitType(c),f=null;switch(e){case"content":d.layoutDesignerPlaces.addContent();break;case"horizontal":f=d.layoutDesignerPlaces.addDestNode();this._addPlaces(f,e);this._addTarget(f,e);f.layoutDesignerTarget.refresh();break;}this._afterDropExit(c);},_onDropHit:function(c){switch(this.get("targetType")){case"start":return this._onDropHitStart(c);case"horizontal":return this._onDropHitHorizontal(c);case"vertical":return this._onDropHitVertical(c);}},refresh:function(){var h=this.get("host"),d=this.get("targetType"),i=null,g=null,f=null,e=null,c=null,j=null;if(h.layoutDesignerPlaces){i=h.layoutDesignerPlaces.refresh();}else{return;}g=i[0];f=i[1];e=this._getHeight(this._targetNode);c=this._getWidth(this._targetNode);j=this._targetNode.ancestor("td")||this._targetNode.ancestor("div");switch(d){case"vertical":g=this._getHeight(j);if(j.get("tagName").toLowerCase()==="div"){this._targetNode.setY(j.getY()+g-e);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",f);break;case"horizontal":f=this._getWidth(j);this._targetNode.setX(j.getX()+f-c);if(j.get("tagName").toLowerCase()==="div"){this._targetNode.setY(j.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("height",g);break;}j=h.layoutDesignerPlaces.get("parentNode");if(j){j.layoutDesignerTarget.refresh();}}});b.namespace("Bewype");b.Bewype.LayoutDesignerTarget=a;},"@VERSION@",{requires:["bewype-layout-designer-places"]});YUI.add("bewype-layout-designer",function(a){},"@VERSION@",{use:["bewype-layout-designer-base","bewype-layout-designer-content","bewype-layout-designer-places","bewype-layout-designer-sources","bewype-layout-designer-target"]});
