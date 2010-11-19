YUI.add("bewype-layout-designer-places",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-places";a.NS="layoutDesignerPlaces";a.H_PLACES_TEMPLATE='<table class="{designerClass}-places {designerClass}-places-horizontal">';a.H_PLACES_TEMPLATE+="<tr />";a.H_PLACES_TEMPLATE+="</table>";a.V_PLACES_TEMPLATE='<ul class="{designerClass}-places {designerClass}-places-vertical"></ul>';a.H_DEST_TEMPLATE='<td class="{designerClass}-cell {designerClass}-cell-horizontal">';a.H_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';a.H_DEST_TEMPLATE+="</td>";a.V_DEST_TEMPLATE='<li class="{designerClass}-cell {designerClass}-cell-vertical">';a.V_DEST_TEMPLATE+='<div class="{designerClass}-container"></div>';a.V_DEST_TEMPLATE+="</li>";b.extend(a,b.Bewype.LayoutDesignerConfig,{placesNode:null,contents:null,sortable:null,initializer:function(d){this.setAttrs(d);var f=this.get("host"),e=this.get("placesType"),c=a.H_PLACES_TEMPLATE,h=a.V_PLACES_TEMPLATE,i=(e==="horizontal")?c:h,g=this.get("parentNode");this.placesNode=new b.Node.create(b.substitute(i,{designerClass:this.get("designerClass")}));f.append(this.placesNode);this.placesNode.setStyle("height",this.get("contentHeight"));this.placesNode.setStyle("width",this.get("contentWidth"));this._initSortable();if(g){g.layoutDesignerPlaces.registerContent(f);}this.contents=[];},_initSortable:function(){var e=this.get("placesType"),g=(e==="horizontal")?"td":"li",d=this.get("designerClass"),c="."+d+"-content-clone-drag",h=this.get("parentNode"),f=null;if(this.sortable){this.sortable.destroy();}this.sortable=new b.Sortable({container:this.placesNode,nodes:g,opacity:".2",handles:[c]});if(h){f=h.layoutDesignerPlaces.get("parentNode");if(f){f.layoutDesignerPlaces.sortable.join(this.sortable,"full");}}},destructor:function(){var c=this.get("host"),d=this.get("parentNode");b.Object.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){f.unplug(b.Bewype.LayoutDesignerPlaces);}else{if(f.layoutDesignerContent){var g=f.layoutDesignerContent.get("contentType");f.unplug(b.Bewype.LayoutDesignerContent);}else{}}},this);if(d){d.layoutDesignerPlaces.unRegisterContent(c);}},hasSubPlaces:function(){var c=false;b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=true;}});return c;},getMaxWidth:function(){return b.Bewype.Utils.getWidth(this.get("host"));},getAvailablePlace:function(){var d=this.get("placesType"),e=this.getMaxWidth(),c=this.getPlacesWidth();if(d==="vertical"){return c===0?e:c;}else{return e-c;}},hasPlace:function(d){var c=this.getAvailablePlace(),e=this.get("placesType");d=d?d:this.get("contentWidth");return e==="vertical"||c>=d;},getPlacesWidth:function(){var c=0,d=this.get("parentNode")||this.placesNode.ancestor("div");switch(this.get("placesType")){case"vertical":if(!this.get("parentNode")){return b.Bewype.Utils.getWidth(d);}b.each(this.contents,function(f,e){var g=0;if(f.layoutDesignerPlaces){g=f.layoutDesignerPlaces.getPlacesWidth();}else{g=f.layoutDesignerContent.getContentWidth();}if(g>c){c=g;}});break;case"horizontal":b.each(this.contents,function(f,e){if(f.layoutDesignerPlaces){c+=f.layoutDesignerPlaces.getPlacesWidth();}else{c+=f.layoutDesignerContent.getContentWidth();}});break;}return c;},getPlacesHeight:function(){var c=0;switch(this.get("placesType")){case"vertical":b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c+=e.layoutDesignerPlaces.getPlacesHeight();}else{c+=e.layoutDesignerContent.getContentHeight();}});break;case"horizontal":b.each(this.contents,function(e,d){var f=0;if(e.layoutDesignerPlaces){f=e.layoutDesignerPlaces.getPlacesHeight();}else{f=e.layoutDesignerContent.getContentHeight();}if(f>c){c=f;}});c=(c===0)?this.get("contentHeight"):c;break;}return c;},refresh:function(d){var c=this.get("placesType"),e=this.getPlacesHeight(),g=d?d:this.getPlacesWidth(),f=this.get("parentNode");e=e===0?this.get("contentHeight"):e;g=g===0?this.getAvailablePlace():g;this.placesNode.setStyle("height",e);this.placesNode.setStyle("width",g);switch(c){case"vertical":b.each(this.contents,function(j,i){var h=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;h.setStyle("width",g);if(d){j.layoutDesignerTarget.refresh(d);}}else{if(d){j.layoutDesignerContent.refresh(d);}}});break;case"horizontal":b.Object.each(this.contents,function(j,i){var h=null,m=d?(d/this.contents.length):null,l=null;if(j.layoutDesignerPlaces){h=j.layoutDesignerPlaces.placesNode;if(m){j.layoutDesignerTarget.refresh(m);}}else{if(j.layoutDesignerContent){h=j.layoutDesignerContent.get("host");if(m){j.layoutDesignerContent.refresh(m);}}}l=h?h.ancestor("td"):null;if(l){l.setStyle("height",e);l.setStyle("vertical-align","top");}},this);break;}if(!f){this.placesNode.ancestor("div").setStyle("height",e);}return[e,g];},cleanContentOver:function(){b.each(this.contents,function(d,c){if(d.layoutDesignerContent){d.layoutDesignerContent._q.stop();d.layoutDesignerContent.hideClone();}});},addDestNode:function(){var c=null;switch(this.get("placesType")){case"horizontal":c=new b.Node.create(b.substitute(a.H_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.one("tr").append(c);break;case"vertical":c=new b.Node.create(b.substitute(a.V_DEST_TEMPLATE,{designerClass:this.get("designerClass")}));this.placesNode.append(c);break;}return c.one("div");},registerContent:function(c){this.contents.push(c);},unRegisterContent:function(c){var d=this.contents.indexOf(c);if(d!=-1){this.contents.splice(d,1);}},addContent:function(h){var d=this.get("placesType"),g=this.addDestNode(),c=null,f=this.getAttrs(),e=this.getMaxWidth();f.contentType=h;f.parentNode=this.get("host");f.contentWidth=d==="vertical"?e:this.getAvailablePlace();g.plug(b.Bewype.LayoutDesignerContent,f);return e;},removeContent:function(c,f){var g=null,d=this.get("host"),e=c.layoutDesignerContent.get("contentType");switch(this.get("placesType")){case"horizontal":g=c.ancestor("td");break;case"vertical":g=c.ancestor("li");break;}this.unRegisterContent(c);
c.unplug(b.Bewype.LayoutDesignerContent);g.remove(true);if(d.layoutDesignerTarget){d.layoutDesignerTarget.refresh();}},getContents:function(){var c=[];b.each(this.contents,function(e,d){if(e.layoutDesignerPlaces){c=c.concat(e.layoutDesignerPlaces.getContents());}else{c.push(e);}});return c;}});b.namespace("Bewype");b.Bewype.LayoutDesignerPlaces=a;},"@VERSION@",{requires:["sortable","dd-constrain","bewype-layout-designer-content"]});