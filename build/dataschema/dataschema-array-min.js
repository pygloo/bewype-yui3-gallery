YUI.add("dataschema-array",function(C){var A=C.Lang,B={apply:function(F,G){var D=G,E={results:[],meta:{}};if(A.isArray(D)){if(A.isArray(F.resultFields)){E=B._parseResults.call(this,F.resultFields,D,E);}else{E.results=D;}}else{E.error=new Error("Array schema parse failure");}return E;},_parseResults:function(H,K,D){var G=[],O,N,I,J,M,L,F,E;for(F=K.length-1;F>-1;F--){O={};N=K[F];I=(A.isObject(N)&&!A.isFunction(N))?2:(A.isArray(N))?1:(A.isString(N))?0:-1;if(I>0){for(E=H.length-1;E>-1;E--){J=H[E];M=(!A.isUndefined(J.key))?J.key:J;L=(!A.isUndefined(N[M]))?N[M]:N[E];O[M]=C.DataSchema.Base.parse.call(this,L,J);}}else{if(I===0){O=N;}else{O=null;}}G[F]=O;}D.results=G;return D;}};C.DataSchema.Array=C.mix(B,C.DataSchema.Base);},"@VERSION@",{requires:["dataschema-base"]});