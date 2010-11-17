YUI.add("bewype-layout-designer-target",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="layout-designer-target";A.NS="layoutDesignerTarget";B.extend(A,B.Bewype.LayoutDesignerConfig,{_targetNode:null,initializer:function(E){this.setAttrs(E);var G=this.get("host"),D=this.get("targetType"),F=this.get("designerClass"),C=F+"-target",I=G.get("children"),H=I?I.item(0):null,J=null;if(D!=="start"||H){E.targetType=null;if(H){if(H.hasClass(F+"-places-vertical")){E.placesType="vertical";}else{E.placesType="horizontal";}}else{E.placesType=D;}this.set("targetType",E.placesType);D=E.placesType;G.plug(B.Bewype.LayoutDesignerPlaces,E);}this._targetNode=new B.Node.create('<div class="'+C+" "+C+"-"+D+'" />');G.append(this._targetNode);J=new B.Node.create('<div class="'+C+" "+C+'-inner" />');this._targetNode.append(J);B.Object.each(this._getTargetActions(),function(L,K){this._addTargetAction(J,L);},this);},destructor:function(){var C=this.get("host");B.Object.each(this._getTargetActions(),function(E,D){this._removeTargetAction(E);},this);this._targetNode.remove();if(C.layoutDesignerPlaces){C.unplug(B.Bewype.LayoutDesignerPlaces);}},_addPlaces:function(E){var I=this.get("host"),K=this.get("parentNode"),C=this.get("targetType"),G=E==="column"?"vertical":"horizontal",J=null,H=this.getAttrs(),F=I.layoutDesignerPlaces,D=F?F.getMaxWidth():B.Bewype.Utils.getWidth(I);if(C==="start"){I.unplug(B.Bewype.LayoutDesignerTarget);I.unplug(B.Bewype.LayoutDesignerPlaces);}else{if(!F){return;}}J=C==="start"?I:F.addDestNode();H.targetType=G;H.parentNode=C==="start"?null:I;J.plug(B.Bewype.LayoutDesignerTarget,H);if(F){F.registerContent(J);}this.refresh(D);},_onClickRemove:function(){var D=this.get("host"),F=this.get("parentNode"),C=D.layoutDesignerPlaces.get("placesType"),E=null;D.unplug(B.Bewype.LayoutDesignerTarget);D.one("table").remove();if(F){F.layoutDesignerPlaces.unRegisterContent(D);D.remove(true);F.layoutDesignerTarget.refresh();}else{E=this.getAttrs();E.targetType="start";D.plug(B.Bewype.LayoutDesignerTarget,E);}},_onClickAction:function(E,C){switch(E){case"column":case"row":return this._addPlaces(E);case"text":case"image":var D=this.get("host"),F=D.layoutDesignerPlaces.getMaxWidth();D.layoutDesignerPlaces.addContent(E);return this.refresh(F);case"remove":return this._onClickRemove();default:break;}},_getTargetActions:function(){switch(this.get("targetType")){case"start":return this.get("targetStartActions");case"horizontal":return this.get("targetHorizontalActions");case"vertical":return this.get("targetVerticalActions");default:break;}},_addTargetAction:function(E,F){var D=this.get("designerClass")+"-target-action",C=E.one("div."+D+"-"+F);if(C){C.setStyle("display","block");}else{C=new B.Node.create('<div class="'+D+" "+D+"-"+F+'" />');E.append(C);B.on("click",B.bind(this._onClickAction,this,F),C);}},_removeTargetAction:function(E){var D=this.get("designerClass")+"-target-action",C=this.get("host").one("div."+D+"-"+E);if(C){C.detachAll("click");C.remove();}},refresh:function(D){var C=this.get("host"),E=this.get("parentNode")||C;if(C.layoutDesignerPlaces){C.layoutDesignerPlaces.refresh(D);}else{return;}if(E.layoutDesignerTarget&&E!=C&&!D){E.layoutDesignerTarget.refresh();}}});B.namespace("Bewype");B.Bewype.LayoutDesignerTarget=A;},"@VERSION@",{requires:["bewype-layout-designer-places"]});