YUI.add("bewype-picker-text-align",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="pickerTextAlign";a.ATTRS={pickerClass:{value:"bewype-picker-text-align",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},alignProps:{value:["left","center","right"],writeOnce:true,validator:function(c){return b.Lang.isArray(c);}}};b.extend(a,b.Bewype.Picker,{initializer:function(c){this._init(c);},renderUI:function(){this._renderBaseUI();b.Object.each(this.get("alignProps"),function(e,d){var c="text-align: "+e+";",f=d==(this.get("alignProps").length-1);this.append(e,e,c,null,f);},this);}});b.namespace("Bewype");b.Bewype.PickerTextAlign=a;},"@VERSION@",{requires:["bewype-picker-base"]});