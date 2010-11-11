YUI.add("bewype-layout-designer-content-base",function(A){var B=function(C){B.superclass.constructor.apply(this,arguments);};B.NAME="layout-designer-content";B.NS="layoutDesignerContent";A.extend(B,A.Bewype.LayoutDesignerConfig,{_q:null,editing:false,_init:function(D){var C=this.get("host"),F=this.get("parentNode"),E=null;A.on("mouseenter",A.bind(this._onMouseEnter,this),C);F.layoutDesignerPlaces.registerContent(C);this._q=new A.AsyncQueue();return E;},initializer:function(C){this.setAttrs(C);},destructor:function(){var E=this.get("host"),F=this.get("parentNode"),D=this.get("designerClass")+"-content",C=this.getCloneNode();if(this.editing===true){this._detachEditor();}F.layoutDesignerPlaces.unRegisterContent(E);E.detachAll("mouseenter");if(C){C.one("."+D+"-clone-edit").detachAll("click");C.one("."+D+"-clone-remove").detachAll("click");C.remove();}},_attachEditor:function(){var M=this.get("host"),G=this.get("baseNode"),D=this.get("parentNode"),L=this.get("designerClass")+"-sources",K=this.get("designerClass")+"-edit-panel",Q=G.one("div."+L),J=G.one("div."+K),P=D.layoutDesignerPlaces,F=P.get("placesType"),I=this.get("contentType")==="image"?A.Bewype.EditorTag:A.Bewype.EditorText,E=this.get("contentType")==="image"?"editorImageButtons":"editorTextButtons",H=null,O=null,N=(F==="vertical")?P.get("parentNode"):null,C=N?N.layoutDesignerPlaces:null;Q.setStyle("display","none");J.setStyle("display","block");if(F==="vertical"){O=D.layoutDesignerPlaces.getMaxWidth();O+=C?C.getAvailablePlace():0;}else{O=D.layoutDesignerPlaces.getAvailablePlace();O+=this.getContentWidth();}H={panelNode:J,spinnerMaxWidth:O,activeButtons:this.get(E)};M.plug(I,H);A.on("bewype-editor:onClose",A.bind(this._detachEditor,this),M);A.on("bewype-editor:onChange",A.bind(this.refresh,this),M);this.editing=true;},_detachEditor:function(){var F=this.get("host"),E=this.get("baseNode"),I=this.get("designerClass")+"-sources",D=this.get("designerClass")+"-edit-panel",H=E.one("div."+I),C=E.one("div."+D),G=this.get("contentType")==="image"?A.Bewype.EditorTag:A.Bewype.EditorText;this.editing=false;if(C&&C.bewypeEditorPanel){C.unplug(A.Bewype.EditorPanel);F.unplug(G);F.detachAll("bewype-editor:onClose");F.detachAll("bewype-editor:onChange");this.refresh();}if(C){C.setStyle("display","none");}if(H){H.setStyle("display","block");}this._refreshCloneNode();return true;},_onClickEdit:function(C){var D=this.get("parentNode");A.each(D.layoutDesignerPlaces.getContents(),function(F,E){F.layoutDesignerContent._detachEditor();});this._attachEditor();},_onClickRemove:function(C){var D=this.get("host"),E=this.get("parentNode");E.layoutDesignerPlaces.removeContent(D);},hideClone:function(C){C=C||this.getCloneNode();if(C){A.each(C.all("div"),function(E,D){E.setStyle("visibility","hidden");});C.setStyle("visibility","hidden");}},_addCloneNode:function(){var F=this.get("host"),H=F.ancestor("li"),E=this.get("designerClass")+"-content",C=new A.Node.create('<div class="'+E+'-clone-callbacks" />'),D=null,G=null,I=null;D=F.cloneNode(false);D.set("innerHTML","");D.set("className",E+"-clone");H.append(D);D.setStyle("z-index",this.get("contentZIndex"));D.setStyle("position","absolute");D.setStyle("bottom",0);D.append(C);G=new A.Node.create('<div class="'+E+'-clone-edit" />');C.append(G);A.on("click",A.bind(this._onClickEdit,this),G);I=new A.Node.create('<div class="'+E+'-clone-remove" />');C.append(I);A.on("click",A.bind(this._onClickRemove,this),I);this._refreshCloneNode();return D;},_onMouseEnter:function(C){if(this.editing){return;}var F=this.get("host"),G=this.get("parentNode"),E=this.get("designerClass")+"-content",D=F.one("div."+E+"-clone");G.layoutDesignerPlaces.cleanContentOver();if(D){A.each(D.all("div"),function(I,H){I.setStyle("visibility","visible");});D.setStyle("visibility","visible");}else{D=this._addCloneNode();}this._q.stop();this._q.add({fn:function(){},timeout:1000},{fn:this.hideClone,args:[D]});this._q.run();},getContentHeight:function(){var D=this.get("host"),C=A.Bewype.Utils.getHeight(D),F=A.Bewype.Utils.getStyleValue(D,"paddingTop")||0,E=A.Bewype.Utils.getStyleValue(D,"paddingBottom")||0;return C+F+E;},getContentWidth:function(){var E=this.get("host"),F=A.Bewype.Utils.getWidth(E),D=A.Bewype.Utils.getStyleValue(E,"paddingRight")||0,C=A.Bewype.Utils.getStyleValue(E,"paddingLeft")||0;return F+C+D;},getCloneNode:function(){var D=this.get("host"),E=D.ancestor("li"),C=this.get("designerClass")+"-content";return E.one("div."+C+"-clone");},_refreshCloneNode:function(E){var D=this.getCloneNode(),F=this.getContentHeight(),C=E||this.getContentWidth();if(D){D.setStyle("height",F);D.setStyle("width",C);}},refresh:function(D){var E=this.get("parentNode"),C=this.get("host");if(D){C.setStyle("width",D);C.setStyle("paddingLeft",0);C.setStyle("paddingRight",0);}this._refreshCloneNode(D);E.layoutDesignerPlaces.refresh();}});A.namespace("Bewype");A.Bewype.LayoutDesignerContentBase=B;},"@VERSION@",{requires:["async-queue","plugin","substitute"]});