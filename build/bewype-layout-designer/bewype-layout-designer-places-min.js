YUI.add("bewype-layout-designer-places",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-places";a.NS="layoutDesignerPlaces";a.H_PLACES_TEMPLATE='<table class="{designerClass}-places {designerClass}-places-horizontal">';a.H_PLACES_TEMPLATE+="<tr />";a.H_PLACES_TEMPLATE+="</table>";a.V_PLACES_TEMPLATE='<table class="{designerClass}-places {designerClass}-places-vertical"></table>';a.H_DEST_TEMPLATE='<td class="{designerClass}-cell {designerClass}-cell-horizontal">';a.H_DEST_TEMPLATE+='<div class="{designerClass}-container">';a.H_DEST_TEMPLATE+="</div>";a.H_DEST_TEMPLATE+="</td>";a.V_DEST_TEMPLATE='<tr class="{designerClass}-cell {designerClass}-cell-vertical">';a.V_DEST_TEMPLATE+="<td>";a.V_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';a.V_DEST_TEMPLATE+="</td>";a.V_DEST_TEMPLATE+="</tr>";a.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},placesType:{value:"vertical",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultContent:{value:"Text..",validator:function(c){return b.Lang.isString(c);}},parentNode:{value:null,writeOnce:false},editPanelNode:{value:null,writeOnce:true}};b.extend(a,b.Plugin.Base,{placesNode:null,contents:null,sortable:null,initializer:function(d){var f=this.get("host"),e=this.get("placesType"),c=a.H_PLACES_TEMPLATE,h=a.V_PLACES_TEMPLATE,i=(e==="horizontal")?c:h,g=this.get("parentNode");this.placesNode=new b.Node.create(b.substitute(i,{designerClass:this.get("designerClass")}));f.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));this._initSortable();if(g){g.layoutDesignerPlaces.registerContent(f);}this.contents=[];},_initSortable:function(){var c=this.get("placesType"),d=(c==="horizontal")?"td":"tr";if(this.sortable){this.sortable.destroy();}this.sortable=new b.Sortable({container:this.placesNode,nodes:d,opacity:".2"});b.DD.DDM.on("drop:hit",b.bind(this._dropHitGotcha,this),this.placesNode);},_dropHitGotcha:function(m){var f=m.drag.get("node"),k="."+this.get("designerClass")+"-places",n="."+this.get("designerClass")+"-container",l=f.one(n),j=f.one(k)?l:f.one(n),c=null,g=null,d=l?l.ancestor("table"):null,i=d?d.ancestor("div").layoutDesignerPlaces:null,h=null,e=null;if(!j||!i){return;}else{if(j.layoutDesignerContent){g=j.layoutDesignerContent.get("parentNode");c=j.layoutDesignerContent.getContentWidth();}else{if(j.layoutDesignerPlaces){g=j.layoutDesignerPlaces.get("parentNode");c=j.layoutDesignerPlaces.getPlacesWidth();}else{return;}}}if(g.layoutDesignerPlaces!=i){g.layoutDesignerPlaces.removeContent(j);h=i.hasPlace(c)?i:g.layoutDesignerPlaces;e=h.addDestNode();e.append(j);h.registerContent(j);if(j.layoutDesignerContent){j.layoutDesignerContent.set("parentNode",h.get("host"));j.layoutDesignerContent.refresh();}else{j.layoutDesignerPlaces.set("parentNode",h.get("host"));h.get("host").layoutDesignerTarget.refresh();}g.layoutDesignerTarget.refresh();}},destructor:function(){var c=this.get("host"),d=this.get("parentNode");b.Object.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){f.layoutDesignerPlaces.destroy();}else{this.removeContent(f);}},this);if(d){d.layoutDesignerPlaces.unRegisterContent(c);}this.placesNode.remove();},hasSubPlaces:function(){var c=false;b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=true;}});return c;},getAvailablePlace:function(){var e=this.get("parentNode")||this.placesNode.ancestor("div"),c=null,d=null;switch(this.get("placesType")){case"vertical":e=this.get("parentNode")||this.placesNode.ancestor("div");case"horizontal":c=b.Bewype.Utils.getWidth(e);d=this.getPlacesWidth();return c-d;}},hasPlace:function(c){var f=this.get("parentNode")||this.placesNode.ancestor("div"),d=null,e=null;c=c?c:this.get("contentWidth");switch(this.get("placesType")){case"vertical":return true;case"horizontal":d=b.Bewype.Utils.getWidth(f);e=this.getPlacesWidth();return d>=(e+c);}},getPlacesWidth:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesWidth();}else{f=e.layoutDesignerContent.getContentWidth();}if(f>c){c=f;}});break;case"horizontal":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesWidth();}else{c+=e.layoutDesignerContent.getContentWidth();}});break;}return(c===0)?this.get("contentWidth"):c;},getPlacesHeight:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesHeight();}else{c+=e.layoutDesignerContent.getContentHeight();}});break;case"horizontal":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesHeight();}else{f=e.layoutDesignerContent.getContentHeight();}if(f>c){c=f;}});break;}return(c===0)?this.get("contentHeight"):c;},refresh:function(c){var d=this.get("placesType"),e=this.getPlacesHeight(),g=this.getPlacesWidth(),f=this.get("parentNode");this.placesNode.setStyle("height",e);this.placesNode.setStyle("width",g);switch(d){case"vertical":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;h.setStyle("width",g);}});break;case"horizontal":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;}else{h=j.layoutDesignerContent.get("host");}h.ancestor("td").setStyle("height",e);h.ancestor("td").setStyle("vertical-align","top");});break;}if(!c){if(f){f.layoutDesignerTarget.refresh();}else{this.placesNode.ancestor("div").setStyle("height",e);}}return[e,g];},cleanContentOver:function(){b.each(this.contents,function(d,c){if(d.layoutDesignerContent){d.layoutDesignerContent._q.stop();
d.layoutDesignerContent.hideClone();}});},addDestNode:function(){if(!this.hasPlace()){return null;}var d=null,c=this.placesNode.one("tr");switch(this.get("placesType")){case"horizontal":d=new b.Node.create(b.substitute(a.H_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));c.append(d);break;case"vertical":d=new b.Node.create(b.substitute(a.V_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.append(d);break;}return d.one("div");},registerContent:function(c){this.contents.push(c);},unRegisterContent:function(c){var d=this.contents.indexOf(c);this.contents.splice(d,1);},addContent:function(){if(!this.hasPlace()){return null;}var c=this.addDestNode();c.plug(b.Bewype.LayoutDesignerContent,{designerClass:this.get("designerClass"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),parentNode:this.get("host"),editPanelNode:this.get("editPanelNode")});},removeContent:function(c){var e=null,d=this.get("host");switch(this.get("placesType")){case"horizontal":e=c.ancestor("td");break;case"vertical":e=c.ancestor("tr");break;}this.unRegisterContent(c);e.remove();d.layoutDesignerTarget.refresh();},getContents:function(){var c=[];b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=c.concat(e.layoutDesignerPlaces.getContents());}else{c.push(e);}});return c;}});b.namespace("Bewype");b.Bewype.LayoutDesignerPlaces=a;},"@VERSION@",{requires:["sortable","bewype-layout-designer-content"]});