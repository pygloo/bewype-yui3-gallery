YUI.add("bewype-layout-designer-base",function(A){var B=function(C){B.superclass.constructor.apply(this,arguments);};B.NODE_PAN_TEMPLATE='<div class="{designerClass}-edit-panel"></div>';B.NODE_LAYOUT_TEMPLATE='<div class="{designerClass}-layout {designerClass}-places"></div>';B.NAME="layout-designer";B.NS="layoutDesigner";A.extend(B,A.Bewype.LayoutDesignerConfig,{nodeLayout:null,initializer:function(C){this.setAttrs(C);var E=this.get("host"),F=null,D=this.get("designerClass"),G=this.get("layoutWidth");this.nodeLayout=E.one("div."+D+"-layout");if(!this.nodeLayout){this.nodeLayout=new A.Node.create(A.substitute(B.NODE_LAYOUT_TEMPLATE,{designerClass:D}));E.append(this.nodeLayout);this.nodeLayout.setStyle("width",G);}C.baseNode=E;C.targetType=this.get("startingTargetType");this.nodeLayout.plug(A.Bewype.LayoutDesignerTarget,C);this.nodeLayout.layoutDesignerTarget.refresh();F=new A.Node.create(A.substitute(B.NODE_PAN_TEMPLATE,{designerClass:D}));E.append(F);A.DD.DDM.on("drop:hit",A.bind(this._dropHitGotcha,this));},destructor:function(){var E=this.get("host"),D=this.get("designerClass"),C=E.one("."+D+"-edit-panel");this.nodeLayout.unplug(A.Bewype.LayoutDesignerTarget);C.remove();},_dropHitGotcha:function(L){var D=L.drag.get("node"),N=D.get("tagName").toLowerCase(),H="."+this.get("designerClass")+"-places",M="."+this.get("designerClass")+"-container",J=D.one(M),G=D.one(H)?J:D.one(M),E=null,F=N==="li"?"ul":"table",I=J?J.ancestor(F):null,K=I?I.ancestor("div"):null,C=null;if(!G||!K.layoutDesignerPlaces){return;}else{if(G.layoutDesignerContent){E=G.layoutDesignerContent.get("parentNode");}else{if(G.layoutDesignerPlaces){E=G.layoutDesignerPlaces.get("parentNode");}else{return;}}}if(E!=K){E.layoutDesignerPlaces.unRegisterContent(G);K.layoutDesignerPlaces.registerContent(G);G.layoutDesignerContent.set("parentNode",K);C=K.layoutDesignerPlaces.getMaxWidth();K.layoutDesignerTarget.refresh(C);}},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});A.namespace("Bewype");A.Bewype.LayoutDesigner=B;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});