YUI.add("bewype-layout-designer-config",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-config";a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},sourceHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},sourceWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},sourceGroups:{value:["horizontal","text","image"],writeOnce:true},sourceLabels:{value:["Layout Horizontal","Text","Image"],writeOnce:true},targetOverHeight:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinHeight:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetOverWidth:{value:20,validator:function(c){return b.Lang.isNumber(c);}},targetMinWidth:{value:8,validator:function(c){return b.Lang.isNumber(c);}},targetZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:40,validator:function(c){return b.Lang.isNumber(c);}},defaultContent:{value:"Text..",validator:function(c){return b.Lang.isString(c);}},baseNode:{value:null,writeOnce:true},parentNode:{value:null},layoutWidth:{value:600,validator:function(c){return b.Lang.isNumber(c);}},placesType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},contentType:{value:"text",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultText:{value:"Text ...",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultImg:{value:b.config.base+"bewype-layout-designer/assets/blank.png",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},editorTextButtons:{value:["height","width","bold","italic","underline","title","font-family","font-size","text-align","color","background-color","url","reset","apply"]},editorImageButtons:{value:["file","background-color","height","width","padding-top","padding-right","padding-bottom","padding-left","reset","apply"]},useBorder:{value:true,writeOnce:true},boderStyle:{value:"1px dashed grey",writeOnce:true},startingType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},cloneZIndex:{value:2,validator:function(c){return b.Lang.isNumber(c);}},gripZIndex:{value:4,validator:function(c){return b.Lang.isNumber(c);}}};b.extend(a,b.Plugin.Base);b.namespace("Bewype");b.Bewype.LayoutDesignerConfig=a;},"@VERSION@",{requires:["plugin"]});YUI.add("bewype-layout-designer-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NODE_SRC_TEMPLATE='<div class="{designerClass}-sources"></div>';b.NODE_PAN_TEMPLATE='<div class="{designerClass}-edit-panel"></div>';b.NODE_LAYOUT_TEMPLATE='<div class="{designerClass}-layout"><ul /></div>';b.NAME="layout-designer";b.NS="layoutDesigner";a.extend(b,a.Bewype.LayoutDesignerConfig,{nodeSource:null,nodeLayout:null,_dropHitGotcha:function(p){var n=this.get("host"),f=p.target.get("node"),q=this.get("designerClass"),e="."+q+"-content",l="."+q+"-src",k=f.one(e)||f.one(l),d=k.get("tagName").toLowerCase(),o=f.ancestor("ul"),h=null,m=null,c=null,i=null,j=null,g=null;if(!o.layoutDesignerPlaces){return;}else{if(k.layoutDesignerContent){h=k.layoutDesignerContent.get("parentNode");}else{if(k.layoutDesignerPlaces){h=k.layoutDesignerPlaces.get("parentNode");}else{g=[];if(d==="div"){g.push(k.cloneNode(true));this.nodeSource.layoutDesignerSources.addTextSource();}else{if(d==="img"){g.push(k.cloneNode(true));this.nodeSource.layoutDesignerSources.addImageSource();}else{if(d==="table"){k.all("td").each(function(s,r){var t=s.one("div")||s.one("img");g.push(t.cloneNode(true));},this);this.nodeSource.layoutDesignerSources.addRowSource();}else{return;}}}}}}if(g){j=a.Node.create("<ul/>");a.each(g,function(s,r){var t=a.Node.create("<li />");t.append(s);j.append(t);});k.replace(j);k=j;m=this.getAttrs();m.baseNode=n;m.parentNode=n;m.placesType=this.get("startingType")==="horizontal"?"vertical":"horizontal";k.plug(a.Bewype.LayoutDesignerPlaces,m);o.layoutDesignerPlaces.registerContent(k);k.layoutDesignerPlaces.set("parentNode",o);c=o.layoutDesignerPlaces.getMaxWidth();i=o.layoutDesignerPlaces.refresh(c);k.layoutDesignerPlaces.refresh(c,true);if(_placesType==="vertical"){_srcSortable.join(this.sortable,"outer");}this.nodeLayout.one("ul").all("ul").each(function(s,r){if(s!=k){s.layoutDesignerPlaces.sortable.join(k.layoutDesignerPlaces.sortable,"full");}},this);}},initializer:function(c){this.setAttrs(c);var e=this.get("host"),f=null,d=this.get("designerClass"),g=this.get("layoutWidth");c.baseNode=e;c.placesType=this.get("startingType");this.nodeSource=new a.Node.create(a.substitute(b.NODE_SRC_TEMPLATE,{designerClass:d}));e.append(this.nodeSource);this.nodeSource.plug(a.Bewype.LayoutDesignerSources,c);f=new a.Node.create(a.substitute(b.NODE_PAN_TEMPLATE,{designerClass:d}));e.append(f);this.nodeLayout=new a.Node.create(a.substitute(b.NODE_LAYOUT_TEMPLATE,{designerClass:d}));e.append(this.nodeLayout);this.nodeLayout.setStyle("width",g);this.nodeLayout.one("ul").plug(a.Bewype.LayoutDesignerPlaces,c);this.nodeLayout.one("ul").layoutDesignerPlaces.refresh();this.nodeSource.layoutDesignerSources.sortable.join(this.nodeLayout.one("ul").layoutDesignerPlaces.sortable,"outer");a.DD.DDM.on("drag:end",a.bind(this._dropHitGotcha,this));},destructor:function(){var e=this.get("host"),d=this.get("designerClass"),f=e.one("."+d+"-sources"),c=e.one("."+d+"-edit-panel"),g=this.nodeLayout.one("table")||this.nodeLayout.one("ul");f.remove();c.remove();this.nodeLayout.unplug(a.Bewype.LayoutDesignerPlaces);if(g){this.nodeLayout.replace(g);}else{this.nodeLayout.remove();}}});a.namespace("Bewype");a.Bewype.LayoutDesigner=b;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});YUI.add("bewype-layout-designer-content",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-content";a.NS="layoutDesignerContent";
b.extend(a,b.Bewype.LayoutDesignerConfig,{_q:null,editing:false,initializer:function(c){this.setAttrs(c);var e=this.get("host"),d=this.get("designerClass"),f=this.get("contentType");e.removeClass(d+"-src");e.addClass(d+"-content");e.addClass(d+"-content-"+f);b.on("mouseenter",b.bind(this._onMouseEnter,this),e);this._q=new b.AsyncQueue();},destructor:function(){var e=this.get("host"),f=this.get("parentNode"),d=this.get("designerClass")+"-content",c=this.getCloneNode();if(this.editing===true){this._detachEditor();}f.layoutDesignerPlaces.unRegisterContent(e);e.detachAll("mouseenter");if(c){c.one("."+d+"-clone-edit").detachAll("click");c.one("."+d+"-clone-remove").detachAll("click");c.remove();}},getCloneNode:function(){var e=this.get("host"),c=e.ancestor("div"),d=this.get("designerClass")+"-content";return c.one("div."+d+"-clone");},hideClone:function(c){c=c||this.getCloneNode();if(c){b.each(c.all("div"),function(e,d){e.setStyle("visibility","hidden");});c.setStyle("visibility","hidden");}},_addCloneNode:function(){var i=this.get("host"),d=i.ancestor("div"),c=this.get("designerClass")+"-content",f=new b.Node.create('<div class="'+c+'-clone" />'),h=new b.Node.create('<div class="'+c+'-clone-callbacks" />'),e=null,j=c+"-clone-drag",k=null,g=null;d.append(f);f.setStyle("bottom",0);f.setStyle("left",1);f.setStyle("position","absolute");f.setStyle("z-index",this.get("cloneZIndex"));f.append(h);e=new b.Node.create('<div class="'+j+'" />');h.append(e);k=new b.Node.create('<div class="'+c+'-clone-edit" />');h.append(k);b.on("click",b.bind(this._onClickEdit,this),k);g=new b.Node.create('<div class="'+c+'-clone-remove" />');h.append(g);b.on("click",b.bind(this._onClickRemove,this),g);this._refreshCloneNode();return f;},_attachEditor:function(){var m=this.get("host"),g=this.get("baseNode"),d=this.get("parentNode"),l=this.get("designerClass")+"-sources",k=this.get("designerClass")+"-edit-panel",q=g.one("div."+l),j=g.one("div."+k),p=d.layoutDesignerPlaces,f=p.get("placesType"),i=this.get("contentType")==="image"?b.Bewype.EditorTag:b.Bewype.EditorText,e=this.get("contentType")==="image"?"editorImageButtons":"editorTextButtons",h=null,o=null,n=(f==="vertical")?p.get("parentNode"):null,c=n?n.layoutDesignerPlaces:null;q.setStyle("display","none");j.setStyle("display","block");if(f==="vertical"){o=d.layoutDesignerPlaces.getMaxWidth();o+=c?c.getAvailablePlace():0;}else{o=d.layoutDesignerPlaces.getAvailablePlace();o+=this.getContentWidth();}h={panelNode:j,spinnerMaxWidth:o,activeButtons:this.get(e)};m.plug(i,h);b.on("bewype-editor:onClose",b.bind(this._detachEditor,this),m);b.on("bewype-editor:onChange",b.bind(this.refresh,this),m);this.editing=true;},_detachEditor:function(){var f=this.get("host"),e=this.get("baseNode"),i=this.get("designerClass")+"-sources",d=this.get("designerClass")+"-edit-panel",h=e.one("div."+i),c=e.one("div."+d),g=this.get("contentType")==="image"?b.Bewype.EditorTag:b.Bewype.EditorText;this.editing=false;if(c&&c.bewypeEditorPanel){c.unplug(b.Bewype.EditorPanel);f.unplug(g);f.detachAll("bewype-editor:onClose");f.detachAll("bewype-editor:onChange");this.refresh();}if(c){c.setStyle("display","none");}if(h){h.setStyle("display","block");}this._refreshCloneNode();return true;},_onClickEdit:function(c){var d=this.get("parentNode");b.each(d.layoutDesignerPlaces.getContents(),function(f,e){f.layoutDesignerContent._detachEditor();});this._attachEditor();},_onClickRemove:function(c){var d=this.get("host"),e=this.get("parentNode");e.layoutDesignerPlaces.removeContent(d);},_onMouseEnter:function(c){if(this.editing){return;}var e=this.get("parentNode"),d=this.getCloneNode();e.layoutDesignerPlaces.cleanContentOver();if(d){b.each(d.all("div"),function(g,f){g.setStyle("visibility","visible");});d.setStyle("visibility","visible");}else{d=this._addCloneNode();}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[d]});this._q.run();},getContentHeight:function(){var d=this.get("host"),c=b.Bewype.Utils.getHeight(d),f=b.Bewype.Utils.getStyleValue(d,"paddingTop")||0,e=b.Bewype.Utils.getStyleValue(d,"paddingBottom")||0;return c+f+e+2;},getContentWidth:function(){var e=this.get("host"),f=b.Bewype.Utils.getWidth(e),d=b.Bewype.Utils.getStyleValue(e,"paddingRight")||0,c=b.Bewype.Utils.getStyleValue(e,"paddingLeft")||0;return f+c+d+2;},_refreshCloneNode:function(e){var d=this.getCloneNode(),f=this.getContentHeight(),c=e||this.getContentWidth();if(d){d.setStyle("height",f-2);d.setStyle("width",c-2);}},refresh:function(f,e){var g=this.get("parentNode"),d=this.get("host"),c=null;if(f){c=this.getContentWidth();if(e){c=f;}else{if(f){c=c>f?f:c;}}c-=2;d.setStyle("width",c);d.setStyle("paddingLeft",0);d.setStyle("paddingRight",0);this._refreshCloneNode(c);}else{this._refreshCloneNode();}}});b.namespace("Bewype");b.Bewype.LayoutDesignerContent=a;},"@VERSION@",{requires:["async-queue","plugin","substitute","bewype-layout-designer-config","bewype-editor"]});YUI.add("bewype-layout-designer-places",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-places";a.NS="layoutDesignerPlaces";b.extend(a,b.Bewype.LayoutDesignerConfig,{placesNode:null,contents:null,sortable:null,_initSortable:function(){var f=this.get("host"),i=this.get("baseNode"),e=this.get("placesType"),g=i.one("."+this.get("designerClass")+"-sources"),h=g.layoutDesignerSources.sortable,d="."+this.get("designerClass")+"-content-clone-drag",c="."+this.get("designerClass")+"-places-grip";this.sortable=new b.Sortable({container:f,nodes:"li",opacity:".2",handles:e==="horizontal"?[d]:[c]});},initializer:function(c){this.setAttrs(c);var f=this.get("host"),e=this.get("designerClass"),d=this.get("placesType"),g="."+e+"-src",h=this.get("parentNode");this.contents=[];f.removeClass(e+"-src");f.removeClass(e+"-src-"+d);f.addClass(e+"-places");f.addClass(e+"-places-"+d);f.all(g).each(function(j,i){var l=this.getAttrs();l.parentNode=f;l.contentType=j.one("img")?"image":"text";j.plug(b.Bewype.LayoutDesignerContent,l);
this.contents.push(j);},this);this._initSortable();if(h){this._addGripNode();}},destructor:function(){var c=this.get("host"),d=this.get("parentNode");b.Object.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){f.unplug(b.Bewype.LayoutDesignerPlaces);}else{if(f.layoutDesignerContent){f.unplug(b.Bewype.LayoutDesignerContent);}else{}}},this);if(d){d.layoutDesignerPlaces.unRegisterContent(c);}},refresh:function(f,e){var d=this.get("host"),c=this.get("placesType"),h=this.getPlacesHeight(),j=this.getPlacesWidth(),i=this.get("parentNode"),g=null;h=h===0?this.get("contentHeight"):h;d.setStyle("height",h);d.setStyle("width",f||j);switch(c){case"vertical":if(e){g=f?f:j;}else{g=j>f?f:j;g=j===0?this.getAvailablePlace():j;}b.each(this.contents,function(n,m){var l=null;if(n.layoutDesignerPlaces){l=n.layoutDesignerPlaces.get("host");l.setStyle("width",g);if(f){n.layoutDesignerPlaces.refresh(g,e);}}else{if(f){n.layoutDesignerContent.refresh(g,e);}}});break;case"horizontal":g=f?(f/this.contents.length):null;b.Object.each(this.contents,function(n,m){var l=null,o=null;if(n.layoutDesignerContent){l=n.layoutDesignerContent.get("host");if(g){n.layoutDesignerContent.refresh(g,e);}}o=l?l.ancestor("li"):null;if(o){o.setStyle("height",h);o.setStyle("vertical-align","top");}},this);break;}return g;},_addGripNode:function(){var e=this.get("host"),d=e.ancestor("div"),c=this.get("designerClass")+"-places",f=new b.Node.create('<div class="'+c+'-grip" />');d.insertBefore(f,e);f.setStyle("bottom",0);f.setStyle("left",0);f.setStyle("position","absolute");},_getGripNode:function(){var e=this.get("host"),d=e.ancestor("div"),c=this.get("designerClass")+"-places";return d.one("div."+c+"-grip");},cleanContentOver:function(){b.each(this.contents,function(d,c){if(d.layoutDesignerContent){d.layoutDesignerContent._q.stop();d.layoutDesignerContent.hideClone();}});},getMaxWidth:function(){return b.Bewype.Utils.getWidth(this.get("host"));},hasPlace:function(d){var c=this.getAvailablePlace(),e=this.get("placesType");d=d?d:this.get("contentWidth");return e==="vertical"||c>=d;},hasSubPlaces:function(){var c=false;b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=true;}});return c;},getAvailablePlace:function(){var d=this.get("placesType"),e=this.getMaxWidth(),c=this.getPlacesWidth();if(d==="vertical"){return c===0?e:c;}else{return e-c-2;}},getPlacesWidth:function(){var c=0,d=this.get("parentNode")||this.get("host");switch(this.get("placesType")){case"vertical":if(!this.get("parentNode")){return b.Bewype.Utils.getWidth(d);}b.each(this.contents,function(f,e){var g=0;if(f.layoutDesignerPlaces){g=f.layoutDesignerPlaces.getPlacesWidth();}else{if(f.layoutDesignerContent){g=f.layoutDesignerContent.getContentWidth();}}if(g>c){c=g;}});break;case"horizontal":b.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){c+=f.layoutDesignerPlaces.getPlacesWidth();}else{if(f.layoutDesignerContent){c+=f.layoutDesignerContent.getContentWidth();}}});break;}return c;},getPlacesHeight:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesHeight();}else{if(e.layoutDesignerContent){c+=e.layoutDesignerContent.getContentHeight();}}});break;case"horizontal":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesHeight();}else{if(e.layoutDesignerContent){f=e.layoutDesignerContent.getContentHeight();}}if(f>c){c=f;}});break;}return c;},registerContent:function(c){this.contents.push(c);},unRegisterContent:function(c){var d=this.contents.indexOf(c);if(d!=-1){this.contents.splice(d,1);}},getContents:function(){var c=[];b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=c.concat(e.layoutDesignerPlaces.getContents());}else{c.push(e);}});return c;},removeContent:function(c,f){var j=c.ancestor("li"),e=this.get("host"),h=this.get("baseNode"),d=this.get("designerClass"),g=h.one("."+d+"-layout ul"),i=null;this.unRegisterContent(c);c.unplug(b.Bewype.LayoutDesignerContent);j.remove();if(this.contents.length===0&&e!=g){e.unplug(b.Bewype.LayoutDesignerPlaces);}else{if(e.layoutDesignerPlaces){i=this.getMaxWidth();this.refresh(i);}}}});b.namespace("Bewype");b.Bewype.LayoutDesignerPlaces=a;},"@VERSION@",{requires:["sortable","dd-constrain","bewype-layout-designer-content-text"]});YUI.add("bewype-layout-designer-sources",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-sources";a.NS="layoutDesignerSources";a.TXT_SRC_TEMPLATE='<div class="{designerClass}-src" ';a.TXT_SRC_TEMPLATE+='style="width: 80px; height: 40px">Text</div>';a.IMG_SRC_TEMPLATE='<img class="{designerClass}-src" ';a.IMG_SRC_TEMPLATE+='style="width: 80px; height: 40px" src="{defaultImg}"/>';a.ROW_SRC_TEMPLATE='<table class="{designerClass}-src {designerClass}-src-horizontal"><tr>';a.ROW_SRC_TEMPLATE+="<td><div>"+a.TXT_SRC_TEMPLATE+"</div></td>";a.ROW_SRC_TEMPLATE+="<td><div>"+a.TXT_SRC_TEMPLATE+"</div></td>";a.ROW_SRC_TEMPLATE+="</tr></table>";b.extend(a,b.Bewype.LayoutDesignerConfig,{sortable:null,_addSourceItem:function(f){var d=this.get("host"),g=d.one("ul"),e=new b.Node.create("<li><div /></li>"),c=e.one("div");c.setStyle("position","relative");c.append(f);g.append(e);},addRowSource:function(){var c=new b.Node.create(b.substitute(a.ROW_SRC_TEMPLATE,{designerClass:this.get("designerClass")}));this._addSourceItem(c);},addTextSource:function(){var c=new b.Node.create(b.substitute(a.TXT_SRC_TEMPLATE,{designerClass:this.get("designerClass")}));this._addSourceItem(c);},addImageSource:function(){var c=new b.Node.create(b.substitute(a.IMG_SRC_TEMPLATE,{designerClass:this.get("designerClass"),defaultImg:this.get("defaultImg")}));this._addSourceItem(c);},initializer:function(d){this.setAttrs(d);var g=this.get("host"),f=this.get("sourceGroups"),c=this.get("sourceLabels"),e=new b.Node.create("<ul />");g.append(e);this.addRowSource();this.addTextSource();this.addImageSource();this.sortable=new b.Sortable({container:e,nodes:"li",opacity:".2"});
},destructor:function(){},_onDragStart:function(e,c){var d=e.get("node"),f=e.get("dragNode");d.setStyle("opacity",0.2);f.set("innerHTML",d.get("innerHTML"));f.setStyles({backgroundColor:d.getStyle("backgroundColor"),color:d.getStyle("color"),opacity:0.65});},_onDragEnd:function(d,c){d.get("node").setStyle("opacity",1);}});b.namespace("Bewype");b.Bewype.LayoutDesignerSources=a;},"@VERSION@",{requires:["dd","plugin","substitute"]});YUI.add("bewype-layout-designer",function(a){},"@VERSION@",{use:["bewype-layout-designer-config","bewype-layout-designer-base","bewype-layout-designer-content","bewype-layout-designer-places","bewype-layout-designer-sources"]});