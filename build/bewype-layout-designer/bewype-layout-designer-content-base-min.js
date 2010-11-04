YUI.add("bewype-layout-designer-content-base",function(A){var B=function(C){B.superclass.constructor.apply(this,arguments);};B.NAME="layout-designer-content";B.NS="layoutDesignerContent";A.extend(B,A.Bewype.LayoutDesignerConfig,{_q:null,editing:false,_init:function(D){var C=this.get("host"),F=this.get("parentNode"),E=null;E=new A.Node.create(A.substitute(D,{designerClass:this.get("designerClass"),contentType:this.get("contentType")}));C.append(E);E.setStyle("height",this.get("contentHeight"));E.setStyle("width",this.get("contentWidth"));A.on("mouseenter",A.bind(this._onMouseEnter,this),C);F.layoutDesignerPlaces.registerContent(C);this._q=new A.AsyncQueue();return E;},initializer:function(C){this.setAttrs(C);},destructor:function(){var E=this.get("host"),H=this.get("parentNode"),D=this.get("designerClass")+"-content",F=this.get("contentType")==="image"?"img.":"div.",G=E.one(F+D),C=E.one("div."+D+"-clone");this._detachEditor();H.layoutDesignerPlaces.unRegisterContent(E);A.detach(E);G.remove();if(C){A.Event.purgeElement(C,true);C.remove();}E.remove();},_detachEditor:function(){var F=this.get("host"),E=this.get("baseNode"),H=this.get("designerClass")+"-sources",D=this.get("designerClass")+"-edit-panel",G=E.one("div."+H),C=E.one("div."+D);if(C.bewypeEditorPanel){C.unplug(A.Bewype.EditorPanel);F.detachAll("bewype-editor:onClose");F.detachAll("bewype-editor:onChange");this.refresh();}this.editing=false;C.setStyle("display","none");G.setStyle("display","block");this._refreshCloneNode();return true;},_attachEditor:function(){var O=this.get("host"),F=this.get("baseNode"),C=this.get("parentNode"),N=this.get("designerClass")+"-sources",L=this.get("designerClass")+"-edit-panel",E=this.get("designerClass")+"-content",Q=F.one("div."+N),J=F.one("div."+L),K=C.layoutDesignerPlaces.getAvailablePlace(),H=this.get("contentType")==="image"?"img.":"div.",M=this.get("contentType")==="image"?A.Bewype.EditorTag:A.Bewype.EditorText,D=this.get("contentType")==="image"?"editorImageButtons":"editorTextButtons",I=O.one(H+E),G=null,P=null;Q.setStyle("display","none");J.setStyle("display","block");P=K?K:0;P+=this.getContentWidth();G={panelNode:J,spinnerMaxWidth:P,activeButtons:this.get(D)};I.plug(M,G);A.on("bewype-editor:onClose",A.bind(this._detachEditor,this),I);A.on("bewype-editor:onChange",A.bind(this.refresh,this),I);this.editing=true;},_onClickEdit:function(C){var D=this.get("parentNode");A.each(D.layoutDesignerPlaces.getContents(),function(F,E){F.layoutDesignerContent._detachEditor();});this._attachEditor();},_onClickRemove:function(C){var D=this.get("host"),E=this.get("parentNode");E.layoutDesignerPlaces.removeContent(D);},hideClone:function(C){if(!C){var E=this.get("host"),D=this.get("designerClass")+"-content";C=E.one("div."+D+"-clone");}if(C){A.each(C.all("div"),function(G,F){G.setStyle("visibility","hidden");});C.setStyle("visibility","hidden");}},_addCloneNode:function(){var F=this.get("host"),E=this.get("designerClass")+"-content",C=new A.Node.create('<div class="'+E+'-clone-callbacks" />'),D=null,G=null,H=null;D=F.cloneNode(false);D.set("innerHTML","");D.set("className",E+"-clone");F.append(D);D.setStyle("z-index",this.get("contentZIndex"));D.setStyle("position","absolute");D.setStyle("bottom",0);D.append(C);G=new A.Node.create('<div class="'+E+'-clone-edit" />');C.append(G);A.on("click",A.bind(this._onClickEdit,this),G);H=new A.Node.create('<div class="'+E+'-clone-remove" />');C.append(H);A.on("click",A.bind(this._onClickRemove,this),H);this._refreshCloneNode();return D;},_onMouseEnter:function(C){if(this.editing){return;}var F=this.get("host"),G=this.get("parentNode"),E=this.get("designerClass")+"-content",D=F.one("div."+E+"-clone");G.layoutDesignerPlaces.cleanContentOver();if(D){A.each(D.all("div"),function(I,H){I.setStyle("visibility","visible");});D.setStyle("visibility","visible");}else{D=this._addCloneNode();}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[D]});this._q.run();},getContentHeight:function(){var E=this.get("host"),D=this.get("designerClass")+"-content",G=this.get("contentType")==="image"?"img.":"div.",I=E.one(G+D),C=A.Bewype.Utils.getHeight(I),H=A.Bewype.Utils.getStyleValue(I,"paddingTop")||0,F=A.Bewype.Utils.getStyleValue(I,"paddingBottom")||0;return C+H+F;},getContentWidth:function(){var F=this.get("host"),E=this.get("designerClass")+"-content",H=this.get("contentType")==="image"?"img.":"div.",I=F.one(H+E),G=A.Bewype.Utils.getWidth(I),D=A.Bewype.Utils.getStyleValue(I,"paddingRight")||0,C=A.Bewype.Utils.getStyleValue(I,"paddingLeft")||0;return G+C+D;},_refreshCloneNode:function(){var F=this.get("host"),E=this.get("designerClass")+"-content",D=F.one("div."+E+"-clone"),G=this.getContentHeight(),C=this.getContentWidth();if(D){D.setStyle("height",G);D.setStyle("width",C);}},refresh:function(){this._refreshCloneNode();var C=this.get("parentNode");C.layoutDesignerTarget.refresh();}});A.namespace("Bewype");A.Bewype.LayoutDesignerContentBase=B;},"@VERSION@",{requires:["async-queue","plugin","substitute"]});