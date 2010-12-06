YUI.add("bewype-layout-designer-config",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-config";a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},targetStartActions:{value:["row","column"],writeOnce:true},targetHorizontalActions:{value:["column","text","image","remove"],writeOnce:true},targetVerticalActions:{value:["row","text","image","remove"],writeOnce:true},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},defaultContent:{value:"Text..",validator:function(c){return b.Lang.isString(c);}},baseNode:{value:null,writeOnce:true},parentNode:{value:null},layoutWidth:{value:600,validator:function(c){return b.Lang.isNumber(c);}},placesType:{value:"start",validator:function(c){return b.Lang.isString(c);}},targetType:{value:"start",validator:function(c){return b.Lang.isString(c);}},contentType:{value:"text",validator:function(c){return b.Lang.isString(c);}},defaultText:{value:"",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultImg:{value:b.config.base+"bewype-layout-designer/assets/blank.png",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},editorTextButtons:{value:["height","width","bold","italic","underline","font-family","font-size","text-align","color","background-color","url","file","reset","apply"]},editorImageButtons:{value:["background-color","padding-top","padding-bottom","text-align","file","reset","apply"]},fileStaticPath:{value:"http://www.bewype.org/uploads/",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},uploadUrl:{value:"http://www.bewype.org/upload",writeOnce:true},startingTargetType:{value:"start",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},panelPosition:{value:"left",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},panelOffsetY:{value:80,validator:function(c){return b.Lang.isNumber(c);}},panelOffsetX:{value:20,validator:function(c){return b.Lang.isNumber(c);}},pickerColorSize:{value:20,validator:function(c){return b.Lang.isNumber(c);}}};b.extend(a,b.Plugin.Base);b.namespace("Bewype");b.Bewype.LayoutDesignerConfig=a;},"@VERSION@",{requires:["plugin"]});YUI.add("bewype-layout-designer-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NODE_PAN_TEMPLATE='<div class="{designerClass}-edit-panel"></div>';b.NODE_LAYOUT_TEMPLATE='<div class="{designerClass}-layout {designerClass}-places"></div>';b.NAME="layout-designer";b.NS="layoutDesigner";a.extend(b,a.Bewype.LayoutDesignerConfig,{nodeLayout:null,initializer:function(c){this.setAttrs(c);var e=this.get("host"),f=null,d=this.get("designerClass"),g=this.get("layoutWidth");this.nodeLayout=e.one("div."+d+"-layout");if(!this.nodeLayout){this.nodeLayout=new a.Node.create(a.substitute(b.NODE_LAYOUT_TEMPLATE,{designerClass:d}));e.append(this.nodeLayout);this.nodeLayout.setStyle("width",g);}c.baseNode=e;c.targetType=this.get("startingTargetType");this.nodeLayout.plug(a.Bewype.LayoutDesignerTarget,c);this.nodeLayout.layoutDesignerTarget.refresh();f=new a.Node.create(a.substitute(b.NODE_PAN_TEMPLATE,{designerClass:d}));e.append(f);a.DD.DDM.on("drop:hit",a.bind(this._dropHitGotcha,this));},destructor:function(){var e=this.get("host"),d=this.get("designerClass"),c=e.one("."+d+"-edit-panel");this.nodeLayout.unplug(a.Bewype.LayoutDesignerTarget);c.remove();},_dropHitGotcha:function(l){var d=l.drag.get("node"),n=d.get("tagName").toLowerCase(),h="."+this.get("designerClass")+"-places",m="."+this.get("designerClass")+"-container",j=d.one(m),g=d.one(h)?j:d.one(m),e=null,f=n==="li"?"ul":"table",i=j?j.ancestor(f):null,k=i?i.ancestor("div"):null,c=null;if(!g||!k.layoutDesignerPlaces){return;}else{if(g.layoutDesignerContent){e=g.layoutDesignerContent.get("parentNode");}else{if(g.layoutDesignerPlaces){e=g.layoutDesignerPlaces.get("parentNode");}else{return;}}}if(e!=k){e.layoutDesignerPlaces.unRegisterContent(g);k.layoutDesignerPlaces.registerContent(g);g.layoutDesignerContent.set("parentNode",k);c=k.layoutDesignerPlaces.getMaxWidth();k.layoutDesignerTarget.refresh(c);c=e.layoutDesignerPlaces.getMaxWidth();e.layoutDesignerTarget.refresh(c);}this.nodeLayout.all(".yui3-dd-draggable").each(function(p,o){if(p.getStyle("visibility")==="hidden"){p.remove();}});},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});a.namespace("Bewype");a.Bewype.LayoutDesigner=b;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});YUI.add("bewype-layout-designer-content",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.C_TEXT_TEMPLATE='<div class="{designerClass}-content ';a.C_TEXT_TEMPLATE+='{designerClass}-content-{contentType}">';a.C_TEXT_TEMPLATE+="{defaultContent}</div>";a.C_IMG_TEMPLATE='<div class="{designerClass}-content ';a.C_IMG_TEMPLATE+='{designerClass}-content-{contentType}">';a.C_IMG_TEMPLATE+='<img src="{defaultContent}" />';a.C_IMG_TEMPLATE+="</div>";a.NAME="layout-designer-content";a.NS="layoutDesignerContent";b.extend(a,b.Bewype.LayoutDesignerConfig,{initializer:function(c){this.setAttrs(c);var e=this.get("host"),i=this.get("parentNode"),g=this.get("contentType"),d=this.get("designerClass"),h=g==="text"?e.one("div"):e.one("img"),f=g==="text"?a.C_TEXT_TEMPLATE:a.C_IMG_TEMPLATE;if(!h){h=new b.Node.create(b.substitute(f,{designerClass:d,contentType:g,defaultContent:g==="text"?this.get("defaultText"):this.get("defaultImg")}));e.append(h);h.setStyle("height",this.get("contentHeight"));h.setStyle("width",this.get("contentWidth"));}this._addCloneNode();},destructor:function(){var e=this.get("host"),d=this.get("designerClass")+"-content",c=e.one("."+d+"-clone");if(c){c.one("."+d+"-clone-edit").detachAll("click");
c.one("."+d+"-clone-remove").detachAll("click");c.remove();}},_detachEditor:function(){var g=this.get("host"),e=this.get("baseNode"),d=this.get("designerClass")+"-edit-panel",c=e.one("div."+d),i=this.get("contentType")==="image"?b.Bewype.EditorTag:b.Bewype.EditorText,h=this.getContentNode(),f=this.getCloneNode();if(c&&c.bewypeEditorPanel){c.unplug(b.Bewype.EditorPanel);h.unplug(i);g.detachAll("bewype-editor:onClose");g.detachAll("bewype-editor:onChange");this.refresh();}if(c){c.setStyle("display","none");}if(f){f.setStyle("display","block");}this._refreshCloneNode();return true;},_attachEditor:function(){var g=this.get("baseNode"),d=this.get("parentNode"),m=this.get("designerClass")+"-edit-panel",l=g.one("div."+m),p=d.layoutDesignerPlaces,f=p.get("placesType"),j=this.get("contentType")==="image"?b.Bewype.EditorTag:b.Bewype.EditorText,e=this.get("contentType")==="image"?"editorImageButtons":"editorTextButtons",k=this.getContentNode(),i=this.getCloneNode(),h=null,o=null,n=(f==="vertical")?p.get("parentNode"):null,c=n?n.layoutDesignerPlaces:null;i.setStyle("display","none");l.setStyle("display","block");if(f==="vertical"){o=d.layoutDesignerPlaces.getMaxWidth();o+=c?c.getAvailablePlace():0;}else{o=d.layoutDesignerPlaces.getAvailablePlace();o+=this.getContentWidth();}h={panelNode:l,spinnerMaxWidth:o,activeButtons:this.get(e),fileStaticPath:this.get("fileStaticPath"),uploadUrl:this.get("uploadUrl"),panelPosition:this.get("panelPosition"),panelOffsetY:this.get("panelOffsetY"),panelOffsetX:this.get("panelOffsetX"),pickerColorSize:this.get("pickerColorSize")};k.plug(j,h);b.on("bewype-editor:onClose",b.bind(this._detachEditor,this),k);b.on("bewype-editor:onChange",b.bind(this.refresh,this),k);},_onClickEdit:function(c){var d=this.get("parentNode");b.each(d.layoutDesignerPlaces.getContents(),function(f,e){f.layoutDesignerContent._detachEditor();});this._attachEditor();},_onClickRemove:function(c){var d=this.get("host"),e=this.get("parentNode");e.layoutDesignerPlaces.removeContent(d);},_addCloneNode:function(){var f=this.get("host"),e=this.get("designerClass")+"-content",c=new b.Node.create('<div class="'+e+'-clone-callbacks" />'),d=null,i=null,g=null,h=null;d=f.cloneNode(false);d.set("innerHTML","");d.set("className",e+"-clone");f.append(d);d.setStyle("z-index",this.get("contentZIndex"));d.setStyle("position","absolute");d.setStyle("bottom",0);d.append(c);i=new b.Node.create('<div class="'+e+'-clone-drag" />');c.append(i);g=new b.Node.create('<div class="'+e+'-clone-edit" />');c.append(g);b.on("click",b.bind(this._onClickEdit,this),g);h=new b.Node.create('<div class="'+e+'-clone-remove" />');c.append(h);b.on("click",b.bind(this._onClickRemove,this),h);this._refreshCloneNode();},getContentHeight:function(){var f=this.getContentNode(),c=b.Bewype.Utils.getHeight(f),e=b.Bewype.Utils.getStyleValue(f,"paddingTop")||0,d=b.Bewype.Utils.getStyleValue(f,"paddingBottom")||0;return c+e+d;},getContentWidth:function(){var f=this.getContentNode(),e=b.Bewype.Utils.getWidth(f),d=b.Bewype.Utils.getStyleValue(f,"paddingRight")||0,c=b.Bewype.Utils.getStyleValue(f,"paddingLeft")||0;return e+c+d;},getContentNode:function(){var d=this.get("host"),c=this.get("designerClass")+"-content";return d.one("div."+c);},getCloneNode:function(){var d=this.get("host"),c=this.get("designerClass")+"-content",e="div."+c+"-clone";return d.one(e);},_refreshCloneNode:function(e){var d=this.getCloneNode(),f=this.getContentHeight(),c=e||this.getContentWidth();if(d){d.setStyle("height",f-2);d.setStyle("width",c-2);}},refresh:function(c){var e=this.get("parentNode"),d=c?this.getContentNode():null;if(d){d.setStyle("width",c);d.setStyle("paddingLeft",0);d.setStyle("paddingRight",0);}this._refreshCloneNode(c);e.layoutDesignerTarget.refresh();}});b.namespace("Bewype");b.Bewype.LayoutDesignerContent=a;},"@VERSION@",{requires:["async-queue","plugin","substitute","bewype-editor"]});YUI.add("bewype-layout-designer-places",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-places";a.NS="layoutDesignerPlaces";a.H_PLACES_TEMPLATE='<table class="{designerClass}-places ';a.H_PLACES_TEMPLATE+="{designerClass}-places-horizontal ";a.H_PLACES_TEMPLATE+='{designerClass}-places-{placesLevel}">';a.H_PLACES_TEMPLATE+="<tr />";a.H_PLACES_TEMPLATE+="</table>";a.V_PLACES_TEMPLATE='<ul class="{designerClass}-places ';a.V_PLACES_TEMPLATE+="{designerClass}-places-vertical ";a.V_PLACES_TEMPLATE+='{designerClass}-places-{placesLevel}"></ul>';a.H_DEST_TEMPLATE='<td class="{designerClass}-cell ';a.H_DEST_TEMPLATE+="{designerClass}-cell-horizontal ";a.H_DEST_TEMPLATE+='{designerClass}-cell-{placesLevel}">';a.H_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';a.H_DEST_TEMPLATE+="</td>";a.V_DEST_TEMPLATE='<li class="{designerClass}-cell ';a.V_DEST_TEMPLATE+="{designerClass}-cell-vertical ";a.V_DEST_TEMPLATE+='{designerClass}-cell-{placesLevel}">';a.V_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';a.V_DEST_TEMPLATE+="</li>";b.extend(a,b.Bewype.LayoutDesignerConfig,{placesNode:null,contents:null,level:null,initializer:function(e){this.setAttrs(e);var k=this.get("host"),h=k.get("children"),d=this.get("placesType"),o=this.get("designerClass"),f=a.H_PLACES_TEMPLATE,c=a.V_PLACES_TEMPLATE,n=d==="horizontal"?f:c,m=this.get("parentNode"),g=null,j=null,l=null,i=null;this.contents=[];this.level=this._getPlacesLevel();this.placesNode=h?h.item(0):null;if(this.placesNode){if(this.placesNode.hasClass(o+"-places-vertical")){this._tableToUl();d="vertical";i="horizontal";}else{d="horizontal";i="vertical";}j=this.getAttrs();j.parentNode=k;if(d==="horizontal"){l=this.placesNode.one("tr").get("children");}else{g=this.placesNode.get("children").item(0);if(g.get("tagName").toLowerCase()!=="tbody"){g=this.placesNode;}l=g.get("children");}l.each(function(r,q){var s=r.get("children").item("0"),p=s?s.get("children").item("0"):null;if(!s){return;}if(p.get("tagName").toLowerCase()==="table"){j.targetType=i;s.plug(b.Bewype.LayoutDesignerTarget,j);
j.targetType=null;j.placesType=i;s.plug(b.Bewype.LayoutDesignerPlaces,j);}else{j.contentType=p.hasClass(o+"-content-text")?"text":"image";s.plug(b.Bewype.LayoutDesignerContent,j);}this.registerContent(s);},this);}else{this.placesNode=new b.Node.create(b.substitute(n,{designerClass:o,placesLevel:this.level}));k.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));}this._initSortable();},_getPlacesLevel:function(){var d=this.get("host"),c=this.get("designerClass"),f=d.ancestor("."+c+"-places"),e=0;while(f){f=f.ancestor("."+c+"-places");e+=1;}return"level"+e;},_initSortable:function(){var l=this.get("host"),f=this.get("placesType"),n=this.get("designerClass"),h=f==="horizontal"?"td":"li",m=f==="horizontal"?"table":"ul",g="."+n+"-layout",i="."+n+"-content-clone-drag",j=b.Sortable.getSortable(this.placesNode),k=l.ancestor(g),e=k?k.all(m):null,c=n+"-cell-"+this.level,d=n+"-places-"+this.level;if(j){b.Sortable.unreg(j);}j=new b.Sortable({container:this.placesNode,nodes:h+"."+c,opacity:".2",handles:[i]});if(!e){return;}e.each(function(p,o){if(this.placesNode!=p&&p.hasClass(d)){var q=b.Sortable.getSortable(p);if(q){q.join(j,"full");}}},this);},_tableToUl:function(){var e=b.Node.create("<ul />"),c=this.get("designerClass"),d=this.placesNode.get("children").item(0);if(d.get("tagName").toLowerCase()!=="tbody"){d=this.placesNode;}e.addClass(c+"-places");e.addClass(c+"-places-vertical");e.addClass(c+"-places-"+this.level);d.get("children").each(function(g,f){var i=b.Node.create("<li />"),h=g.one("td");i.addClass(c+"-cell");i.addClass(c+"-cell-vertical");i.addClass(c+"-cell-"+this.level);if(h){i.set("innerHTML",h.get("innerHTML"));}e.append(i);},this);this.placesNode.replace(e);this.placesNode=e;},_ulToTable:function(){var c=b.Node.create("<table />"),d=this.get("designerClass");c.addClass(d+"-places");c.addClass(d+"-places-vertical");c.addClass(d+"-places-"+this.level);this.placesNode.get("children").each(function(f,e){var h=b.Node.create("<tr />"),g=b.Node.create("<td />");g.addClass(d+"-cell");g.addClass(d+"-cell-vertical");g.addClass(d+"-cell-"+this.level);g.set("innerHTML",f.get("innerHTML"));h.append(g);c.append(h);},this);this.placesNode.replace(c);this.placesNode=c;},destructor:function(){var c=b.Sortable.getSortable(this.placesNode),d=this.get("placesType");b.Object.each(this.contents,function(f,e){if(f.layoutDesignerTarget){f.unplug(b.Bewype.LayoutDesignerTarget);}else{if(f.layoutDesignerContent){f.unplug(b.Bewype.LayoutDesignerContent);}else{}}},this);b.Sortable.unreg(c);if(d==="vertical"){this._ulToTable();}},hasSubPlaces:function(){var c=false;b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=true;}});return c;},getMaxWidth:function(){return b.Bewype.Utils.getWidth(this.get("host"));},getAvailablePlace:function(){var d=this.get("placesType"),e=this.getMaxWidth(),c=this.getPlacesWidth();if(d==="vertical"){return c===0?e:c;}else{return e-c;}},hasPlace:function(d){var c=this.getAvailablePlace(),e=this.get("placesType");d=d?d:this.get("contentWidth");return e==="vertical"||c>=d;},getPlacesWidth:function(){var c=0,d=this.get("parentNode")||this.placesNode.ancestor("div");switch(this.get("placesType")){case"vertical":if(!this.get("parentNode")){return b.Bewype.Utils.getWidth(d);}b.each(this.contents,function(f,e){var g=0;if(f.layoutDesignerPlaces){g=f.layoutDesignerPlaces.getPlacesWidth();}else{g=f.layoutDesignerContent.getContentWidth();}if(g>c){c=g;}});break;case"horizontal":b.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){c+=f.layoutDesignerPlaces.getPlacesWidth();}else{c+=f.layoutDesignerContent.getContentWidth();}});break;}return c;},getPlacesHeight:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesHeight();}else{c+=e.layoutDesignerContent.getContentHeight();}});break;case"horizontal":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesHeight();}else{f=e.layoutDesignerContent.getContentHeight();}if(f>c){c=f;}});c=(c===0)?this.get("contentHeight"):c;break;}return c;},refresh:function(d){var c=this.get("placesType"),e=this.getPlacesHeight(),g=d?d:this.getPlacesWidth(),f=this.get("parentNode");g=g===0?this.getAvailablePlace():g;this.placesNode.setStyle("height",e);this.placesNode.setStyle("width",g);switch(c){case"vertical":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;h.setStyle("width",g);if(d){j.layoutDesignerTarget.refresh(d);}}else{if(d){j.layoutDesignerContent.refresh(d);}}});break;case"horizontal":b.Object.each(this.contents,function(j,i){var h=null,m=d?(d/this.contents.length):null,l=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;if(m){j.layoutDesignerTarget.refresh(m);}}else{if(j.layoutDesignerContent){h=j.layoutDesignerContent.get("host");if(m){j.layoutDesignerContent.refresh(m);}}}l=h?h.ancestor("td"):null;if(l){l.setStyle("height",e);l.setStyle("vertical-align","top");}},this);break;}if(!f){this.placesNode.ancestor("div").setStyle("height",e);}return[e,g];},cleanContentOver:function(){b.each(this.contents,function(d,c){if(d.layoutDesignerContent){d.layoutDesignerContent._q.stop();d.layoutDesignerContent.hideClone();}});},addDestNode:function(){var c=null;switch(this.get("placesType")){case"horizontal":c=new b.Node.create(b.substitute(a.H_DEST_TEMPLATE,{designerClass:this.get("designerClass"),placesLevel:this.level}));this.placesNode.one("tr").append(c);break;case"vertical":c=new b.Node.create(b.substitute(a.V_DEST_TEMPLATE,{designerClass:this.get("designerClass"),placesLevel:this.level}));this.placesNode.append(c);break;}return c.one("div");},registerContent:function(c){this.contents.push(c);this._initSortable();},unRegisterContent:function(c){var d=b.Array.indexOf(this.contents,c);if(d!=-1){this.contents.splice(d,1);}},addContent:function(g){var c=this.get("placesType"),f=this.addDestNode(),e=this.getAttrs(),d=this.getMaxWidth();
e.contentType=g;e.parentNode=this.get("host");e.contentWidth=c==="vertical"?d:this.getAvailablePlace();f.plug(b.Bewype.LayoutDesignerContent,e);this.registerContent(f);},removeContent:function(c,e){var f=null,d=this.get("host");switch(this.get("placesType")){case"horizontal":f=c.ancestor("td");break;case"vertical":f=c.ancestor("li");break;}this.unRegisterContent(c);c.unplug(b.Bewype.LayoutDesignerContent);f.remove(true);if(d.layoutDesignerTarget){d.layoutDesignerTarget.refresh(this.getMaxWidth());}},getContents:function(){var c=[];b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=c.concat(e.layoutDesignerPlaces.getContents());}else{c.push(e);}});return c;}});b.namespace("Bewype");b.Bewype.LayoutDesignerPlaces=a;},"@VERSION@",{requires:["sortable","dd-constrain","bewype-layout-designer-content"]});YUI.add("bewype-layout-designer-target",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-target";a.NS="layoutDesignerTarget";b.extend(a,b.Bewype.LayoutDesignerConfig,{_targetNode:null,initializer:function(e){this.setAttrs(e);var g=this.get("host"),d=this.get("targetType"),f=this.get("designerClass"),c=f+"-target",i=g.get("children"),h=i?i.item(0):null,j=null;if(d!=="start"||h){e.targetType=null;if(h){if(h.hasClass(f+"-places-vertical")){e.placesType="vertical";}else{e.placesType="horizontal";}}else{e.placesType=d;}this.set("targetType",e.placesType);d=e.placesType;g.plug(b.Bewype.LayoutDesignerPlaces,e);}this._targetNode=new b.Node.create('<div class="'+c+" "+c+"-"+d+'" />');g.append(this._targetNode);j=new b.Node.create('<div class="'+c+" "+c+'-inner" />');this._targetNode.append(j);b.Object.each(this._getTargetActions(),function(m,l){this._addTargetAction(j,m);},this);},destructor:function(){var c=this.get("host");b.Object.each(this._getTargetActions(),function(e,d){this._removeTargetAction(e);},this);this._targetNode.remove();if(c.layoutDesignerPlaces){c.unplug(b.Bewype.LayoutDesignerPlaces);}},_addPlaces:function(e){var i=this.get("host"),k=this.get("parentNode"),c=this.get("targetType"),g=e==="column"?"vertical":"horizontal",j=null,h=this.getAttrs(),f=i.layoutDesignerPlaces,d=f?f.getMaxWidth():b.Bewype.Utils.getWidth(i);if(c==="start"){i.unplug(b.Bewype.LayoutDesignerTarget);i.unplug(b.Bewype.LayoutDesignerPlaces);}else{if(!f){return;}}j=c==="start"?i:f.addDestNode();h.targetType=g;h.parentNode=c==="start"?null:i;j.plug(b.Bewype.LayoutDesignerTarget,h);if(f){f.registerContent(j);}this.refresh(d);},_onClickRemove:function(){var i=this.get("host"),f=this.get("baseNode"),j=this.get("parentNode"),c=this.get("targetType"),k=j?j.layoutDesignerPlaces:null,e=i.layoutDesignerPlaces.get("placesType"),g=null,d=null,h=null;i.unplug(b.Bewype.LayoutDesignerTarget);i.one("table").remove();if(j){k.unRegisterContent(i);switch(c){case"horizontal":g=i.ancestor("li");break;case"vertical":g=i.ancestor("td");break;}g.remove(true);d=k.getMaxWidth();j.layoutDesignerTarget.refresh(d);}else{h=this.getAttrs();h.targetType="start";i.plug(b.Bewype.LayoutDesignerTarget,h);f.layoutDesigner.nodeLayout.setStyle("height",0);}},_onClickAction:function(e,c){switch(e){case"column":case"row":return this._addPlaces(e);case"text":case"image":var d=this.get("host"),f=d.layoutDesignerPlaces.getMaxWidth();d.layoutDesignerPlaces.addContent(e);return this.refresh(f);case"remove":return this._onClickRemove();default:break;}},_getTargetActions:function(){switch(this.get("targetType")){case"start":return this.get("targetStartActions");case"horizontal":return this.get("targetHorizontalActions");case"vertical":return this.get("targetVerticalActions");default:break;}},_addTargetAction:function(e,f){var d=this.get("designerClass")+"-target-action",c=e.one("div."+d+"-"+f);if(c){c.setStyle("display","block");}else{c=new b.Node.create('<div class="'+d+" "+d+"-"+f+'" />');e.append(c);b.on("click",b.bind(this._onClickAction,this,f),c);}},_removeTargetAction:function(e){var d=this.get("designerClass")+"-target-action",c=this.get("host").one("div."+d+"-"+e);if(c){c.detachAll("click");c.remove();}},refresh:function(d){var c=this.get("host"),e=this.get("parentNode")||c;if(c.layoutDesignerPlaces){c.layoutDesignerPlaces.refresh(d);}else{return;}if(e.layoutDesignerTarget&&e!=c&&!d){e.layoutDesignerTarget.refresh();}}});b.namespace("Bewype");b.Bewype.LayoutDesignerTarget=a;},"@VERSION@",{requires:["bewype-layout-designer-places"]});YUI.add("bewype-layout-designer",function(a){},"@VERSION@",{use:["bewype-layout-designer-config","bewype-layout-designer-base","bewype-layout-designer-content","bewype-layout-designer-places","bewype-layout-designer-target"]});