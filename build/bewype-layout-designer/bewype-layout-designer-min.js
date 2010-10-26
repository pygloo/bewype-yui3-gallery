YUI.add("bewype-layout-designer-base",function(A){var B=function(C){B.superclass.constructor.apply(this,arguments);};B.NODE_SRC_TEMPLATE='<div id="{idSource}"></div>';B.NODE_DST_TEMPLATE='<div id="{idDest}"></div>';B.NAME="layout-designer";B.NS="layoutDesigner";B.ATTRS={idSource:{value:"layout-source",writeOnce:true,validator:function(C){return A.Lang.isString(C);}},idDest:{value:"layout-dest",writeOnce:true,validator:function(C){return A.Lang.isString(C);}},targetOverHeight:{value:20,validator:function(C){return A.Lang.isNumber(C);}},targetMinHeight:{value:8,validator:function(C){return A.Lang.isNumber(C);}},targetOverWidth:{value:20,validator:function(C){return A.Lang.isNumber(C);}},targetMinWidth:{value:8,validator:function(C){return A.Lang.isNumber(C);}},targetZIndex:{value:1,validator:function(C){return A.Lang.isNumber(C);}},contentHeight:{value:40,validator:function(C){return A.Lang.isNumber(C);}},contentWidth:{value:120,validator:function(C){return A.Lang.isNumber(C);}},contentZIndex:{value:1,validator:function(C){return A.Lang.isNumber(C);}},contentClass:{value:"content",writeOnce:true,validator:function(C){return A.Lang.isString(C);}},defaultContent:{value:"Click to change your content..",validator:function(C){return A.Lang.isString(C);}},editCallback:{value:null},layoutWidth:{value:600,validator:function(C){return A.Lang.isNumber(C);}}};A.extend(B,A.Plugin.Base,{nodeLayout:null,initializer:function(C){var F=this.get("idSource"),D=this.get("idDest"),E=null;E=new A.Node.create(A.substitute(B.NODE_SRC_TEMPLATE,{idSource:F}));this.get("host").append(E);E.plug(A.Bewype.LayoutDesignerSources,{layoutWidth:this.get("layoutWidth")});this.nodeLayout=new A.Node.create(A.substitute(B.NODE_DST_TEMPLATE,{idDest:D}));this.get("host").append(this.nodeLayout);this.nodeLayout.setStyle("width",this.get("layoutWidth"));this.nodeLayout.plug(A.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinHeight:this.get("targetMinHeight"),targetMinWidth:this.get("targetMinWidth"),targetType:"start",targetZIndex:this.get("targetZIndex"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),idDest:D});},destructor:function(){},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});A.namespace("Bewype");A.Bewype.LayoutDesigner=B;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});YUI.add("bewype-layout-designer-content",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-content";A.NS="layoutDesignerContent";A.ATTRS={contentHeight:{value:40,validator:function(C){return B.Lang.isNumber(C);}},contentWidth:{value:140,validator:function(C){return B.Lang.isNumber(C);}},contentZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},contentClass:{value:"content",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},defaultContent:{value:"Click to change your content..",validator:function(C){return B.Lang.isString(C);}},defaultStyle:{value:null},parentNode:{value:null},removeCallback:{value:null},editCallback:{value:null}};B.extend(A,B.Plugin.Base,{_q:null,editing:false,initializer:function(C){var D=this.get("host"),E=this.get("parentNode");D.setStyle("height",this.get("contentHeight"));D.setStyle("width",this.get("contentWidth"));D.set("innerHTML",this.get("defaultContent"));B.on("mouseenter",B.bind(this._onMouseEnter,this),D);E.layoutDesignerPlaces.registerContent(D);this._q=new B.AsyncQueue();},destructor:function(){var E=this.get("host"),G=this.get("parentNode"),D=this.get("contentClass"),C=E.ancestor("div"),F=C.one("div."+D+"-clone");G.layoutDesignerPlaces.unRegisterContent(E);B.detach(E);if(F){B.Event.purgeElement(F,true);F.remove();}E.remove();},_onClickEdit:function(C){var D=this.get("editCallback");if(D){this.editing=true;this.hideClone();D(this.get("host"));}},_onClickRemove:function(C){var D=this.get("removeCallback");if(D){D(this.get("host"));}},hideClone:function(D){if(!D){var F=this.get("host"),E=this.get("contentClass"),C=F.ancestor("div");D=C.one("div."+E+"-clone");}if(D){B.each(D.all("div"),function(H,G){H.setStyle("visibility","hidden");});D.setStyle("visibility","hidden");}},_addCloneNode:function(C){var J=this.get("host"),E=this.get("contentClass"),H=this.get("editCallback"),D=this.get("removeCallback"),I=new B.Node.create('<div class="'+E+'-clone-callbacks" />'),F=null,K=null,G=null;F=J.cloneNode(false);F.set("innerHTML","");F.set("className",E+"-clone");C.append(F);F.setStyle("z-index",this.get("contentZIndex"));F.setStyle("position","absolute");F.setStyle("bottom",0);F.append(I);if(H){K=new B.Node.create('<div class="'+E+'-clone-edit" />');I.append(K);B.on("click",B.bind(this._onClickEdit,this),K);}if(D){G=new B.Node.create('<div class="'+E+'-clone-remove" />');I.append(G);B.on("click",B.bind(this._onClickRemove,this),G);}return F;},_onMouseEnter:function(D){if(this.editing){return;}var F=this.get("host"),H=this.get("parentNode"),E=this.get("contentClass"),C=F.ancestor("div"),G=C.one("div."+E+"-clone");H.layoutDesignerPlaces.cleanContentOver();if(G){B.each(G.all("div"),function(J,I){J.setStyle("visibility","visible");});G.setStyle("visibility","visible");}else{G=this._addCloneNode(C);}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[G]});this._q.run();},_getHeight:function(D,C){C=C?C:0;return parseInt(D.getComputedStyle("height")||D.getAttribute("height"),C);},_getWidth:function(D,C){C=C?C:0;return parseInt(D.getComputedStyle("width")||D.getAttribute("width"),C);},getContentHeight:function(){var C=this.get("host");return this._getHeight(C);},getContentWidth:function(){var C=this.get("host");return this._getWidth(C);
},refresh:function(){var G=this.get("host"),I=this.get("parentNode"),F=this.get("contentClass"),D=G.ancestor("div"),H=D.one("div."+F+"-clone"),E=this.getContentHeight(),C=this.getContentWidth();G.setStyle("height",E);G.setStyle("width",C);this.set("contentHeight",this._getHeight(D));this.set("contentWidth",this._getWidth(D));if(H){H.setStyle("height",this.get("contentHeight"));H.setStyle("width",this.get("contentWidth"));}I.layoutDesignerTarget.refresh();}});B.namespace("Bewype");B.Bewype.LayoutDesignerContent=A;},"@VERSION@",{requires:["async-queue","plugin","substitute"]});YUI.add("bewype-layout-designer-places",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-places";A.NS="layoutDesignerPlaces";A.H_PLACES_TEMPLATE='<table class="{placesClass}-horizontal">';A.H_PLACES_TEMPLATE+="<tr />";A.H_PLACES_TEMPLATE+="</table>";A.V_PLACES_TEMPLATE='<table class="{placesClass}-vertical"></table>';A.C_TEMPLATE='<div class="{contentClass}">{defaultContent}</div>';A.H_DEST_TEMPLATE='<td class="{destClass}-horizontal"><div class="container-{destClass}"></div></td>';A.V_DEST_TEMPLATE='<tr class="{destClass}-vertical">';A.V_DEST_TEMPLATE+="<td>";A.V_DEST_TEMPLATE+='<div class="container-{destClass}"></div>';A.V_DEST_TEMPLATE+="</td>";A.V_DEST_TEMPLATE+="</tr>";A.ATTRS={contentHeight:{value:40,validator:function(C){return B.Lang.isNumber(C);}},contentWidth:{value:140,validator:function(C){return B.Lang.isNumber(C);}},placesType:{value:"vertical",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},placesClass:{value:"places",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},destClass:{value:"dest",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},contentClass:{value:"content",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},defaultContent:{value:"Click to change your content..",validator:function(C){return B.Lang.isString(C);}},parentNode:{value:null},editCallback:{value:null}};B.extend(A,B.Plugin.Base,{placesNode:null,contents:null,sortable:null,initializer:function(D){var F=this.get("host"),E=this.get("placesType"),C=A.H_PLACES_TEMPLATE,H=A.V_PLACES_TEMPLATE,I=(E==="horizontal")?C:H,G=this.get("parentNode");this.placesNode=new B.Node.create(B.substitute(I,{placesClass:this.get("placesClass")}));F.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));this._initSortable();if(G){G.layoutDesignerPlaces.registerContent(F);}else{B.DD.DDM.on("drag:enter",this._onEnterGotcha);}this.contents=[];},_initSortable:function(){var C=this.get("placesType"),D=(C==="horizontal")?"td":"tr";if(this.sortable){this.sortable.destroy();}this.sortable=new B.Sortable({container:this.placesNode,nodes:D,opacity:".2"});},_onEnterGotcha:function(M){var E=M.drag,I=M.drag.get("node"),C=I.one("div.content"),L=M.drop.get("node"),F=L.ancestor("div"),G=true,K=null,J=null,D=null,O=null,N=null;G&=C&&C.layoutDesignerContent;G&=F&&F.layoutDesignerPlaces;G&=G&&F.layoutDesignerPlaces.get("placesType")==="vertical";G&=G&&F.layoutDesignerPlaces.contents.indexOf(C)==-1;if(G){K=C.layoutDesignerContent.get("parentNode");J=C.get("innerHTML");D=C.getStyle("cssText");O=C.ancestor("td");if(O.drop){C.unplug(B.Bewype.LayoutDesignerContent);O.drop.removeFromGroup(K.layoutDesignerPlaces.sortable);O.remove();N=K.layoutDesignerPlaces.addContent();N.set("innerHTML",J);N.setStyle("cssText",D);K.layoutDesignerTarget.refresh();E.removeFromGroup(K.layoutDesignerPlaces.sortable);E.stopDrag();E.end();try{M.stopImmediatePropagation();M.halt();}catch(H){}}}},destructor:function(){var C=this.get("host"),D=this.get("parentNode");B.Object.each(this.contents,function(F,E){if(F.layoutDesignerPlaces){F.layoutDesignerPlaces.destroy();}else{this.removeContent(F);}},this);if(D){D.layoutDesignerPlaces.unRegisterContent(C);}this.placesNode.remove();},_getHeight:function(D,C){C=C?C:0;return parseInt(D.getComputedStyle("height")||D.getAttribute("height"),C);},_getWidth:function(D,C){C=C?C:0;return parseInt(D.getComputedStyle("width")||D.getAttribute("width"),C);},hasSubPlaces:function(){var C=false;B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C=true;}});return C;},getAvailablePlace:function(){var E=this.get("parentNode")||this.placesNode.ancestor("div"),C=null,D=null;switch(this.get("placesType")){case"vertical":return null;case"horizontal":C=this._getWidth(E);D=this.getPlacesWidth();return C-D;}},hasPlace:function(){var E=this.get("parentNode")||this.placesNode.ancestor("div"),C=null,D=null;switch(this.get("placesType")){case"vertical":return true;case"horizontal":C=this._getWidth(E);D=this.getPlacesWidth();return C>=(D+this.get("contentWidth"));}},getPlacesWidth:function(){var C=0;switch(this.get("placesType")){case"vertical":B.each(this.contents,function(E,D){var F=0;if(E.layoutDesignerPlaces){F=E.layoutDesignerPlaces.getPlacesWidth();}else{F=E.layoutDesignerContent.getContentWidth();}if(F>C){C=F;}});break;case"horizontal":B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C+=E.layoutDesignerPlaces.getPlacesWidth();}else{C+=E.layoutDesignerContent.getContentWidth();}});break;}return(C===0)?this.get("contentWidth"):C;},getPlacesHeight:function(){var C=0;switch(this.get("placesType")){case"vertical":B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C+=E.layoutDesignerPlaces.getPlacesHeight();}else{C+=E.layoutDesignerContent.getContentHeight();}});break;case"horizontal":B.each(this.contents,function(E,D){var F=0;if(E.layoutDesignerPlaces){F=E.layoutDesignerPlaces.getPlacesHeight();}else{F=E.layoutDesignerContent.getContentHeight();}if(F>C){C=F;}});break;}return(C===0)?this.get("contentHeight"):C;},refresh:function(C){var D=this.get("placesType"),E=this.getPlacesHeight(),G=this.getPlacesWidth(),F=this.get("parentNode");this.placesNode.setStyle("height",E);this.placesNode.setStyle("width",G);switch(D){case"vertical":B.each(this.contents,function(J,I){var H=null;
if(J.layoutDesignerPlaces){H=J.layoutDesignerPlaces.placesNode;H.setStyle("width",G);}});break;case"horizontal":B.each(this.contents,function(J,I){var H=null;if(J.layoutDesignerPlaces){H=J.layoutDesignerPlaces.placesNode;}else{H=J.layoutDesignerContent.get("host");}H.ancestor("td").setStyle("height",E);H.ancestor("td").setStyle("vertical-align","top");});break;}if(!C){if(F){F.layoutDesignerTarget.refresh();}else{this.placesNode.ancestor("div").setStyle("height",E);}}return[E,G];},cleanContentOver:function(){B.each(this.contents,function(D,C){if(D.layoutDesignerContent){D.layoutDesignerContent._q.stop();D.layoutDesignerContent.hideClone();}});},addDestNode:function(){if(!this.hasPlace()){return null;}var D=null,C=this.placesNode.one("tr");switch(this.get("placesType")){case"horizontal":D=new B.Node.create(B.substitute(A.H_DEST_TEMPLATE,{destClass:this.get("destClass")}));C.append(D);break;case"vertical":D=new B.Node.create(B.substitute(A.V_DEST_TEMPLATE,{destClass:this.get("destClass")}));this.placesNode.append(D);break;}return D.one("div");},registerContent:function(C){this.contents.push(C);},unRegisterContent:function(C){var D=this.contents.indexOf(C);this.contents.splice(D,1);},addContent:function(){if(!this.hasPlace()){return null;}var D=this.addDestNode(),C=new B.Node.create(B.substitute(A.C_TEMPLATE,{contentClass:this.get("contentClass")}));D.append(C);C.plug(B.Bewype.LayoutDesignerContent,{contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),parentNode:this.get("host"),editCallback:this.get("editCallback"),removeCallback:B.bind(this.removeContent,this)});return C;},removeContent:function(C){var E=null,D=this.get("host");switch(this.get("placesType")){case"horizontal":E=C.ancestor("td");break;case"vertical":E=C.ancestor("tr");break;}this.unRegisterContent(C);E.remove();D.layoutDesignerTarget.refresh();},getContents:function(){var C=[];B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C=C.concat(E.layoutDesignerPlaces.getContents());}else{C.push(E);}});return C;}});B.namespace("Bewype");B.Bewype.LayoutDesignerPlaces=A;},"@VERSION@",{requires:["sortable","bewype-layout-designer-content"]});YUI.add("bewype-layout-designer-sources",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-sources";A.NS="layoutDesignerSources";A.ITEM_SRC_TEMPLATE='<div id="src-{itemType}" class="{itemClass}">{itemLabel}</div>';A.ATTRS={sourceHeight:{value:40,validator:function(C){return B.Lang.isNumber(C);}},sourceWidth:{value:140,validator:function(C){return B.Lang.isNumber(C);}},sourceClass:{value:"source-item",writeOnce:true,validator:function(C){return B.Lang.isString(C);}}};B.extend(A,B.Plugin.Base,{_groups:["horizontal","vertical","content"],_labels:["Layout Horizontal","Layout Vertical","Content"],initializer:function(D){var C=new B.Node.create("<table><tr /></table>");this.get("host").append(C);B.Object.each(this._groups,function(G,F){var E=null,I=null,H=null;E=new B.Node.create(B.substitute(A.ITEM_SRC_TEMPLATE,{itemType:G,itemClass:this.get("sourceClass"),itemLabel:this._labels[F]}));I=new B.Node.create("<td />");I.append(E);C.append(I);E.setStyle("height",this.get("sourceHeight"));E.setStyle("width",this.get("sourceWidth"));H=new B.DD.Drag({node:E,groups:[G],dragMode:"intersect"});H.plug(B.Plugin.DDProxy,{moveOnEnd:false});H.plug(B.Plugin.DDConstrained,{constrain2node:[this.get("host"),this.get("host").next()]});H.on("drag:start",B.bind(this._onDragStart,this,H));H.on("drag:end",B.bind(this._onDragEnd,this,H));},this);},destructor:function(){},_onDragStart:function(E,C){var D=E.get("node"),F=E.get("dragNode");D.setStyle("opacity",0.2);F.set("innerHTML",D.get("innerHTML"));F.setStyles({backgroundColor:D.getStyle("backgroundColor"),color:D.getStyle("color"),opacity:0.65});},_onDragEnd:function(D,C){D.get("node").setStyle("opacity",1);}});B.namespace("Bewype");B.Bewype.LayoutDesignerSources=A;},"@VERSION@",{requires:["dd","plugin","substitute"]});YUI.add("bewype-layout-designer-target",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-target";A.NS="layoutDesignerTarget";A.ATTRS={targetOverHeight:{value:20,validator:function(C){return B.Lang.isNumber(C);}},targetMinHeight:{value:8,validator:function(C){return B.Lang.isNumber(C);}},targetOverWidth:{value:20,validator:function(C){return B.Lang.isNumber(C);}},targetMinWidth:{value:8,validator:function(C){return B.Lang.isNumber(C);}},targetType:{value:"vertical",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},targetClass:{value:"target",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},targetZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},placesClass:{value:"places",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},parentNode:{value:null},contentHeight:{value:40,validator:function(C){return B.Lang.isNumber(C);}},contentWidth:{value:140,validator:function(C){return B.Lang.isNumber(C);}},contentZIndex:{value:1,validator:function(C){return B.Lang.isNumber(C);}},contentClass:{value:"content",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},defaultContent:{value:"Click to change your content..",validator:function(C){return B.Lang.isString(C);}},editCallback:{value:null},idDest:{value:"layout-dest",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},layoutWidth:{value:600,setter:"_setLayoutWidth",validator:function(C){return B.Lang.isNumber(C);}}};B.extend(A,B.Plugin.Base,{_targetNode:null,_dd:null,_groups:["horizontal","vertical","content"],initializer:function(D){var G=this.get("host"),F=this.get("targetType"),C=this.get("layoutWidth"),I=this.get("contentHeight"),H=this.get("contentWidth"),J=this.get("targetMinHeight"),K=this.get("targetMinWidth"),E=null;this._targetNode=new B.Node.create('<div class="'+this.get("targetClass")+"-"+F+'" />');
G.append(this._targetNode);if(F==="vertical"||F==="start"){E=G.ancestor("table")?H:C;this._targetNode.setStyle("height",J);this._targetNode.setStyle("width",E);}else{if(F==="horizontal"){this._targetNode.setStyle("height",I);this._targetNode.setStyle("width",K);}else{return;}}this._targetNode.setStyle("z-index",this.get("targetZIndex"));this._dd=new B.DD.Drop({node:this._targetNode,groups:this._groups,target:true,after:{"drop:enter":B.bind(this._onDropEnter,this),"drop:hit":B.bind(this._onDropHit,this),"drop:exit":B.bind(this._afterDropExit,this)}});if(F!="start"){B.on("mouseenter",B.bind(this._onMouseEnter,this),this._targetNode);B.on("mouseleave",B.bind(this._onMouseLeave,this),this._targetNode);}},destructor:function(){var C=this.get("host"),E=this.get("parentNode"),D=this._targetNode.one("div"),F=null;if(C.layoutDesignerPlaces){C.unplug(B.Bewype.LayoutDesignerPlaces);}this._dd.detachAll("drop:enter");this._dd.detachAll("drop:hit");this._dd.detachAll("drop:exit");if(D){D.detachAll("click");}this._targetNode.detachAll("mouseenter");this._targetNode.detachAll("mouseleave");this._targetNode.remove();if(E){E.layoutDesignerTarget.refresh();}else{F=B.one("#"+this.get("idDest"));F.setStyle("height",this.get("targetMinHeight"));this._addTarget(F,"start");}},_getHeight:function(D,C){C=C?C:0;return parseInt(D.getComputedStyle("height")||D.getAttribute("height"),C);},_getWidth:function(D,C){C=C?C:0;return parseInt(D.getComputedStyle("width")||D.getAttribute("width"),C);},_onDropEnter:function(C){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("contentHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("contentWidth"));break;}this.refresh(C);},_afterDropExit:function(C){switch(this.get("targetType")){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetMinHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetMinWidth"));break;}this.refresh(C);},_onClickRemove:function(C){var D=this.get("host"),E=null;D.unplug(B.Bewype.LayoutDesignerTarget);if(!this.get("parentNode")){E=B.one("#"+this.get("idDest"));E.setStyle("height",this.get("targetMinHeight"));this._addTarget(E,"start");}},_onMouseEnter:function(D){var C=this.get("targetClass"),E=this.get("targetType"),F=this._targetNode.one("div");switch(E){case"start":case"vertical":this._targetNode.setStyle("height",this.get("targetOverHeight"));break;case"horizontal":this._targetNode.setStyle("width",this.get("targetOverWidth"));break;}if(F){F.setStyle("display","block");}else{F=new B.Node.create('<div class="'+C+"-"+E+'-remove" />');this._targetNode.append(F);B.on("click",B.bind(this._onClickRemove,this),F);}this.refresh(D);},_onMouseLeave:function(C){var D=this._targetNode.one("div");D.setStyle("display","none");this._afterDropExit(C);},_addPlaces:function(F,D){var C=this.get("host"),E=(F.ancestor("td"))?C:null;F.plug(B.Bewype.LayoutDesignerPlaces,{placesMinHeight:this.get("targetMinHeight"),placesMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),placesClass:this.get("placesClass"),placesType:D,parentNode:E});},_addTarget:function(F,D){var C=this.get("host"),E=(F.ancestor("td"))?C:null;F.plug(B.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetMinHeight:this.get("targetMinHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinWidth:this.get("targetMinWidth"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),targetType:D,parentNode:E});},_getHitType:function(C){var D=C.drag;if(D._groups.vertical){return"vertical";}else{if(D._groups.horizontal){return"horizontal";}else{if(D._groups.content){return"content";}else{return null;}}}},_onDropHitStart:function(C){var E=this._getHitType(C),D=this.get("host");if(E==="content"){return this._afterDropExit(C);}D.unplug(B.Bewype.LayoutDesignerTarget);this._addPlaces(D,E);this._addTarget(D,E);D.layoutDesignerTarget.refresh();},_onDropHitHorizontal:function(C){var D=this.get("host"),E=this._getHitType(C),F=null;switch(E){case"content":D.layoutDesignerPlaces.addContent();break;case"vertical":F=D.layoutDesignerPlaces.addDestNode();this._addPlaces(F,E);this._addTarget(F,E);F.layoutDesignerTarget.refresh();break;}this._afterDropExit(C);},_onDropHitVertical:function(C){var D=this.get("host"),E=this._getHitType(C),F=null;switch(E){case"content":D.layoutDesignerPlaces.addContent();break;case"horizontal":F=D.layoutDesignerPlaces.addDestNode();this._addPlaces(F,E);this._addTarget(F,E);F.layoutDesignerTarget.refresh();break;}this._afterDropExit(C);},_onDropHit:function(C){switch(this.get("targetType")){case"start":return this._onDropHitStart(C);case"horizontal":return this._onDropHitHorizontal(C);case"vertical":return this._onDropHitVertical(C);}},refresh:function(){var H=this.get("host"),D=this.get("targetType"),I=null,G=null,F=null,E=null,C=null,J=null;if(H.layoutDesignerPlaces){I=H.layoutDesignerPlaces.refresh();}else{return;}G=I[0];F=I[1];E=this._getHeight(this._targetNode);C=this._getWidth(this._targetNode);J=this._targetNode.ancestor("td")||this._targetNode.ancestor("div");switch(D){case"vertical":G=this._getHeight(J);if(J.get("tagName").toLowerCase()==="div"){this._targetNode.setY(J.getY()+G-E);}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);}this._targetNode.setStyle("width",F);break;case"horizontal":F=this._getWidth(J);this._targetNode.setX(J.getX()+F-C);if(J.get("tagName").toLowerCase()==="div"){this._targetNode.setY(J.getY());}else{this._targetNode.setStyle("position","absolute");this._targetNode.setStyle("bottom",0);
}this._targetNode.setStyle("height",G);break;}J=H.layoutDesignerPlaces.get("parentNode");if(J){J.layoutDesignerTarget.refresh();}}});B.namespace("Bewype");B.Bewype.LayoutDesignerTarget=A;},"@VERSION@",{requires:["bewype-layout-designer-places"]});YUI.add("bewype-layout-designer",function(A){},"@VERSION@",{use:["bewype-layout-designer-base","bewype-layout-designer-content","bewype-layout-designer-places","bewype-layout-designer-sources","bewype-layout-designer-target"]});