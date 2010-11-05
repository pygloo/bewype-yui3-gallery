YUI.add("bewype-layout-designer-places",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-places";A.NS="layoutDesignerPlaces";A.H_PLACES_TEMPLATE='<table class="{designerClass}-places {designerClass}-places-horizontal">';A.H_PLACES_TEMPLATE+="<tr />";A.H_PLACES_TEMPLATE+="</table>";A.V_PLACES_TEMPLATE='<ul class="{designerClass}-places {designerClass}-places-vertical"></ul>';A.H_DEST_TEMPLATE='<td class="{designerClass}-cell {designerClass}-cell-horizontal">';A.H_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';A.H_DEST_TEMPLATE+="</td>";A.V_DEST_TEMPLATE='<li class="{designerClass}-cell {designerClass}-cell-vertical">';A.V_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';A.V_DEST_TEMPLATE+="</li>";B.extend(A,B.Bewype.LayoutDesignerConfig,{placesNode:null,contents:null,sortable:null,initializer:function(D){this.setAttrs(D);var F=this.get("host"),E=this.get("placesType"),C=A.H_PLACES_TEMPLATE,H=A.V_PLACES_TEMPLATE,I=(E==="horizontal")?C:H,G=this.get("parentNode");this.placesNode=new B.Node.create(B.substitute(I,{designerClass:this.get("designerClass")}));F.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));this._initSortable();if(G){G.layoutDesignerPlaces.registerContent(F);}this.contents=[];},_initSortable:function(){var C=this.get("placesType"),D=(C==="horizontal")?"td":"li";if(this.sortable){this.sortable.destroy();}this.sortable=new B.Sortable({container:this.placesNode,nodes:D,opacity:".2"});},destructor:function(){var C=this.get("host"),D=this.get("parentNode");B.Object.each(this.contents,function(F,E){if(F.layoutDesignerPlaces){F.layoutDesignerPlaces.destroy();}else{this.removeContent(F);}},this);if(D){D.layoutDesignerPlaces.unRegisterContent(C);}this.placesNode.remove();},hasSubPlaces:function(){var C=false;B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C=true;}});return C;},getAvailablePlace:function(){var H=this.get("parentNode")||this.placesNode.ancestor("div"),E=this.get("placesType"),G=this.get("parentNode")?H.layoutDesignerPlaces:null,C=B.Bewype.Utils.getWidth(H),D=G?G.getAvailablePlace():C,F=this.getPlacesWidth();if(E==="vertical"){return F===0?D:F;}else{return D-F;}},hasPlace:function(D){var C=this.getAvailablePlace(),E=this.get("placesType");D=D?D:this.get("contentWidth");return E==="vertical"||C>=D;},getPlacesWidth:function(){var C=0,D=this.get("parentNode")||this.placesNode.ancestor("div");switch(this.get("placesType")){case"vertical":if(!this.get("parentNode")){return B.Bewype.Utils.getWidth(D);}B.each(this.contents,function(F,E){var G=0;if(F.layoutDesignerPlaces){G=F.layoutDesignerPlaces.getPlacesWidth();}else{G=F.layoutDesignerContent.getContentWidth();}if(G>C){C=G;}});break;case"horizontal":B.each(this.contents,function(F,E){if(F.layoutDesignerPlaces){C+=F.layoutDesignerPlaces.getPlacesWidth();}else{C+=F.layoutDesignerContent.getContentWidth();}});break;}return C;},getPlacesHeight:function(){var C=0;switch(this.get("placesType")){case"vertical":B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C+=E.layoutDesignerPlaces.getPlacesHeight();}else{C+=E.layoutDesignerContent.getContentHeight();}});break;case"horizontal":B.each(this.contents,function(E,D){var F=0;if(E.layoutDesignerPlaces){F=E.layoutDesignerPlaces.getPlacesHeight();}else{F=E.layoutDesignerContent.getContentHeight();}if(F>C){C=F;}});C=(C===0)?this.get("contentHeight"):C;break;}return C;},refresh:function(C){var D=this.get("placesType"),E=this.getPlacesHeight(),G=this.getPlacesWidth(),F=this.get("parentNode");E=E===0?this.get("contentHeight"):E;G=G===0?this.getAvailablePlace():G;this.placesNode.setStyle("height",E);this.placesNode.setStyle("width",G);switch(D){case"vertical":B.each(this.contents,function(J,I){var H=null;if(J.layoutDesignerPlaces){H=J.layoutDesignerPlaces.placesNode;H.setStyle("width",G);}});break;case"horizontal":B.each(this.contents,function(J,I){var H=null;if(J.layoutDesignerPlaces){H=J.layoutDesignerPlaces.placesNode;}else{H=J.layoutDesignerContent.get("host");}H.ancestor("td").setStyle("height",E);H.ancestor("td").setStyle("vertical-align","top");});break;}if(!C){if(F){F.layoutDesignerTarget.refresh();}else{this.placesNode.ancestor("div").setStyle("height",E);}}return[E,G];},cleanContentOver:function(){B.each(this.contents,function(D,C){if(D.layoutDesignerContent){D.layoutDesignerContent._q.stop();D.layoutDesignerContent.hideClone();}});},addDestNode:function(){if(!this.hasPlace()){return null;}var C=null;switch(this.get("placesType")){case"horizontal":C=new B.Node.create(B.substitute(A.H_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.one("tr").append(C);break;case"vertical":C=new B.Node.create(B.substitute(A.V_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.append(C);break;}return C.one("div");},registerContent:function(C){this.contents.push(C);},unRegisterContent:function(C){var D=this.contents.indexOf(C);if(D!=-1){this.contents.splice(D,1);}},addContent:function(F){if(!this.hasPlace()){return null;}var E=this.addDestNode(),C=null,D=this.getAttrs();D.contentType=F;D.parentNode=this.get("host");D.contentWidth=this.getAvailablePlace();switch(F){case"text":C=B.Bewype.LayoutDesignerContentText;break;case"image":C=B.Bewype.LayoutDesignerContentImage;break;default:return;}E.plug(C,D);},removeContent:function(C){var E=null,D=this.get("host");switch(this.get("placesType")){case"horizontal":E=C.ancestor("td");break;case"vertical":E=C.ancestor("li");break;}this.unRegisterContent(C);E.remove();D.layoutDesignerTarget.refresh();},getContents:function(){var C=[];B.each(this.contents,function(E,D){if(E.layoutDesignerPlaces){C=C.concat(E.layoutDesignerPlaces.getContents());}else{C.push(E);}});return C;}});B.namespace("Bewype");B.Bewype.LayoutDesignerPlaces=A;},"@VERSION@",{requires:["sortable","bewype-layout-designer-content-text"]});