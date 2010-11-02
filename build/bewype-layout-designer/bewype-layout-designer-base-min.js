YUI.add("bewype-layout-designer-base",function(A){var B=function(C){B.superclass.constructor.apply(this,arguments);};B.NODE_SRC_TEMPLATE='<div class="{designerClass}-sources"></div>';B.NODE_PAN_TEMPLATE='<div class="{designerClass}-edit-panel"></div>';B.NODE_DST_TEMPLATE='<div class="{designerClass}-base"></div>';B.NAME="layout-designer";B.NS="layoutDesigner";B.ATTRS={designerClass:{value:"layout-designer",writeOnce:true,validator:function(C){return A.Lang.isString(C);}},targetOverHeight:{value:20,validator:function(C){return A.Lang.isNumber(C);}},targetMinHeight:{value:8,validator:function(C){return A.Lang.isNumber(C);}},targetOverWidth:{value:20,validator:function(C){return A.Lang.isNumber(C);}},targetMinWidth:{value:8,validator:function(C){return A.Lang.isNumber(C);}},targetZIndex:{value:1,validator:function(C){return A.Lang.isNumber(C);}},contentHeight:{value:40,validator:function(C){return A.Lang.isNumber(C);}},contentWidth:{value:120,validator:function(C){return A.Lang.isNumber(C);}},contentZIndex:{value:1,validator:function(C){return A.Lang.isNumber(C);}},defaultContent:{value:"Text..",validator:function(C){return A.Lang.isString(C);}},layoutWidth:{value:600,validator:function(C){return A.Lang.isNumber(C);}}};A.extend(B,A.Plugin.Base,{nodeLayout:null,initializer:function(C){var D=this.get("host"),F=null,E=null;F=new A.Node.create(A.substitute(B.NODE_SRC_TEMPLATE,{designerClass:this.get("designerClass")}));D.append(F);F.plug(A.Bewype.LayoutDesignerSources,{layoutWidth:this.get("layoutWidth")});E=new A.Node.create(A.substitute(B.NODE_PAN_TEMPLATE,{designerClass:this.get("designerClass")}));D.append(E);this.nodeLayout=new A.Node.create(A.substitute(B.NODE_DST_TEMPLATE,{designerClass:this.get("designerClass")}));D.append(this.nodeLayout);this.nodeLayout.setStyle("width",this.get("layoutWidth"));this.nodeLayout.plug(A.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinHeight:this.get("targetMinHeight"),targetMinWidth:this.get("targetMinWidth"),targetType:"start",targetZIndex:this.get("targetZIndex"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),defaultContent:this.get("defaultContent"),designerClass:this.get("designerClass"),baseNode:D});},destructor:function(){},getContents:function(){if(this.nodeLayout.layoutDesignerPlaces){return this.nodeLayout.layoutDesignerPlaces.getContents();}else{return[];}}});A.namespace("Bewype");A.Bewype.LayoutDesigner=B;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});