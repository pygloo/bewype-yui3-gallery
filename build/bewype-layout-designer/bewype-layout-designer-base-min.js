YUI.add("bewype-layout-designer-base",function(a){var b=function(c){b.superclass.constructor.apply(this,arguments);};b.NODE_SRC_TEMPLATE='<div id="{idSource}"></div>';b.NODE_DST_TEMPLATE='<div id="{idDest}"></div>';b.NAME="layout-designer";b.NS="layoutDesigner";b.ATTRS={idSource:{value:"layout-source",writeOnce:true,validator:function(c){return a.Lang.isString(c);}},idDest:{value:"layout-dest",writeOnce:true,validator:function(c){return a.Lang.isString(c);}},targetOverHeight:{value:20,validator:function(c){return a.Lang.isNumber(c);}},targetMinHeight:{value:8,validator:function(c){return a.Lang.isNumber(c);}},targetOverWidth:{value:20,validator:function(c){return a.Lang.isNumber(c);}},targetMinWidth:{value:8,validator:function(c){return a.Lang.isNumber(c);}},targetZIndex:{value:1,validator:function(c){return a.Lang.isNumber(c);}},contentHeight:{value:40,validator:function(c){return a.Lang.isNumber(c);}},contentWidth:{value:120,validator:function(c){return a.Lang.isNumber(c);}},contentZIndex:{value:1,validator:function(c){return a.Lang.isNumber(c);}},contentClass:{value:"content",writeOnce:true,validator:function(c){return a.Lang.isString(c);}},defaultContent:{value:"Click to change your content..",validator:function(c){return a.Lang.isString(c);}},editCallback:{value:null},layoutWidth:{value:600,validator:function(c){return a.Lang.isNumber(c);}}};a.extend(b,a.Plugin.Base,{nodeLayout:null,initializer:function(c){_idSource=this.get("idSource");_idDest=this.get("idDest");var d=new a.Node.create(a.substitute(b.NODE_SRC_TEMPLATE,{idSource:_idSource}));this.get("host").append(d);d.plug(a.Bewype.LayoutDesignerSources,{layoutWidth:this.get("layoutWidth")});this.nodeLayout=new a.Node.create(a.substitute(b.NODE_DST_TEMPLATE,{idDest:_idDest}));this.get("host").append(this.nodeLayout);this._setLayoutWidth(this.get("layoutWidth"));this.nodeLayout.plug(a.Bewype.LayoutDesignerTarget,{targetOverHeight:this.get("targetOverHeight"),targetOverWidth:this.get("targetOverWidth"),targetMinHeight:this.get("targetMinHeight"),targetMinWidth:this.get("targetMinWidth"),targetType:"start",targetZIndex:this.get("targetZIndex"),contentHeight:this.get("contentHeight"),contentWidth:this.get("contentWidth"),contentZIndex:this.get("contentZIndex"),contentClass:this.get("contentClass"),defaultContent:this.get("defaultContent"),editCallback:this.get("editCallback"),idDest:_idDest});},destructor:function(){},_setLayoutWidth:function(c){this.nodeLayout.setStyle("width",c);}});a.namespace("Bewype");a.Bewype.LayoutDesigner=b;},"@VERSION@",{requires:["bewype-layout-designer-sources","bewype-layout-designer-target"]});