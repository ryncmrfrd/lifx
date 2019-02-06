/*
    https://github.com/neilbartlett
    thanks a ton.
*/
colorTemperature2rgbUsingTH=colorTemperature2rgbUsingTH=function(kelvin){var temperature=kelvin/100.0;var red,green,blue;if(temperature<=66.0){red=255}else{red=temperature-60.0;red=329.698727446*Math.pow(red,-0.1332047592);if(red<0)red=0;if(red>255)red=255}
if(temperature<=66.0){green=temperature;green=99.4708025861*Math.log(green)-161.1195681661;if(green<0)green=0;if(green>255)green=255}else{green=temperature-60.0;green=288.1221695283*Math.pow(green,-0.0755148492);if(green<0)green=0;if(green>255)green=255}
if(temperature>=66.0){blue=255}else{if(temperature<=19.0){blue=0}else{blue=temperature-10;blue=138.5177312231*Math.log(blue)-305.0447927307;if(blue<0)blue=0;if(blue>255)blue=255}}
return{red:Math.round(red),blue:Math.round(blue),green:Math.round(green)}}
colorTemperature2rgb=colorTemperature2rgb=function(kelvin){var temperature=kelvin/100.0;var red,green,blue;if(temperature<66.0){red=255}else{red=temperature-55.0;red=351.97690566805693+0.114206453784165*red-40.25366309332127*Math.log(red);if(red<0)red=0;if(red>255)red=255}
if(temperature<66.0){green=temperature-2;green=-155.25485562709179-0.44596950469579133*green+104.49216199393888*Math.log(green);if(green<0)green=0;if(green>255)green=255}else{green=temperature-50.0;green=325.4494125711974+0.07943456536662342*green-28.0852963507957*Math.log(green);if(green<0)green=0;if(green>255)green=255}
if(temperature>=66.0){blue=255}else{if(temperature<=20.0){blue=0}else{blue=temperature-10;blue=-254.76935184120902+0.8274096064007395*blue+115.67994401066147*Math.log(blue);if(blue<0)blue=0;if(blue>255)blue=255}}
return{red:Math.round(red),blue:Math.round(blue),green:Math.round(green)}}
rgb2colorTemperature=rgb2colorTemperature=function(rgb){var temperature,testRGB;var epsilon=0.4;var minTemperature=1000;var maxTemperature=40000;while(maxTemperature-minTemperature>epsilon){temperature=(maxTemperature+minTemperature)/2;testRGB=colorTemperature2rgb(temperature);if((testRGB.blue/testRGB.red)>=(rgb.blue/rgb.red)){maxTemperature=temperature}else{minTemperature=temperature}}
return Math.round(temperature)}