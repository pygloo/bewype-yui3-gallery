YUI.add("bewype-layout-designer-content-image",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.C_TEMPLATE='<image class="{designerClass}-content ';A.C_TEMPLATE+='{designerClass}-content-{contentType}" ';A.C_TEMPLATE+='src="{defaultImgSrc}" />';A.NAME="layout-designer-content-image";A.NS="layoutDesignerContent";A.ATTRS={contentType:{value:"image",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},defaultImgSrc:{value:"http://www.google.fr/images/logo.png",writeOnce:true,validator:function(C){return B.Lang.isString(C);}}};B.extend(A,B.Bewype.LayoutDesignerContentBase,{_q:null,editing:false,initializer:function(C){var D=B.substitute(A.C_TEMPLATE,{defaultImgSrc:this.get("defaultImgSrc")});this._init(C,D);}});B.namespace("Bewype");B.Bewype.LayoutDesignerContentImage=A;},"@VERSION@",{requires:["bewype-editor","bewype-layout-designer-content-base"]});