YUI.add("bewype-picker-file",function(c){var a="",b=function(d){b.superclass.constructor.apply(this,arguments);};a+='<div class="{pickerClass}"><table>';a+="  <tr>";a+="    <td>";a+='      <div class="{pickerClass}-label">File</div>';a+="    </td>";a+="    <td>";a+="      <form>";a+='        <input class="{pickerClass}-input" type="file" />';a+="      </form>";a+="    </td>";a+="  </tr>";a+="</table></div>";b.NAME="pickerFile";b.ATTRS={pickerClass:{value:"bewype-picker-file",writeOnce:true,validator:function(d){return c.Lang.isString(d);}},uploadUrl:{value:null,writeOnce:true}};c.extend(b,c.Widget,{_fileName:null,initializer:function(d){this.publish("picker:onChange");},renderUI:function(){var g=this.get("contentBox"),e=this.get("pickerClass"),d=null,f=null;d=new c.Node.create(c.substitute(a,{pickerClass:e}));g.append(d);f=g.one("."+e+"-input");if(this._fileName){f.set("value",this._fileName);}f.on("yui3-picker-event|change",c.bind(this._onInputChange,this));},bindUI:function(){},syncUI:function(){},destructor:function(){var e=this.get("contentBox"),d=e.one("."+this.get("pickerClass"));if(d){c.detach("yui3-picker-event|change");d.remove();}},getValue:function(){return this._fileName;},setValue:function(d){this._fileName=d;},_doUpload:function(){var i=this.get("contentBox"),e=i.one("form"),d=null,h=null,f=null,g=null;var d=function(j,k){this._fileName=null;};var h=function(j,k){};c.on("io:success",d);c.on("io:failure",h);f={method:"POST",form:{id:e},headers:{"Content-Type":"multipart/form-data"}};g=c.io(this.get("uploadUrl"),f);},_onInputChange:function(e){var g=e?e.target:null,f=this.get("contentBox"),d=f.one("form");if(g){this._fileName=g.get("value");this._doUpload();this.fire("picker:onChange");}}});c.augment(b,c.EventTarget);c.namespace("Bewype");c.Bewype.PickerFile=b;},"@VERSION@",{requires:["io","stylesheet","substitute","widget","yui-base"]});