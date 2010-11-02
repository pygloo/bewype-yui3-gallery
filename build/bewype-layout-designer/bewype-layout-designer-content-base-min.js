YUI.add("bewype-layout-designer-content-base",function(A){var B=function(C){B.superclass.constructor.apply(this,arguments);};B.C_TEMPLATE='<div class="{designerClass}-content {designerClass}-content-{contentType}"></div>';B.NAME="layout-designer-content";B.NS="layoutDesignerContent";B.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(C){return A.Lang.isString(C);}},contentType:{value:"base",writeOnce:true,validator:function(C){return A.Lang.isString(C);}},contentHeight:{value:40,validator:function(C){return A.Lang.isNumber(C);}},contentWidth:{value:40,validator:function(C){return A.Lang.isNumber(C);}},contentZIndex:{value:1,validator:function(C){return A.Lang.isNumber(C);}},baseNode:{value:null,writeOnce:true},parentNode:{value:null}};A.extend(B,A.Plugin.Base,{_q:null,editing:false,_init:function(C){var D=C.host,F=C.parentNode,E=null;E=new A.Node.create(A.substitute(B.C_TEMPLATE,{designerClass:C.designerClass,contentType:C.contentType}));D.append(E);E.setStyle("height",C.contentHeight);E.setStyle("width",C.contentWidth);A.on("mouseenter",A.bind(this._onMouseEnter,this),D);F.layoutDesignerPlaces.registerContent(D);this._q=new A.AsyncQueue();return E;},initializer:function(C){},destructor:function(){var E=this.get("host"),G=this.get("parentNode"),D=this.get("designerClass")+"-content",F=E.one("div."+D),C=E.one("div."+D+"-clone");this._detachEditor();G.layoutDesignerPlaces.unRegisterContent(E);A.detach(E);F.remove();if(C){A.Event.purgeElement(C,true);C.remove();}E.remove();},_detachEditor:function(){},_attachEditor:function(){},_onClickEdit:function(C){var D=this.get("parentNode");A.each(D.layoutDesignerPlaces.getContents(),function(F,E){F.layoutDesignerContent._detachEditor();});this._attachEditor();},_onClickRemove:function(C){var D=this.get("host"),E=this.get("parentNode");E.layoutDesignerPlaces.removeContent(D);},hideClone:function(C){if(!C){var E=this.get("host"),D=this.get("designerClass")+"-content";C=E.one("div."+D+"-clone");}if(C){A.each(C.all("div"),function(G,F){G.setStyle("visibility","hidden");});C.setStyle("visibility","hidden");}},_addCloneNode:function(){var F=this.get("host"),E=this.get("designerClass")+"-content",C=new A.Node.create('<div class="'+E+'-clone-callbacks" />'),D=null,G=null,H=null;D=F.cloneNode(false);D.set("innerHTML","");D.set("className",E+"-clone");F.append(D);D.setStyle("z-index",this.get("contentZIndex"));D.setStyle("position","absolute");D.setStyle("bottom",0);D.append(C);G=new A.Node.create('<div class="'+E+'-clone-edit" />');C.append(G);A.on("click",A.bind(this._onClickEdit,this),G);H=new A.Node.create('<div class="'+E+'-clone-remove" />');C.append(H);A.on("click",A.bind(this._onClickRemove,this),H);this._refreshCloneNode();return D;},_onMouseEnter:function(C){if(this.editing){return;}var E=this.get("host"),G=this.get("parentNode"),D=this.get("designerClass")+"-content",F=E.one("div."+D+"-clone");G.layoutDesignerPlaces.cleanContentOver();if(F){A.each(F.all("div"),function(I,H){I.setStyle("visibility","visible");});F.setStyle("visibility","visible");}else{F=this._addCloneNode();}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[F]});this._q.run();},getContentHeight:function(){var E=this.get("host"),D=this.get("designerClass")+"-content",G=E.one("div."+D),C=A.Bewype.Utils.getHeight(G),F=A.Bewype.Utils.getStyleValue(G,"paddingTop")||0;return C+F;},getContentWidth:function(){var E=this.get("host"),D=this.get("designerClass")+"-content",G=E.one("div."+D),F=A.Bewype.Utils.getWidth(G),C=A.Bewype.Utils.getStyleValue(G,"paddingLeft")||0;return F+C;},_refreshCloneNode:function(){var F=this.get("host"),E=this.get("designerClass")+"-content",D=F.one("div."+E+"-clone"),G=this.getContentHeight(),C=this.getContentWidth();if(D){D.setStyle("height",G);D.setStyle("width",C);}},refresh:function(){this._refreshCloneNode();var C=this.get("parentNode");C.layoutDesignerTarget.refresh();}});A.namespace("Bewype");A.Bewype.LayoutDesignerContentBase=B;},"@VERSION@",{requires:["async-queue","plugin","substitute"]});