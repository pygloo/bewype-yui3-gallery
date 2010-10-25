YUI.add("bewype-layout-designer-content",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="layout-designer-content";a.NS="layoutDesignerContent";a.ATTRS={contentHeight:{value:40,validator:function(c){return b.Lang.isNumber(c);}},contentWidth:{value:140,validator:function(c){return b.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return b.Lang.isNumber(c);}},contentClass:{value:"content",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},defaultContent:{value:"Click to change your content..",validator:function(c){return b.Lang.isString(c);}},defaultStyle:{value:null},parentNode:{value:null},removeCallback:{value:null},editCallback:{value:null}};b.extend(a,b.Plugin.Base,{_q:null,initializer:function(c){var d=this.get("host"),e=this.get("parentNode");d.setStyle("height",this.get("contentHeight"));d.setStyle("width",this.get("contentWidth"));d.set("innerHTML",this.get("defaultContent"));b.on("mouseenter",b.bind(this._onMouseEnter,this),d);e.layoutDesignerPlaces.registerContent(d);this._q=new b.AsyncQueue();},destructor:function(){var e=this.get("host"),g=this.get("parentNode"),d=this.get("contentClass"),c=e.ancestor("div"),f=c.one("div."+d+"-clone");g.layoutDesignerPlaces.unRegisterContent(e);b.detach(e);if(f){b.Event.purgeElement(f,true);f.remove();}e.remove();},_onClickEdit:function(c){var d=this.get("editCallback");if(d){d(this.get("host"));}},_onClickRemove:function(c){var d=this.get("removeCallback");if(d){d(this.get("host"));}},hideClone:function(d){if(!d){var f=this.get("host"),e=this.get("contentClass"),c=f.ancestor("div");d=c.one("div."+e+"-clone");}if(d){b.each(d.all("div"),function(h,g){h.setStyle("visibility","hidden");});d.setStyle("visibility","hidden");}},_addCloneNode:function(i){var e=this.get("host"),d=this.get("contentClass"),j=this.get("editCallback"),h=this.get("removeCallback"),c=new b.Node.create('<div class="'+d+'-clone-callbacks" />'),f=null,g=null;_cloneNode=e.cloneNode(false);_cloneNode.set("innerHTML","");_cloneNode.set("className",d+"-clone");i.append(_cloneNode);_cloneNode.setStyle("z-index",this.get("contentZIndex"));_cloneNode.setStyle("position","absolute");_cloneNode.setStyle("bottom",0);_cloneNode.append(c);if(j){f=new b.Node.create('<div class="'+d+'-clone-edit" />');c.append(f);b.on("click",b.bind(this._onClickEdit,this),f);}if(h){g=new b.Node.create('<div class="'+d+'-clone-remove" />');c.append(g);b.on("click",b.bind(this._onClickRemove,this),g);}return _cloneNode;},_onMouseEnter:function(d){var f=this.get("host"),h=this.get("parentNode"),e=this.get("contentClass"),c=f.ancestor("div"),g=c.one("div."+e+"-clone");h.layoutDesignerPlaces.cleanContentOver();if(g){b.each(g.all("div"),function(j,i){j.setStyle("visibility","visible");});g.setStyle("visibility","visible");}else{g=this._addCloneNode(c);}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[g]});this._q.run();},_getHeight:function(d,c){c=c?c:0;return parseInt(d.getComputedStyle("height")||d.getAttribute("height"),c);},_getWidth:function(d,c){c=c?c:0;return parseInt(d.getComputedStyle("width")||d.getAttribute("width"),c);},getContentHeight:function(){var c=this.get("host");return this._getHeight(c);},getContentWidth:function(){var c=this.get("host");return this._getWidth(c);}});b.namespace("Bewype");b.Bewype.LayoutDesignerContent=a;},"@VERSION@",{requires:["async-queue","plugin","substitute"]});