YUI.add("bewype-picker-font-size",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.NAME="pickerFontSize";a.ATTRS={pickerClass:{value:"bewype-picker-font-size",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},fontSizes:{value:["8","10","12","16","20","24","32","40"],writeOnce:true,validator:function(c){return b.Lang.isArray(c);}}};b.extend(a,b.Bewype.Picker,{initializer:function(c){this._init(c);},renderUI:function(){this._renderBaseUI();b.Object.each(this.get("fontSizes"),function(e,d){var c="font-size: "+e+"px;";this.append(e,e,c);},this);},getValue:function(){return this._currentName?this._currentName+"px":null;},setValue:function(c){this._currentName=c?c.replace(/px/i,""):null;}});b.namespace("Bewype");b.Bewype.PickerFontSize=a;},"@VERSION@",{requires:["bewype-picker-base"]});