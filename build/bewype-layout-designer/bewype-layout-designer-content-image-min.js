YUI.add("bewype-layout-designer-content-image",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.C_TEMPLATE='<image class="{designerClass}-content ';A.C_TEMPLATE+='{designerClass}-content-{contentType}" ';A.C_TEMPLATE+='src="{defaultImg}" />';A.NAME="layout-designer-content-image";A.NS="layoutDesignerContent";B.extend(A,B.Bewype.LayoutDesignerContentBase,{_q:null,editing:false,initializer:function(C){this.setAttrs(C);var D=B.substitute(A.C_TEMPLATE,{defaultImg:this.get("defaultImg")});this._init(D);}});B.namespace("Bewype");B.Bewype.LayoutDesignerContentImage=A;},"@VERSION@",{requires:["bewype-editor","bewype-layout-designer-content-base"]});