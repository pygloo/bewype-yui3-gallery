YUI.add("editor-para",function(F){var C=function(){C.superclass.constructor.apply(this,arguments);},B="host",D="body",A="nodeChange",E=D+" > p";F.extend(C,F.Base,{_fixFirstPara:function(){var G=this.get(B),I=G.getInstance(),H;I.one("body").setContent("<p>"+I.Selection.CURSOR+"</p>");H=new I.Selection();H.focusCursor(true,false);},_onNodeChange:function(M){var K=this.get(B),L=K.getInstance();switch(M.changedType){case"keydown":if(L.config.doc.childNodes.length<2){var G=L.config.doc.body.innerHTML;if(G&&G.length<5&&G.toLowerCase()=="<br>"){this._fixFirstPara();}}break;case"backspace-up":case"backspace-down":case"delete-up":if(!F.UA.ie){var N=L.all(E),I,J,H;J=L.one(D);if(N.item(0)){J=N.item(0);}I=J.one("br");if(I){I.removeAttribute("id");I.removeAttribute("class");}H=J.get("innerHTML");if(L.Selection.getText(J)===""&&!J.test("p")){this._fixFirstPara();}else{if(J.test("p")&&(H.length===0)||(H=="<span><br></span>")){M.changedEvent.frameEvent.halt();}}}break;}},_afterEditorReady:function(){var G=this.get(B),H=G.getInstance();if(H){H.Selection.filterBlocks();}},_afterContentChange:function(){var G=this.get(B),H=G.getInstance();if(H&&H.Selection){H.Selection.filterBlocks();}},_afterPaste:function(){var G=this.get(B),I=G.getInstance(),H=new I.Selection();F.later(50,G,function(){I.Selection.filterBlocks();});},initializer:function(){var G=this.get(B);G.on(A,F.bind(this._onNodeChange,this));G.after("ready",F.bind(this._afterEditorReady,this));G.after("contentChange",F.bind(this._afterContentChange,this));if(F.Env.webkit){G.after("dom:paste",F.bind(this._afterPaste,this));}}},{NAME:"editorPara",NS:"editorPara",ATTRS:{host:{value:false}}});F.namespace("Plugin");F.Plugin.EditorPara=C;},"@VERSION@",{skinnable:false,requires:["editor-base","selection"]});