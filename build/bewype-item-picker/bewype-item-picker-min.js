YUI.add("bewype-item-picker",function(C){var A="",D="",B=null;A+='<div id="{pickerId}"><table>';A+="</table></div>";D+="<tr>";D+="  <td>";D+='    <div id="{itemId}" class="{itemClass}" {style}>{text}</div>';D+="  </td>";D+="</tr>";B=function(E){B.superclass.constructor.apply(this,arguments);};B.NAME="itemPicker";B.NS="itemPicker";B.ATTRS={pickerClass:{value:"item-picker",writeOnce:true,validator:function(E){return C.Lang.isString(E);}}};C.extend(B,C.Widget,{_currentName:null,initializer:function(E){this._currentName=null;},renderUI:function(){var F=this.get("contentBox"),G=this.get("pickerClass"),E=null;E=new C.Node.create(C.substitute(A,{pickerId:G}));F.append(E);},bindUI:function(){},syncUI:function(){},destructor:function(){var F=this.get("contentBox"),G=this.get("pickerClass"),E=null;E=F.one("#"+G);if(E){C.detach("bewype-item-pickers|click");E.remove();}},_onItemClick:function(G,F){var E=F?F.target:null;if(E){this._currentName=G;}},getValue:function(){return this._currentName;},append:function(G,K,I){var J=this.get("contentBox"),H=this.get("pickerClass"),F=null,E=null;F=J.one("#"+H);if(F){E=new C.Node.create(C.substitute(D,{itemId:H+"-"+G,itemClass:H+"-row",text:K,style:I?('style="font-family: '+I+';"').toString():""}));F.one("table").append(E);C.on("bewype-item-picker|click",C.bind(this._onItemClick,this,G),E);}},remove:function(G){var H=this.get("contentBox"),F="#"+this.get("pickerClass")+"-"+G,E=null;E=H.one(F);if(E){E.ancestor("tr").remove();if(this._currentName===G){this._currentName=null;}}}});C.namespace("Bewype");C.Bewype.ItemPicker=B;},"@VERSION@",{requires:["bewype","console","dump","node","stylesheet","widget","yui-base"]});