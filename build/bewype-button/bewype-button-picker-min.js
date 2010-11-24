YUI.add("bewype-button-picker",function(b){var a=function(c){a.superclass.constructor.apply(this,arguments);};a.PICKER_TMPL='<div class="{buttonClass}-host ';a.PICKER_TMPL+='{buttonClass}-host-{pickerPosition}">';a.PICKER_TMPL+="</div>";a.NAME="buttonPicker";a.NS="buttonPicker";a.ATTRS={buttonClass:{value:"bewype-button-picker",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},label:{value:null,writeOnce:true,validator:function(c){return b.Lang.isString(c);}},imageUrl:{value:null,writeOnce:true,validator:function(c){return b.Lang.isString(c);}},pickerObj:{value:null,writeOnce:true},pickerParams:{value:{},writeOnce:true},pickerPosition:{value:"left",writeOnce:true,validator:function(c){return b.Lang.isString(c);}},zIndex:{value:4,writeOnce:true,validator:function(c){return b.Lang.isNumber(c);}}};b.extend(a,b.Bewype.Button,{_picker:null,_previous:null,_value:null,initializer:function(c){this._init(c);this._picker=null;this._previous=null;this._value=null;},destructor:function(){this.hidePicker();this._destroyBase();},renderUI:function(){this._renderBaseUI();b.after("yui3-button-event|click",b.bind(this.hidePicker,this));},hidePicker:function(e){if(this._picker){var h=this.get("contentBox"),g=this.get("buttonClass"),f=this._picker.get("pickerClass"),d=this.get("pickerPosition"),c=h.one("."+g+"-host-"+d);if(e&&e.target.ancestor("."+f)){}else{this._picker.destroy();c.remove();delete (this._picker);}}if(e){e.stopPropagation();}},showPicker:function(){var g=this.get("contentBox"),e=this.get("buttonClass"),f=this.get("pickerObj"),h=this.get("pickerParams"),d=this.get("pickerPosition"),c=null;if(g&&f){c=new b.Node.create(b.substitute(a.PICKER_TMPL,{buttonClass:e,pickerPosition:d}));g.append(c);this._picker=new f(h);this._picker.setValue(this._value);this._picker.render(c);this._picker.on("picker:onChange",b.bind(this._onPickerChange,this));}},_onClick:function(c){var e=this.get("contentBox"),d=this.get("pickerObj");if(e&&d){this.fire("button:onClick");if(this._picker){this.hidePicker();}else{this.showPicker();}}c.stopPropagation();},_onPickerChange:function(d){var c=this._picker?this._picker.getValue():null;if(c){this.setValue(c);this.hidePicker();this.fire("button:onChange");}},getPrevious:function(){return this._previous;},getValue:function(){return this._value;},setValue:function(c){this._previous=this._value;this._value=c;}});b.namespace("Bewype");b.Bewype.ButtonPicker=a;},"@VERSION@",{requires:["bewype-button-base","bewype-picker"]});