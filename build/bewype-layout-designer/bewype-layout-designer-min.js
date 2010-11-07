YUI.add("bewype-layout-designer-config",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-config";a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},targetOverHeight:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinHeight:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetOverWidth:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinWidth:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},defaultContent:{value:"Text..",validator:function(c){return b.Lang.isString(c);}},baseNode:{value:null,writeOnce:true},parentNode:{value:null},layoutWidth:{value:600,validator:function(c){return b.Lang.isNumber(c);}},placesType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},contentType:{value:"text",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultText:{value:"Text ...",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultImg:{value:b.config.base+"bewype-layout-designer/assets/blank.png",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},editorTextButtons:{value:["height","width","bold","italic","underline","title","font-family","font-size","text-align","color","background-color","url","reset","apply"]},editorImageButtons:{value:["file","background-color","height","width","padding-top","padding-right","padding-bottom","padding-left","reset","apply"]}};b.extend(a,b.Plugin.Base);b.namespace("Bewype");b.Bewype.LayoutDesignerConfig=a;},"@VERSION@",{requires:["plugin"]});YUI.add("bewype-layout-designer-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NODE_SRC_TEMPLATE='<div class="{designerClass}-sources"></div>';b.NODE_PAN_TEMPLATE='<div class="{designerClass}-edit-panel"></div>';b.NODE_LAYOUT_TEMPLATE='<div class="{designerClass}-layout"></div>';b.NAME="layout-designer";b.NS="layoutDesigner";a.extend(b,a.Bewype.LayoutDesignerConfig,{nodeLayout:null,initializer:function(c){this.setAttrs(c);var d=this.get("host"),f=null,e=null;f=new a.Node.create(a.substitute(b.NODE_SRC_TEMPLATE,{designerClass:this.get("designerClass")}));d.append(f);f.plug(a.Bewype.LayoutDesignerSources,{layoutWidth:this.get("layoutWidth")});e=new a.Node.create(a.substitute(b.NODE_PAN_TEMPLATE,{designerClass:this.get("designerClass")}));d.append(e);this.nodeLayout=new a.Node.create(a.substitute(b.NODE_LAYOUT_TEMPLATE,{designerClass:this.get("designerClass")}));d.append(this.nodeLayout);this.nodeLayout.setStyle("width",this.get("layoutWidth"));c.baseNode=d;c.targetType="start";this.nodeLayout.plug(a.Bewype.LayoutDesignerTarget,c);a.DD.DDM.on("drop:hit",a.bind(this._dropHitGotcha,this));},destructor:function(){this.nodeLayout.unplug(a.Bewype.LayoutDesignerTarget);},_dropHitGotcha:function(m){var e=m.drag.get("node"),o=e.get("tagName").toLowerCase(),i="."+this.get("designerClass")+"-places",n="."+this.get("designerClass")+"-container",k=e.one(n),h=e.one(i)?k:e.one(n),c=null,f=null,g=o==="li"?"ul":"table",j=k?k.ancestor(g):null,l=j?j.ancestor("div"):null,d=null;if(!h||!l.layoutDesignerPlaces){return;}else{if(h.layoutDesignerContent){f=h.layoutDesignerContent.get("parentNode");}else{if(h.layoutDesignerPlaces){f=h.layoutDesignerPlaces.get("parentNode");}else{return;}}}if(f!=l){f.layoutDesignerPlaces.unRegisterContent(h);l.layoutDesignerPlaces.registerContent(h);h.layoutDesignerContent.set("parentNode",l);d=l.layoutDesignerPlaces.getMaxWidth();l.layoutDesignerTarget.refresh(d);}},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});a.namespace("Bewype");a.Bewype.LayoutDesigner=b;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});YUI.add("bewype-layout-designer-content-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NAME="layout-designer-content";b.NS="layoutDesignerContent";a.extend(b,a.Bewype.LayoutDesignerConfig,{_q:null,editing:false,_init:function(d){var c=this.get("host"),f=this.get("parentNode"),e=null;e=new a.Node.create(a.substitute(d,{designerClass:this.get("designerClass"),contentType:this.get("contentType")}));c.append(e);e.setStyle("height",this.get("contentHeight"));e.setStyle("width",this.get("contentWidth"));a.on("mouseenter",a.bind(this._onMouseEnter,this),c);f.layoutDesignerPlaces.registerContent(c);this._q=new a.AsyncQueue();return e;},initializer:function(c){this.setAttrs(c);},destructor:function(){var e=this.get("host"),h=this.get("parentNode"),d=this.get("designerClass")+"-content",f=this.get("contentType")==="image"?"img.":"div.",g=e.one(f+d),c=e.one("div."+d+"-clone");this._detachEditor();h.layoutDesignerPlaces.unRegisterContent(e);a.detach(e);if(c){a.Event.purgeElement(c,true);c.remove();}e.replace(g);},_detachEditor:function(){var f=this.get("host"),e=this.get("baseNode"),j=this.get("designerClass")+"-sources",d=this.get("designerClass")+"-edit-panel",i=e.one("div."+j),c=e.one("div."+d),h=this.get("contentType")==="image"?a.Bewype.EditorTag:a.Bewype.EditorText,g=this.getContentNode();this.editing=false;if(c.bewypeEditorPanel){c.unplug(a.Bewype.EditorPanel);g.unplug(h);f.detachAll("bewype-editor:onClose");f.detachAll("bewype-editor:onChange");this.refresh();}c.setStyle("display","none");i.setStyle("display","block");this._refreshCloneNode();return true;},_attachEditor:function(){var n=this.get("host"),g=this.get("baseNode"),d=this.get("parentNode"),m=this.get("designerClass")+"-sources",l=this.get("designerClass")+"-edit-panel",r=g.one("div."+m),k=g.one("div."+l),q=d.layoutDesignerPlaces,f=q.get("placesType"),i=this.get("contentType")==="image"?a.Bewype.EditorTag:a.Bewype.EditorText,e=this.get("contentType")==="image"?"editorImageButtons":"editorTextButtons",j=this.getContentNode(),h=null,p=null,o=(f==="vertical")?q.get("parentNode"):null,c=o?o.layoutDesignerPlaces:null;
r.setStyle("display","none");k.setStyle("display","block");if(f==="vertical"){p=d.layoutDesignerPlaces.getMaxWidth();p+=c?c.getAvailablePlace():0;}else{p=d.layoutDesignerPlaces.getAvailablePlace();p+=this.getContentWidth();}h={panelNode:k,spinnerMaxWidth:p,activeButtons:this.get(e)};j.plug(i,h);a.on("bewype-editor:onClose",a.bind(this._detachEditor,this),j);a.on("bewype-editor:onChange",a.bind(this.refresh,this),j);this.editing=true;},_onClickEdit:function(c){var d=this.get("parentNode");a.each(d.layoutDesignerPlaces.getContents(),function(f,e){f.layoutDesignerContent._detachEditor();});this._attachEditor();},_onClickRemove:function(c){var d=this.get("host"),e=this.get("parentNode");e.layoutDesignerPlaces.removeContent(d);},hideClone:function(c){if(!c){var e=this.get("host"),d=this.get("designerClass")+"-content";c=e.one("div."+d+"-clone");}if(c){a.each(c.all("div"),function(g,f){g.setStyle("visibility","hidden");});c.setStyle("visibility","hidden");}},_addCloneNode:function(){var f=this.get("host"),e=this.get("designerClass")+"-content",c=new a.Node.create('<div class="'+e+'-clone-callbacks" />'),d=null,g=null,h=null;d=f.cloneNode(false);d.set("innerHTML","");d.set("className",e+"-clone");f.append(d);d.setStyle("z-index",this.get("contentZIndex"));d.setStyle("position","absolute");d.setStyle("bottom",0);d.append(c);g=new a.Node.create('<div class="'+e+'-clone-edit" />');c.append(g);a.on("click",a.bind(this._onClickEdit,this),g);h=new a.Node.create('<div class="'+e+'-clone-remove" />');c.append(h);a.on("click",a.bind(this._onClickRemove,this),h);this._refreshCloneNode();return d;},_onMouseEnter:function(c){if(this.editing){return;}var f=this.get("host"),g=this.get("parentNode"),e=this.get("designerClass")+"-content",d=f.one("div."+e+"-clone");g.layoutDesignerPlaces.cleanContentOver();if(d){a.each(d.all("div"),function(i,h){i.setStyle("visibility","visible");});d.setStyle("visibility","visible");}else{d=this._addCloneNode();}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[d]});this._q.run();},getContentHeight:function(){var f=this.getContentNode(),c=a.Bewype.Utils.getHeight(f),e=a.Bewype.Utils.getStyleValue(f,"paddingTop")||0,d=a.Bewype.Utils.getStyleValue(f,"paddingBottom")||0;return c+e+d;},getContentWidth:function(){var f=this.getContentNode(),e=a.Bewype.Utils.getWidth(f),d=a.Bewype.Utils.getStyleValue(f,"paddingRight")||0,c=a.Bewype.Utils.getStyleValue(f,"paddingLeft")||0;return e+c+d;},getContentNode:function(){var d=this.get("host"),c=this.get("designerClass")+"-content",e=this.get("contentType")==="image"?"img.":"div.";return d.one(e+c);},_refreshCloneNode:function(g){var f=this.get("host"),e=this.get("designerClass")+"-content",d=f.one("div."+e+"-clone"),h=this.getContentHeight(),c=g||this.getContentWidth();if(d){d.setStyle("height",h);d.setStyle("width",c);}},refresh:function(c){var e=this.get("parentNode"),d=c?this.getContentNode():null;if(d){d.setStyle("width",c);d.setStyle("paddingLeft",0);d.setStyle("paddingRight",0);}this._refreshCloneNode(c);e.layoutDesignerTarget.refresh();}});a.namespace("Bewype");a.Bewype.LayoutDesignerContentBase=b;},"@VERSION@",{requires:["async-queue","plugin","substitute"]});YUI.add("bewype-layout-designer-content-image",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.C_TEMPLATE='<image class="{designerClass}-content ';a.C_TEMPLATE+='{designerClass}-content-{contentType}" ';a.C_TEMPLATE+='src="{defaultImg}" />';a.NAME="layout-designer-content-image";a.NS="layoutDesignerContent";b.extend(a,b.Bewype.LayoutDesignerContentBase,{_q:null,editing:false,initializer:function(c){this.setAttrs(c);var d=b.substitute(a.C_TEMPLATE,{defaultImg:this.get("defaultImg")});this._init(d);}});b.namespace("Bewype");b.Bewype.LayoutDesignerContentImage=a;},"@VERSION@",{requires:["bewype-editor","bewype-layout-designer-content-base"]});YUI.add("bewype-layout-designer-content-text",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.C_TEMPLATE='<div class="{designerClass}-content ';a.C_TEMPLATE+='{designerClass}-content-{contentType}">';a.C_TEMPLATE+="</div>";a.NAME="layout-designer-content-text";a.NS="layoutDesignerContent";b.extend(a,b.Bewype.LayoutDesignerContentBase,{_q:null,editing:false,initializer:function(c){this.setAttrs(c);var d=this._init(a.C_TEMPLATE);d.set("innerHTML",this.get("defaultText"));}});b.namespace("Bewype");b.Bewype.LayoutDesignerContentText=a;},"@VERSION@",{requires:["bewype-editor","bewype-layout-designer-content-base"]});YUI.add("bewype-layout-designer-places",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-places";a.NS="layoutDesignerPlaces";a.H_PLACES_TEMPLATE='<table class="{designerClass}-places {designerClass}-places-horizontal">';a.H_PLACES_TEMPLATE+="<tr />";a.H_PLACES_TEMPLATE+="</table>";a.V_PLACES_TEMPLATE='<ul class="{designerClass}-places {designerClass}-places-vertical"></ul>';a.H_DEST_TEMPLATE='<td class="{designerClass}-cell {designerClass}-cell-horizontal">';a.H_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';a.H_DEST_TEMPLATE+="</td>";a.V_DEST_TEMPLATE='<li class="{designerClass}-cell {designerClass}-cell-vertical">';a.V_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';a.V_DEST_TEMPLATE+="</li>";b.extend(a,b.Bewype.LayoutDesignerConfig,{placesNode:null,contents:null,sortable:null,initializer:function(d){this.setAttrs(d);var f=this.get("host"),e=this.get("placesType"),c=a.H_PLACES_TEMPLATE,h=a.V_PLACES_TEMPLATE,i=(e==="horizontal")?c:h,g=this.get("parentNode");this.placesNode=new b.Node.create(b.substitute(i,{designerClass:this.get("designerClass")}));f.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));this._initSortable();if(g){g.layoutDesignerPlaces.registerContent(f);}this.contents=[];},_initSortable:function(){var c=this.get("placesType"),d=(c==="horizontal")?"td":"li";
if(this.sortable){this.sortable.destroy();}this.sortable=new b.Sortable({container:this.placesNode,nodes:d,opacity:".2"});},destructor:function(){var c=this.get("host"),d=this.get("parentNode");b.Object.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){f.unplug(b.Bewype.LayoutDesignerPlaces);}else{this.removeContent(f);}},this);if(d){d.layoutDesignerPlaces.unRegisterContent(c);}},hasSubPlaces:function(){var c=false;b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=true;}});return c;},getMaxWidth:function(){return b.Bewype.Utils.getWidth(this.get("host"));},getAvailablePlace:function(){var d=this.get("placesType"),e=this.getMaxWidth(),c=this.getPlacesWidth();if(d==="vertical"){return c===0?e:c;}else{return e-c;}},hasPlace:function(d){var c=this.getAvailablePlace(),e=this.get("placesType");d=d?d:this.get("contentWidth");return e==="vertical"||c>=d;},getPlacesWidth:function(){var c=0,d=this.get("parentNode")||this.placesNode.ancestor("div");switch(this.get("placesType")){case"vertical":if(!this.get("parentNode")){return b.Bewype.Utils.getWidth(d);}b.each(this.contents,function(f,e){var g=0;if(f.layoutDesignerPlaces){g=f.layoutDesignerPlaces.getPlacesWidth();}else{g=f.layoutDesignerContent.getContentWidth();}if(g>c){c=g;}});break;case"horizontal":b.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){c+=f.layoutDesignerPlaces.getPlacesWidth();}else{c+=f.layoutDesignerContent.getContentWidth();}});break;}return c;},getPlacesHeight:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesHeight();}else{c+=e.layoutDesignerContent.getContentHeight();}});break;case"horizontal":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesHeight();}else{f=e.layoutDesignerContent.getContentHeight();}if(f>c){c=f;}});c=(c===0)?this.get("contentHeight"):c;break;}return c;},refresh:function(d){var c=this.get("placesType"),e=this.getPlacesHeight(),g=d?d:this.getPlacesWidth(),f=this.get("parentNode");e=e===0?this.get("contentHeight"):e;g=g===0?this.getAvailablePlace():g;this.placesNode.setStyle("height",e);this.placesNode.setStyle("width",g);switch(c){case"vertical":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;h.setStyle("width",g);if(d){j.layoutDesignerTarget.refresh(d);}}else{if(d){j.layoutDesignerContent.refresh(d);}}});break;case"horizontal":b.Object.each(this.contents,function(j,i){var h=null,l=d?(d/this.contents.length):null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;if(l){j.layoutDesignerTarget.refresh(l);}}else{h=j.layoutDesignerContent.get("host");if(l){j.layoutDesignerContent.refresh(l);}}h.ancestor("td").setStyle("height",e);h.ancestor("td").setStyle("vertical-align","top");},this);break;}if(!f){this.placesNode.ancestor("div").setStyle("height",e);}return[e,g];},cleanContentOver:function(){b.each(this.contents,function(d,c){if(d.layoutDesignerContent){d.layoutDesignerContent._q.stop();d.layoutDesignerContent.hideClone();}});},addDestNode:function(){var c=null;switch(this.get("placesType")){case"horizontal":c=new b.Node.create(b.substitute(a.H_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.one("tr").append(c);break;case"vertical":c=new b.Node.create(b.substitute(a.V_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.append(c);break;}return c.one("div");},registerContent:function(c){this.contents.push(c);},unRegisterContent:function(c){var d=this.contents.indexOf(c);if(d!=-1){this.contents.splice(d,1);}},addContent:function(h){var d=this.get("placesType"),g=this.addDestNode(),c=null,f=this.getAttrs(),e=this.getMaxWidth();f.contentType=h;f.parentNode=this.get("host");f.contentWidth=d==="vertical"?e:this.getAvailablePlace();switch(h){case"text":c=b.Bewype.LayoutDesignerContentText;break;case"image":c=b.Bewype.LayoutDesignerContentImage;break;default:return;}g.plug(c,f);return e;},removeContent:function(c,g){var h=null,e=this.get("host"),f=c.layoutDesignerContent.get("contentType"),d=f==="image"?b.Bewype.LayoutDesignerContentImage:b.Bewype.LayoutDesignerContentText;switch(this.get("placesType")){case"horizontal":h=c.ancestor("td");break;case"vertical":h=c.ancestor("li");break;}this.unRegisterContent(c);c.unplug(d);h.remove(true);if(e.layoutDesignerTarget){e.layoutDesignerTarget.refresh();}},getContents:function(){var c=[];b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=c.concat(e.layoutDesignerPlaces.getContents());}else{c.push(e);}});return c;}});b.namespace("Bewype");b.Bewype.LayoutDesignerPlaces=a;},"@VERSION@",{requires:["sortable","dd-constrain","bewype-layout-designer-content-text"]});YUI.add("bewype-layout-designer-sources",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-sources";a.NS="layoutDesignerSources";a.ITEM_SRC_TEMPLATE='<div class="{designerClass}-src {designerClass}-src-{itemType}">{itemLabel}</div>';a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},sourceHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},sourceWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}}};b.extend(a,b.Plugin.Base,{_groups:["horizontal","vertical","text","image"],_labels:["Layout Horizontal","Layout Vertical","Text","Image"],initializer:function(d){var c=new b.Node.create("<table><tr /></table>");this.get("host").append(c);b.Object.each(this._groups,function(g,f){var e=null,i=null,h=null;e=new b.Node.create(b.substitute(a.ITEM_SRC_TEMPLATE,{itemType:g,designerClass:this.get("designerClass"),itemLabel:this._labels[f]}));i=new b.Node.create("<td />");i.append(e);c.append(i);e.setStyle("height",this.get("sourceHeight"));e.setStyle("width",this.get("sourceWidth"));h=new b.DD.Drag({node:e,groups:[g],dragMode:"intersect"});h.plug(b.Plugin.DDProxy,{moveOnEnd:false});
h.plug(b.Plugin.DDConstrained,{constrain2node:[this.get("host"),this.get("host").next()]});h.on("drag:start",b.bind(this._onDragStart,this,h));h.on("drag:end",b.bind(this._onDragEnd,this,h));},this);},destructor:function(){},_onDragStart:function(e,c){var d=e.get("node"),f=e.get("dragNode");d.setStyle("opacity",0.2);f.set("innerHTML",d.get("innerHTML"));f.setStyles({backgroundColor:d.getStyle("backgroundColor"),color:d.getStyle("color"),opacity:0.65});},_onDragEnd:function(d,c){d.get("node").setStyle("opacity",1);}});b.namespace("Bewype");b.Bewype.LayoutDesignerSources=a;},"@VERSION@",{requires:["dd","plugin","substitute"]});YUI.add("bewype-layout-designer-target",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-target";a.NS="layoutDesignerTarget";b.extend(a,b.Bewype.LayoutDesignerConfig,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","text","image"],initializer:function(d){this.setAttrs(d);var h=this.get("host"),f=this.get("targetType"),g=this.get("designerClass")+"-target",c=this.get("layoutWidth"),j=this.get("contentHeight"),i=this.get("contentWidth"),k=this.get("targetMinHeight"),l=this.get("targetMinWidth"),e=null;this._targetNode=new b.Node.create('<div class="'+g+" "+g+"-"+f+'" />');h.append(this._targetNode);if(f==="vertical"||f==="start"){e=h.ancestor("table")?i:c;this._targetNode.setStyle("height",k);this._targetNode.setStyle("width",e);}else{if(f==="horizontal"){this._targetNode.setStyle("height",j);this._targetNode.setStyle("width",l);}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new b.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":b.bind(this._onDropEnter,this),"drop:hit":b.bind(this._onDropHit,this),"drop:exit":b.bind(this._afterDropExit,this)}});if(f!="start"){b.on("mouseenter",b.bind(this._onMouseEnter,this),this._targetNode);b.on("mouseleave",b.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var c=this.get("host"),e=this.get("parentNode"),d=this._targetNode.one("div");this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(d){d.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(e){e.layoutDesignerTarget.refresh();}else{c.setStyle("height",this.get("targetMinHeight"));this._addTarget(c,"start");}},_onDropEnter:function(c){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh();},_afterDropExit:function(c,d){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh(d);},_onClickRemove:function(c){var e=this.get("host"),f=this.get("parentNode"),d=e.layoutDesignerPlaces.get("placesType"),g=e.layoutDesignerPlaces.placesNode;switch(d){case"horizontal":e.one("table").remove();break;case"vertical":e.one("ul").remove();break;}e.unplug(b.Bewype.LayoutDesignerTarget);e.unplug(b.Bewype.LayoutDesignerPlaces);if(f&&f.layoutDesignerTarget){e.remove(true);f.layoutDesignerTarget.refresh();}else{e.setStyle("height",this.get("targetMinHeight"));this._addTarget(e,"start");}},_onMouseEnter:function(c){var e=this.get("targetType"),d=this.get("designerClass")+"-target",f=this._targetNode.one("div");switch(e){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(f){f.setStyle("display","block");}else{f=new b.Node.create('<div class="'+d+"-remove "+d+"-"+e+'-remove" />');this._targetNode.append(f);b.on("click",b.bind(this._onClickRemove,this),f);}this.refresh();},_onMouseLeave:function(c){var d=this._targetNode.one("div");d.setStyle("display","none");this._afterDropExit(c);},_addPlaces:function(g,e){var d=this.get("host"),c=this.get("targetType"),f=this.getAttrs();f.placesType=e;f.parentNode=(c==="start"||e==="start")?null:d;g.plug(b.Bewype.LayoutDesignerPlaces,f);},_addTarget:function(g,e){var d=this.get("host"),c=this.get("targetType"),f=this.getAttrs();f.targetType=e;f.parentNode=(c==="start"||e==="start")?null:d;g.plug(b.Bewype.LayoutDesignerTarget,f);},_getHitType:function(c){var d=c.drag;if(d._groups.vertical){return"vertical";}else{if(d._groups.horizontal){return"horizontal";}else{if(d._groups.text){return"text";}else{if(d._groups.image){return"image";}else{return null;}}}}},_onDropHit:function(c){var e=this.get("host"),d=this.get("targetType"),f=this._getHitType(c),i=null,h=e.layoutDesignerPlaces,g=null;if(d==="start"){if(f==="text"||f==="image"){return this._afterDropExit(c);}e.unplug(b.Bewype.LayoutDesignerTarget);if(e.layoutDesignerPlaces){e.unplug(b.Bewype.LayoutDesignerPlaces);}}if(f===d){return;}else{if(f==="start"||f==="horizontal"||f==="vertical"){if(h&&h.get("placesType")!=="vertical"){g=h.getMaxWidth();}i=d==="start"?e:h.addDestNode();this._addPlaces(i,f);this._addTarget(i,f);if(f!=="start"){i.layoutDesignerTarget.refresh();}}else{g=h.addContent(f);g=h.get("placesType")==="vertical"?null:g;}}this._afterDropExit(c,g);},refresh:function(g){var h=this.get("host"),e=this.get("targetType"),i=this.get("parentNode")||h,l=null,k=null,j=null,f=null,c=null,d=null;if(h.layoutDesignerPlaces){l=h.layoutDesignerPlaces.refresh(g);}else{return;}k=l[0];j=l[1];f=b.Bewype.Utils.getHeight(this._targetNode);c=b.Bewype.Utils.getWidth(this._targetNode);d=this._targetNode.ancestor("div");switch(e){case"vertical":k=b.Bewype.Utils.getHeight(i);if(i==h){this._targetNode.setY(i.getY()+k-f);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",j);break;case"horizontal":j=b.Bewype.Utils.getWidth(i);
this._targetNode.setX(i.getX()+j-c);if(i==h){this._targetNode.setY(i.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("height",k);break;default:return;}if(i.layoutDesignerTarget&&i!=h&&!g){i.layoutDesignerTarget.refresh();}}});b.namespace("Bewype");b.Bewype.LayoutDesignerTarget=a;},"@VERSION@",{requires:["bewype-layout-designer-places"]});YUI.add("bewype-layout-designer",function(a){},"@VERSION@",{use:["bewype-layout-designer-config","bewype-layout-designer-base","bewype-layout-designer-content-base","bewype-layout-designer-content-image","bewype-layout-designer-content-text","bewype-layout-designer-places","bewype-layout-designer-sources","bewype-layout-designer-target"]});