YUI.add("bewype-layout-designer-config",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-config";A.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},targetOverHeight:{value:20,validator:function(C){return B.Lang.isNumber(C);}},targetMinHeight:{value:8,validator:function(C){return B.Lang.isNumber(C);}},targetOverWidth:{value:20,validator:function(C){return B.Lang.isNumber(C);}},targetMinWidth:{value:8,validator:function(C){return B.Lang.isNumber(C);}},targetZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},contentHeight:{value:40,validator:function(C){return B.Lang.isNumber(C);}},contentWidth:{value:40,validator:function(C){return B.Lang.isNumber(C);}},contentZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},defaultContent:{value:"Text..",validator:function(C){return B.Lang.isString(C);}},baseNode:{value:null,writeOnce:true},parentNode:{value:null},layoutWidth:{value:600,validator:function(C){return B.Lang.isNumber(C);}},placesType:{value:"vertical",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},contentType:{value:"text",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},defaultText:{value:"Text ...",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},defaultImg:{value:B.config.base+"bewype-layout-designer/assets/blank.png",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},editorTextButtons:{value:["height","width","bold","italic","underline","title","font-family","font-size","text-align","color","background-color","url","reset","apply"]},editorImageButtons:{value:["file","background-color","height","width","padding-top","padding-right","padding-bottom","padding-left","reset","apply"]}};B.extend(A,B.Plugin.Base);B.namespace("Bewype");B.Bewype.LayoutDesignerConfig=A;},"@VERSION@",{requires:["plugin"]});YUI.add("bewype-layout-designer-base",function(A){var B=function(C){B.superclass.constructor.apply(this,arguments);};B.NODE_SRC_TEMPLATE='<div class="{designerClass}-sources"></div>';B.NODE_PAN_TEMPLATE='<div class="{designerClass}-edit-panel"></div>';B.NODE_LAYOUT_TEMPLATE='<div class="{designerClass}-layout"></div>';B.NAME="layout-designer";B.NS="layoutDesigner";A.extend(B,A.Bewype.LayoutDesignerConfig,{nodeLayout:null,initializer:function(C){this.setAttrs(C);var D=this.get("host"),F=null,E=null;F=new A.Node.create(A.substitute(B.NODE_SRC_TEMPLATE,{designerClass:this.get("designerClass")}));D.append(F);F.plug(A.Bewype.LayoutDesignerSources,{layoutWidth:this.get("layoutWidth")});E=new A.Node.create(A.substitute(B.NODE_PAN_TEMPLATE,{designerClass:this.get("designerClass")}));D.append(E);this.nodeLayout=new A.Node.create(A.substitute(B.NODE_LAYOUT_TEMPLATE,{designerClass:this.get("designerClass")}));D.append(this.nodeLayout);this.nodeLayout.setStyle("width",this.get("layoutWidth"));C.baseNode=D;C.targetType="start";this.nodeLayout.plug(A.Bewype.LayoutDesignerTarget,C);},destructor:function(){this.nodeLayout.unplug(A.Bewype.LayoutDesignerTarget);},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});A.namespace("Bewype");A.Bewype.LayoutDesigner=B;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});YUI.add("bewype-layout-designer-content-base",function(A){var B=function(C){B.superclass.constructor.apply(this,arguments);};B.NAME="layout-designer-content";B.NS="layoutDesignerContent";A.extend(B,A.Bewype.LayoutDesignerConfig,{_q:null,editing:false,_init:function(D){var C=this.get("host"),F=this.get("parentNode"),E=null;E=new A.Node.create(A.substitute(D,{designerClass:this.get("designerClass"),contentType:this.get("contentType")}));C.append(E);E.setStyle("height",this.get("contentHeight"));E.setStyle("width",this.get("contentWidth"));A.on("mouseenter",A.bind(this._onMouseEnter,this),C);F.layoutDesignerPlaces.registerContent(C);this._q=new A.AsyncQueue();return E;},initializer:function(C){this.setAttrs(C);},destructor:function(){var E=this.get("host"),H=this.get("parentNode"),D=this.get("designerClass")+"-content",F=this.get("contentType")==="image"?"img.":"div.",G=E.one(F+D),C=E.one("div."+D+"-clone");this._detachEditor();H.layoutDesignerPlaces.unRegisterContent(E);A.detach(E);G.remove();if(C){A.Event.purgeElement(C,true);C.remove();}E.remove();},_detachEditor:function(){var F=this.get("host"),E=this.get("baseNode"),H=this.get("designerClass")+"-sources",D=this.get("designerClass")+"-edit-panel",G=E.one("div."+H),C=E.one("div."+D);if(C.bewypeEditorPanel){C.unplug(A.Bewype.EditorPanel);F.detachAll("bewype-editor:onClose");F.detachAll("bewype-editor:onChange");this.refresh();}this.editing=false;C.setStyle("display","none");G.setStyle("display","block");this._refreshCloneNode();return true;},_attachEditor:function(){var M=this.get("host"),E=this.get("baseNode"),C=this.get("parentNode"),L=this.get("designerClass")+"-sources",J=this.get("designerClass")+"-edit-panel",O=E.one("div."+L),H=E.one("div."+J),I=C.layoutDesignerPlaces.getAvailablePlace(),K=this.get("contentType")==="image"?A.Bewype.EditorTag:A.Bewype.EditorText,D=this.get("contentType")==="image"?"editorImageButtons":"editorTextButtons",G=this.getContentNode(),F=null,N=null;O.setStyle("display","none");H.setStyle("display","block");N=I?I:0;N+=this.getContentWidth();F={panelNode:H,spinnerMaxWidth:N,activeButtons:this.get(D)};G.plug(K,F);A.on("bewype-editor:onClose",A.bind(this._detachEditor,this),G);A.on("bewype-editor:onChange",A.bind(this.refresh,this),G);this.editing=true;},_onClickEdit:function(C){var D=this.get("parentNode");A.each(D.layoutDesignerPlaces.getContents(),function(F,E){F.layoutDesignerContent._detachEditor();});this._attachEditor();},_onClickRemove:function(C){var D=this.get("host"),E=this.get("parentNode");E.layoutDesignerPlaces.removeContent(D);},hideClone:function(C){if(!C){var E=this.get("host"),D=this.get("designerClass")+"-content";
C=E.one("div."+D+"-clone");}if(C){A.each(C.all("div"),function(G,F){G.setStyle("visibility","hidden");});C.setStyle("visibility","hidden");}},_addCloneNode:function(){var F=this.get("host"),E=this.get("designerClass")+"-content",C=new A.Node.create('<div class="'+E+'-clone-callbacks" />'),D=null,G=null,H=null;D=F.cloneNode(false);D.set("innerHTML","");D.set("className",E+"-clone");F.append(D);D.setStyle("z-index",this.get("contentZIndex"));D.setStyle("position","absolute");D.setStyle("bottom",0);D.append(C);G=new A.Node.create('<div class="'+E+'-clone-edit" />');C.append(G);A.on("click",A.bind(this._onClickEdit,this),G);H=new A.Node.create('<div class="'+E+'-clone-remove" />');C.append(H);A.on("click",A.bind(this._onClickRemove,this),H);this._refreshCloneNode();return D;},_onMouseEnter:function(C){if(this.editing){return;}var F=this.get("host"),G=this.get("parentNode"),E=this.get("designerClass")+"-content",D=F.one("div."+E+"-clone");G.layoutDesignerPlaces.cleanContentOver();if(D){A.each(D.all("div"),function(I,H){I.setStyle("visibility","visible");});D.setStyle("visibility","visible");}else{D=this._addCloneNode();}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[D]});this._q.run();},getContentHeight:function(){var F=this.getContentNode(),C=A.Bewype.Utils.getHeight(F),E=A.Bewype.Utils.getStyleValue(F,"paddingTop")||0,D=A.Bewype.Utils.getStyleValue(F,"paddingBottom")||0;return C+E+D;},getContentWidth:function(){var F=this.getContentNode(),E=A.Bewype.Utils.getWidth(F),D=A.Bewype.Utils.getStyleValue(F,"paddingRight")||0,C=A.Bewype.Utils.getStyleValue(F,"paddingLeft")||0;return E+C+D;},getContentNode:function(){var D=this.get("host"),C=this.get("designerClass")+"-content",E=this.get("contentType")==="image"?"img.":"div.";return D.one(E+C);},_refreshCloneNode:function(G){var F=this.get("host"),E=this.get("designerClass")+"-content",D=F.one("div."+E+"-clone"),H=this.getContentHeight(),C=G||this.getContentWidth();if(D){D.setStyle("height",H);D.setStyle("width",C);}},refresh:function(C){var E=this.get("parentNode"),D=this.getContentNode();if(D){}this._refreshCloneNode(C);E.layoutDesignerTarget.refresh();}});A.namespace("Bewype");A.Bewype.LayoutDesignerContentBase=B;},"@VERSION@",{requires:["async-queue","plugin","substitute"]});YUI.add("bewype-layout-designer-content-image",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.C_TEMPLATE='<image class="{designerClass}-content ';A.C_TEMPLATE+='{designerClass}-content-{contentType}" ';A.C_TEMPLATE+='src="{defaultImg}" />';A.NAME="layout-designer-content-image";A.NS="layoutDesignerContent";B.extend(A,B.Bewype.LayoutDesignerContentBase,{_q:null,editing:false,initializer:function(C){this.setAttrs(C);var D=B.substitute(A.C_TEMPLATE,{defaultImg:this.get("defaultImg")});this._init(D);}});B.namespace("Bewype");B.Bewype.LayoutDesignerContentImage=A;},"@VERSION@",{requires:["bewype-editor","bewype-layout-designer-content-base"]});YUI.add("bewype-layout-designer-content-text",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.C_TEMPLATE='<div class="{designerClass}-content ';A.C_TEMPLATE+='{designerClass}-content-{contentType}">';A.C_TEMPLATE+="</div>";A.NAME="layout-designer-content-text";A.NS="layoutDesignerContent";B.extend(A,B.Bewype.LayoutDesignerContentBase,{_q:null,editing:false,initializer:function(C){this.setAttrs(C);var D=this._init(A.C_TEMPLATE);D.set("innerHTML",this.get("defaultText"));}});B.namespace("Bewype");B.Bewype.LayoutDesignerContentText=A;},"@VERSION@",{requires:["bewype-editor","bewype-layout-designer-content-base"]});YUI.add("bewype-layout-designer-places",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-places";A.NS="layoutDesignerPlaces";A.H_PLACES_TEMPLATE='<table class="{designerClass}-places {designerClass}-places-horizontal">';A.H_PLACES_TEMPLATE+="<tr />";A.H_PLACES_TEMPLATE+="</table>";A.V_PLACES_TEMPLATE='<ul class="{designerClass}-places {designerClass}-places-vertical"></ul>';A.H_DEST_TEMPLATE='<td class="{designerClass}-cell {designerClass}-cell-horizontal">';A.H_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';A.H_DEST_TEMPLATE+="</td>";A.V_DEST_TEMPLATE='<li class="{designerClass}-cell {designerClass}-cell-vertical">';A.V_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';A.V_DEST_TEMPLATE+="</li>";B.extend(A,B.Bewype.LayoutDesignerConfig,{placesNode:null,contents:null,sortable:null,initializer:function(D){this.setAttrs(D);var F=this.get("host"),E=this.get("placesType"),C=A.H_PLACES_TEMPLATE,H=A.V_PLACES_TEMPLATE,I=(E==="horizontal")?C:H,G=this.get("parentNode");this.placesNode=new B.Node.create(B.substitute(I,{designerClass:this.get("designerClass")}));F.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));this._initSortable();if(G){G.layoutDesignerPlaces.registerContent(F);}this.contents=[];},_initSortable:function(){var C=this.get("placesType"),D=(C==="horizontal")?"td":"li";if(this.sortable){this.sortable.destroy();}this.sortable=new B.Sortable({container:this.placesNode,nodes:D,opacity:".2"});B.DD.DDM.on("drop:hit",B.bind(this._dropHitGotcha,this),this.placesNode);},_dropHitGotcha:function(M){var F=M.drag.get("node"),K="."+this.get("designerClass")+"-places",N="."+this.get("designerClass")+"-container",L=F.one(N),J=F.one(K)?L:F.one(N),C=null,G=null,D=L?L.ancestor("table"):null,I=D?D.ancestor("div").layoutDesignerPlaces:null,H=null,E=null;if(!J||!I){return;}else{if(J.layoutDesignerContent){G=J.layoutDesignerContent.get("parentNode");C=J.layoutDesignerContent.getContentWidth();}else{if(J.layoutDesignerPlaces){G=J.layoutDesignerPlaces.get("parentNode");C=J.layoutDesignerPlaces.getPlacesWidth();}else{return;}}}if(G.layoutDesignerPlaces!=I){G.layoutDesignerPlaces.removeContent(J);H=G.layoutDesignerPlaces;E=H.addDestNode();E.append(J);H.registerContent(J);if(J.layoutDesignerContent){J.layoutDesignerContent.set("parentNode",H.get("host"));
J.layoutDesignerContent.refresh();}else{J.layoutDesignerPlaces.set("parentNode",H.get("host"));H.get("host").layoutDesignerTarget.refresh();}G.layoutDesignerTarget.refresh();}},destructor:function(){var C=this.get("host"),D=this.get("parentNode");B.Object.each(this.contents,function(F,E){if(F.layoutDesignerPlaces){F.layoutDesignerPlaces.destroy();}else{this.removeContent(F);}},this);if(D){D.layoutDesignerPlaces.unRegisterContent(C);}this.placesNode.remove();},hasSubPlaces:function(){var C=false;B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C=true;}});return C;},getAvailablePlace:function(){var H=this.get("parentNode")||this.placesNode.ancestor("div"),E=this.get("placesType"),G=this.get("parentNode")?H.layoutDesignerPlaces:null,C=B.Bewype.Utils.getWidth(H),D=G?G.getAvailablePlace():C,F=this.getPlacesWidth();if(E==="vertical"){return F===0?D:F;}else{return D-F;}},hasPlace:function(D){var C=this.getAvailablePlace(),E=this.get("placesType");D=D?D:this.get("contentWidth");return E==="vertical"||C>=D;},getPlacesWidth:function(){var C=0,D=this.get("parentNode")||this.placesNode.ancestor("div");switch(this.get("placesType")){case"vertical":if(!this.get("parentNode")){return B.Bewype.Utils.getWidth(D);}B.each(this.contents,function(F,E){var G=0;if(F.layoutDesignerPlaces){G=F.layoutDesignerPlaces.getPlacesWidth();}else{G=F.layoutDesignerContent.getContentWidth();}if(G>C){C=G;}});break;case"horizontal":B.each(this.contents,function(F,E){if(F.layoutDesignerPlaces){C+=F.layoutDesignerPlaces.getPlacesWidth();}else{C+=F.layoutDesignerContent.getContentWidth();}});break;}return C;},getPlacesHeight:function(){var C=0;switch(this.get("placesType")){case"vertical":B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C+=E.layoutDesignerPlaces.getPlacesHeight();}else{C+=E.layoutDesignerContent.getContentHeight();}});break;case"horizontal":B.each(this.contents,function(E,D){var F=0;if(E.layoutDesignerPlaces){F=E.layoutDesignerPlaces.getPlacesHeight();}else{F=E.layoutDesignerContent.getContentHeight();}if(F>C){C=F;}});C=(C===0)?this.get("contentHeight"):C;break;}return C;},refresh:function(C){var D=this.get("placesType"),E=this.getPlacesHeight(),G=this.getPlacesWidth(),F=this.get("parentNode");E=E===0?this.get("contentHeight"):E;G=G===0?this.getAvailablePlace():G;this.placesNode.setStyle("height",E);this.placesNode.setStyle("width",G);switch(D){case"vertical":B.each(this.contents,function(J,I){var H=null;if(J.layoutDesignerPlaces){H=J.layoutDesignerPlaces.placesNode;H.setStyle("width",G);}});break;case"horizontal":B.each(this.contents,function(J,I){var H=null;if(J.layoutDesignerPlaces){H=J.layoutDesignerPlaces.placesNode;}else{H=J.layoutDesignerContent.get("host");}H.ancestor("td").setStyle("height",E);H.ancestor("td").setStyle("vertical-align","top");});break;}if(!C){if(F){F.layoutDesignerTarget.refresh();}else{this.placesNode.ancestor("div").setStyle("height",E);}}return[E,G];},cleanContentOver:function(){B.each(this.contents,function(D,C){if(D.layoutDesignerContent){D.layoutDesignerContent._q.stop();D.layoutDesignerContent.hideClone();}});},addDestNode:function(){if(!this.hasPlace()){return null;}var C=null;switch(this.get("placesType")){case"horizontal":C=new B.Node.create(B.substitute(A.H_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.one("tr").append(C);break;case"vertical":C=new B.Node.create(B.substitute(A.V_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.append(C);break;}return C.one("div");},registerContent:function(C){this.contents.push(C);},unRegisterContent:function(C){var D=this.contents.indexOf(C);if(D!=-1){this.contents.splice(D,1);}},addContent:function(F){if(!this.hasPlace()){return null;}var E=this.addDestNode(),C=null,D=this.getAttrs();D.contentType=F;D.parentNode=this.get("host");D.contentWidth=this.getAvailablePlace();switch(F){case"text":C=B.Bewype.LayoutDesignerContentText;break;case"image":C=B.Bewype.LayoutDesignerContentImage;break;default:return;}E.plug(C,D);},removeContent:function(C){var E=null,D=this.get("host");switch(this.get("placesType")){case"horizontal":E=C.ancestor("td");break;case"vertical":E=C.ancestor("li");break;}this.unRegisterContent(C);E.remove();D.layoutDesignerTarget.refresh();},getContents:function(){var C=[];B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C=C.concat(E.layoutDesignerPlaces.getContents());}else{C.push(E);}});return C;}});B.namespace("Bewype");B.Bewype.LayoutDesignerPlaces=A;},"@VERSION@",{requires:["sortable","dd-constrain","bewype-layout-designer-content-text"]});YUI.add("bewype-layout-designer-sources",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-sources";A.NS="layoutDesignerSources";A.ITEM_SRC_TEMPLATE='<div class="{designerClass}-src {designerClass}-src-{itemType}">{itemLabel}</div>';A.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},sourceHeight:{value:40,validator:function(C){return B.Lang.isNumber(C);}},sourceWidth:{value:140,validator:function(C){return B.Lang.isNumber(C);}}};B.extend(A,B.Plugin.Base,{_groups:["horizontal","vertical","text","image"],_labels:["Layout Horizontal","Layout Vertical","Text","Image"],initializer:function(D){var C=new B.Node.create("<table><tr /></table>");this.get("host").append(C);B.Object.each(this._groups,function(G,F){var E=null,I=null,H=null;E=new B.Node.create(B.substitute(A.ITEM_SRC_TEMPLATE,{itemType:G,designerClass:this.get("designerClass"),itemLabel:this._labels[F]}));I=new B.Node.create("<td />");I.append(E);C.append(I);E.setStyle("height",this.get("sourceHeight"));E.setStyle("width",this.get("sourceWidth"));H=new B.DD.Drag({node:E,groups:[G],dragMode:"intersect"});H.plug(B.Plugin.DDProxy,{moveOnEnd:false});H.plug(B.Plugin.DDConstrained,{constrain2node:[this.get("host"),this.get("host").next()]});H.on("drag:start",B.bind(this._onDragStart,this,H));H.on("drag:end",B.bind(this._onDragEnd,this,H));
},this);},destructor:function(){},_onDragStart:function(E,C){var D=E.get("node"),F=E.get("dragNode");D.setStyle("opacity",0.2);F.set("innerHTML",D.get("innerHTML"));F.setStyles({backgroundColor:D.getStyle("backgroundColor"),color:D.getStyle("color"),opacity:0.65});},_onDragEnd:function(D,C){D.get("node").setStyle("opacity",1);}});B.namespace("Bewype");B.Bewype.LayoutDesignerSources=A;},"@VERSION@",{requires:["dd","plugin","substitute"]});YUI.add("bewype-layout-designer-target",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-target";A.NS="layoutDesignerTarget";B.extend(A,B.Bewype.LayoutDesignerConfig,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","text","image"],initializer:function(D){this.setAttrs(D);var H=this.get("host"),F=this.get("targetType"),G=this.get("designerClass")+"-target",C=this.get("layoutWidth"),J=this.get("contentHeight"),I=this.get("contentWidth"),K=this.get("targetMinHeight"),L=this.get("targetMinWidth"),E=null;this._targetNode=new B.Node.create('<div class="'+G+" "+G+"-"+F+'" />');H.append(this._targetNode);if(F==="vertical"||F==="start"){E=H.ancestor("table")?I:C;this._targetNode.setStyle("height",K);this._targetNode.setStyle("width",E);}else{if(F==="horizontal"){this._targetNode.setStyle("height",J);this._targetNode.setStyle("width",L);}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new B.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":B.bind(this._onDropEnter,this),"drop:hit":B.bind(this._onDropHit,this),"drop:exit":B.bind(this._afterDropExit,this)}});if(F!="start"){B.on("mouseenter",B.bind(this._onMouseEnter,this),this._targetNode);B.on("mouseleave",B.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var C=this.get("host"),E=this.get("parentNode"),D=this._targetNode.one("div");if(C.layoutDesignerPlaces){C.unplug(B.Bewype.LayoutDesignerPlaces);}this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(D){D.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(E){E.layoutDesignerTarget.refresh();}else{C.setStyle("height",this.get("targetMinHeight"));this._addTarget(C,"start");}},_onDropEnter:function(C){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh();},_afterDropExit:function(C){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh();},_onClickRemove:function(C){var D=this.get("host");D.unplug(B.Bewype.LayoutDesignerTarget);if(!this.get("parentNode")){D.setStyle("height",this.get("targetMinHeight"));this._addTarget(D,"start");}},_onMouseEnter:function(C){var E=this.get("targetType"),D=this.get("designerClass")+"-target",F=this._targetNode.one("div");switch(E){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(F){F.setStyle("display","block");}else{F=new B.Node.create('<div class="'+D+"-remove "+D+"-"+E+'-remove" />');this._targetNode.append(F);B.on("click",B.bind(this._onClickRemove,this),F);}this.refresh();},_onMouseLeave:function(C){var D=this._targetNode.one("div");D.setStyle("display","none");this._afterDropExit(C);},_addPlaces:function(G,E){var D=this.get("host"),C=this.get("targetType"),F=this.getAttrs();F.placesType=E;F.parentNode=(C==="start"||E==="start")?null:D;G.plug(B.Bewype.LayoutDesignerPlaces,F);},_addTarget:function(G,E){var D=this.get("host"),C=this.get("targetType"),F=this.getAttrs();F.targetType=E;F.parentNode=(C==="start"||E==="start")?null:D;G.plug(B.Bewype.LayoutDesignerTarget,F);},_getHitType:function(C){var D=C.drag;if(D._groups.vertical){return"vertical";}else{if(D._groups.horizontal){return"horizontal";}else{if(D._groups.text){return"text";}else{if(D._groups.image){return"image";}else{return null;}}}}},_onDropHit:function(C){var E=this.get("host"),D=this.get("targetType"),F=this._getHitType(C),G=D==="start"?E:E.layoutDesignerPlaces.addDestNode();if(D==="start"){if(F==="text"||F==="image"){return this._afterDropExit(C);}E.unplug(B.Bewype.LayoutDesignerTarget);}if(F===D){return;}else{if(F==="start"||F==="horizontal"||F==="vertical"){this._addPlaces(G,F);this._addTarget(G,F);if(F!=="start"){G.layoutDesignerTarget.refresh();}}else{E.layoutDesignerPlaces.addContent(F);}}this._afterDropExit(C);},refresh:function(G){var H=this.get("host"),E=this.get("targetType"),I=this.get("parentNode")||H,L=null,K=null,J=null,F=null,C=null,D=null;if(H.layoutDesignerPlaces){L=H.layoutDesignerPlaces.refresh(G);}else{return;}K=L[0];J=L[1];F=B.Bewype.Utils.getHeight(this._targetNode);C=B.Bewype.Utils.getWidth(this._targetNode);D=this._targetNode.ancestor("div");switch(E){case"vertical":K=B.Bewype.Utils.getHeight(I);if(I==H){this._targetNode.setY(I.getY()+K-F);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",J);break;case"horizontal":J=B.Bewype.Utils.getWidth(I);this._targetNode.setX(I.getX()+J-C);if(I==H){this._targetNode.setY(I.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("height",K);break;default:return;}if(I!=H){I.layoutDesignerTarget.refresh();}}});B.namespace("Bewype");B.Bewype.LayoutDesignerTarget=A;},"@VERSION@",{requires:["bewype-layout-designer-places"]});YUI.add("bewype-layout-designer",function(A){},"@VERSION@",{use:["bewype-layout-designer-config","bewype-layout-designer-base","bewype-layout-designer-content-base","bewype-layout-designer-content-image","bewype-layout-designer-content-text","bewype-layout-designer-places","bewype-layout-designer-sources","bewype-layout-designer-target"]});
