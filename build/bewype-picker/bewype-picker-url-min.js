YUI.add("bewype-picker-url",function(C){var B="",A=function(D){A.superclass.constructor.apply(this,arguments);};B+='<div class="{pickerClass}"><table>';B+="  <tr>";B+="    <td>";B+='      <div class="{pickerClass}-label">Url</div>';B+="    </td>";B+="    <td>";B+='      <input class="{pickerClass}-input" type="text">';B+="    </td>";B+="  </tr>";B+="</table></div>";A.NAME="pickerUrl";A.ATTRS={pickerClass:{value:"yui3-picker-url",writeOnce:true,validator:function(D){return C.Lang.isString(D);}}};C.extend(A,C.Widget,{_url:null,initializer:function(D){this.publish("picker:onChange");},renderUI:function(){var G=this.get("contentBox"),E=this.get("pickerClass"),D=null,F=null;D=new C.Node.create(C.substitute(B,{pickerClass:E}));G.append(D);F=G.one("."+E+"-input");C.on("yui3-picker-event|blur",C.bind(this._onInputChange,this),F);},bindUI:function(){},syncUI:function(){},destructor:function(){var E=this.get("contentBox"),D=E.one("."+this.get("pickerClass"));if(D){C.detach("yui3-picker-event|blur");D.remove();}},getValue:function(){return this._url;},_onInputChange:function(D){var F=D?D.target:null,E=this.get("pickerClass");if(F){this._url=F.get("value");this.fire("picker:onChange");}}});C.augment(A,C.EventTarget);C.namespace("Bewype");C.Bewype.PickerUrl=A;},"@VERSION@",{requires:["stylesheet","substitute","widget","yui-base"]});