YUI.add("bewype-picker-base",function(C){var B="",D="",A=null;B+='<div id="{pickerId}"><table>';B+="</table></div>";D+="<tr>";D+="  <td>";D+='    <div id="{itemId}" class="{itemClass}" {style}>{text}</div>';D+="  </td>";D+="</tr>";A=function(E){A.superclass.constructor.apply(this,arguments);};A.NAME="picker";A.NS="picker";A.ATTRS={pickerClass:{value:"yui3-picker",writeOnce:true,validator:function(E){return C.Lang.isString(E);}}};C.extend(A,C.Widget,{_currentName:null,_init:function(E){this._currentName=null;this.publish("picker:onChange");},initializer:function(E){this._init(E);},_renderBaseUI:function(){var F=this.get("contentBox"),G=this.get("pickerClass"),E=null;E=new C.Node.create(C.substitute(B,{pickerId:G}));F.append(E);},renderUI:function(){this._renderBaseUI();},bindUI:function(){},syncUI:function(){},destructor:function(){var F=this.get("contentBox"),G=this.get("pickerClass"),E=null;E=F.one("#"+G);if(E){C.detach("yui3-picker-event|click");E.remove();}},_onItemClick:function(G,F){var E=F?F.target:null;if(E){this._currentName=G;this.fire("picker:onChange");}},getValue:function(){return this._currentName;},append:function(G,K,I){var J=this.get("contentBox"),H=this.get("pickerClass"),F=null,E=null;F=J.one("#"+H);if(F){E=new C.Node.create(C.substitute(D,{itemId:H+"-"+G,itemClass:H+"-row",text:K,style:I?'style="'+I+'"':""}));F.one("table").append(E);C.on("yui3-picker-event|click",C.bind(this._onItemClick,this,G),E);}},remove:function(G){var H=this.get("contentBox"),F="#"+this.get("pickerClass")+"-"+G,E=null;E=H.one(F);if(E){E.ancestor("tr").remove();if(this._currentName===G){this._currentName=null;}}}});C.augment(A,C.EventTarget);C.namespace("Bewype");C.Bewype.Picker=A;},"@VERSION@",{requires:["stylesheet","substitute","widget","yui-base"]});