YUI.add("bewype-picker-text-align",function(B){var A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="pickerTextAlign";A.ATTRS={pickerClass:{value:"bewype-picker-text-align",writeOnce:true,validator:function(C){return B.Lang.isString(C);}},alignProps:{value:["left","center","right"],writeOnce:true,validator:function(C){return B.Lang.isArray(C);}}};B.extend(A,B.Bewype.Picker,{initializer:function(C){this._init(C);},renderUI:function(){this._renderBaseUI();B.Object.each(this.get("alignProps"),function(E,D){var C="text-align: "+E+";",F=D==(this.get("alignProps").length-1);this.append(E,E,C,null,F);},this);}});B.namespace("Bewype");B.Bewype.PickerTextAlign=A;},"@VERSION@",{requires:["bewype-picker-base"]});