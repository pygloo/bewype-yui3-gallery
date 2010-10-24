YUI.add("bewype-color",function(D){var B="0",A=D.Lang,C=null;C={real2dec:function(E){return Math.min(255,Math.round(E*256));},hsv2rgb:function(I,P,N){if(A.isArray(I)){return this.hsv2rgb.call(this,I[0],I[1],I[2]);}var E,J,M,H=Math.floor((I/60)%6),K=(I/60)-H,G=N*(1-P),F=N*(1-K*P),O=N*(1-(1-K)*P),L;switch(H){case 0:E=N;J=O;M=G;break;case 1:E=F;J=N;M=G;break;case 2:E=G;J=N;M=O;break;case 3:E=G;J=F;M=N;break;case 4:E=O;J=G;M=N;break;case 5:E=N;J=G;M=F;break;}L=this.real2dec;return[L(E),L(J),L(M)];},rgb2hsv:function(E,I,J){if(A.isArray(E)){return this.rgb2hsv.apply(this,E);}E/=255;I/=255;J/=255;var H,M,F=Math.min(Math.min(E,I),J),K=Math.max(Math.max(E,I),J),L=K-F,G;switch(K){case F:H=0;break;case E:H=60*(I-J)/L;if(I<J){H+=360;}break;case I:H=(60*(J-E)/L)+120;break;case J:H=(60*(E-I)/L)+240;break;}M=(K===0)?0:1-(F/K);G=[Math.round(H),M,K];return G;},rgb2hex:function(G,F,E){if(A.isArray(G)){return this.rgb2hex.apply(this,G);}var H=this.dec2hex;return H(G)+H(F)+H(E);},dec2hex:function(E){E=parseInt(E,10)||0;E=(E>255||E<0)?0:E;return(B+E.toString(16)).slice(-2).toUpperCase();},hex2dec:function(E){return parseInt(E,16);},hex2rgb:function(E){var F=this.hex2dec;return[F(E.slice(0,2)),F(E.slice(2,4)),F(E.slice(4,6))];},websafe:function(G,F,E){if(A.isArray(G)){return this.websafe.apply(this,G);}var H=function(I){if(A.isNumber(I)){I=Math.min(Math.max(0,I),255);var J,K;for(J=0;J<256;J=J+51){K=J+51;if(I>=J&&I<=K){return(I-J>25)?K:J;}}}return I;};return[H(G),H(F),H(E)];}};C.NAME="bewypeColor";D.namespace("Bewype");D.Bewype.Color=C;},"@VERSION@",{requires:["yui-base","bewype"]});