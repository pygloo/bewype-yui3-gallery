YUI.add("bewype-layout-designer-content",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.C_TEXT_TEMPLATE='<div class="{designerClass}-content ';a.C_TEXT_TEMPLATE+='{designerClass}-content-{contentType}">';a.C_TEXT_TEMPLATE+="{defaultContent}</div>";a.C_IMG_TEMPLATE='<img class="{designerClass}-content ';a.C_IMG_TEMPLATE+='{designerClass}-content-{contentType}" ';a.C_IMG_TEMPLATE+='src="{defaultContent}" />';a.NAME="layout-designer-content";a.NS="layoutDesignerContent";b.extend(a,b.Bewype.LayoutDesignerConfig,{editing:false,initializer:function(c){this.setAttrs(c);var e=this.get("host"),i=this.get("parentNode"),g=this.get("contentType"),d=this.get("designerClass"),h=null,f=g==="text"?a.C_TEXT_TEMPLATE:a.C_IMG_TEMPLATE;h=new b.Node.create(b.substitute(f,{designerClass:d,contentType:g,defaultContent:g==="text"?this.get("defaultText"):this.get("defaultImg")}));e.append(h);h.setStyle("height",this.get("contentHeight"));h.setStyle("width",this.get("contentWidth"));i.layoutDesignerPlaces.registerContent(e);this._addCloneNode();},destructor:function(){var e=this.get("host"),h=this.get("parentNode"),d=this.get("designerClass")+"-content",f=this.get("contentType")==="image"?"img.":"div.",g=e.one(f+d),c=e.one("div."+d+"-clone");if(this.editing===true){this._detachEditor();}h.layoutDesignerPlaces.unRegisterContent(e);e.detachAll("mouseenter");if(c){c.one("."+d+"-clone-edit").detachAll("click");c.one("."+d+"-clone-remove").detachAll("click");c.remove();}e.replace(g);},_detachEditor:function(){var j=this.get("host"),c=this.get("baseNode"),i=this.get("designerClass")+"-sources",h=this.get("designerClass")+"-edit-panel",k=c.one("div."+i),g=c.one("div."+h),e=this.get("contentType")==="image"?b.Bewype.EditorTag:b.Bewype.EditorText,f=this.getContentNode(),d=this.getCloneNode();this.editing=false;if(g&&g.bewypeEditorPanel){g.unplug(b.Bewype.EditorPanel);f.unplug(e);j.detachAll("bewype-editor:onClose");j.detachAll("bewype-editor:onChange");this.refresh();}if(g){g.setStyle("display","none");}if(k){k.setStyle("display","block");d.setStyle("display","block");}this._refreshCloneNode();return true;},_attachEditor:function(){var o=this.get("host"),g=this.get("baseNode"),d=this.get("parentNode"),n=this.get("designerClass")+"-sources",m=this.get("designerClass")+"-edit-panel",s=g.one("div."+n),l=g.one("div."+m),r=d.layoutDesignerPlaces,f=r.get("placesType"),j=this.get("contentType")==="image"?b.Bewype.EditorTag:b.Bewype.EditorText,e=this.get("contentType")==="image"?"editorImageButtons":"editorTextButtons",k=this.getContentNode(),i=this.getCloneNode(),h=null,q=null,p=(f==="vertical")?r.get("parentNode"):null,c=p?p.layoutDesignerPlaces:null;i.setStyle("display","none");s.setStyle("display","none");l.setStyle("display","block");if(f==="vertical"){q=d.layoutDesignerPlaces.getMaxWidth();q+=c?c.getAvailablePlace():0;}else{q=d.layoutDesignerPlaces.getAvailablePlace();q+=this.getContentWidth();}h={panelNode:l,spinnerMaxWidth:q,activeButtons:this.get(e)};k.plug(j,h);b.on("bewype-editor:onClose",b.bind(this._detachEditor,this),k);b.on("bewype-editor:onChange",b.bind(this.refresh,this),k);this.editing=true;},_onClickEdit:function(c){var d=this.get("parentNode");b.each(d.layoutDesignerPlaces.getContents(),function(f,e){f.layoutDesignerContent._detachEditor();});this._attachEditor();},_onClickRemove:function(c){var d=this.get("host"),e=this.get("parentNode");e.layoutDesignerPlaces.removeContent(d);},_addCloneNode:function(){var f=this.get("host"),e=this.get("designerClass")+"-content",c=new b.Node.create('<div class="'+e+'-clone-callbacks" />'),d=null,i=null,g=null,h=null;d=f.cloneNode(false);d.set("innerHTML","");d.set("className",e+"-clone");f.append(d);d.setStyle("z-index",this.get("contentZIndex"));d.setStyle("position","absolute");d.setStyle("bottom",0);d.append(c);i=new b.Node.create('<div class="'+e+'-clone-drag" />');c.append(i);g=new b.Node.create('<div class="'+e+'-clone-edit" />');c.append(g);b.on("click",b.bind(this._onClickEdit,this),g);h=new b.Node.create('<div class="'+e+'-clone-remove" />');c.append(h);b.on("click",b.bind(this._onClickRemove,this),h);this._refreshCloneNode();},getContentHeight:function(){var f=this.getContentNode(),c=b.Bewype.Utils.getHeight(f),e=b.Bewype.Utils.getStyleValue(f,"paddingTop")||0,d=b.Bewype.Utils.getStyleValue(f,"paddingBottom")||0;return c+e+d;},getContentWidth:function(){var f=this.getContentNode(),e=b.Bewype.Utils.getWidth(f),d=b.Bewype.Utils.getStyleValue(f,"paddingRight")||0,c=b.Bewype.Utils.getStyleValue(f,"paddingLeft")||0;return e+c+d;},getContentNode:function(){var d=this.get("host"),c=this.get("designerClass")+"-content",e=this.get("contentType")==="image"?"img.":"div.";return d.one(e+c);},getCloneNode:function(){var d=this.get("host"),c=this.get("designerClass")+"-content",e="div."+c+"-clone";return d.one(e);},_refreshCloneNode:function(e){var d=this.getCloneNode(),f=this.getContentHeight(),c=e||this.getContentWidth();if(d){d.setStyle("height",f-2);d.setStyle("width",c-2);}},refresh:function(c){var e=this.get("parentNode"),d=c?this.getContentNode():null;if(d){d.setStyle("width",c);d.setStyle("paddingLeft",0);d.setStyle("paddingRight",0);}this._refreshCloneNode(c);e.layoutDesignerTarget.refresh();}});b.namespace("Bewype");b.Bewype.LayoutDesignerContent=a;},"@VERSION@",{requires:["async-queue","plugin","substitute","bewype-editor"]});