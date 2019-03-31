/*
      Written by Ryan Comerford. Believe it or not, this 
    is what I do for fun. Find me at https://ryncmrfrd.me.
*/

//just to make my life easy
var lifx = {
    auth: '',
    //start the api and get lifx.auth to your key
    start: function(key, sucCBK, errCBK){
        $.ajax({
            url: "https://api.lifx.com/v1/lights/all",
            headers: {'Authorization':'Bearer '+key},
            success: function(sucPARAMS){
                lifx.auth = key;
                if(sucPARAMS){lifx.callback(sucCBK, sucPARAMS)}
                else{lifx.callback(sucCBK)}
            },
            error: function(errPARAMS){
                if(errCBK){
                    lifx.callback(errCBK,errPARAMS)
                }
            }
        });
    },
    //get all lights and their details
    get: function(selector, sucCBK, errCBK){
        if(!lifx.auth){return;}
        $.ajax({
            url: "https://api.lifx.com/v1/lights/"+selector,
            headers: {'Authorization':'Bearer '+lifx.auth},
            success: function(sucPARAMS){
                if(sucPARAMS){lifx.callback(sucCBK, sucPARAMS)}
                else{lifx.callback(sucCBK)}
            },
            error: function(errPARAMS){
                if(errCBK){lifx.callback(errCBK,errPARAMS)}
            }
        });
    },
    //toggles the on/off state of the selected light
    toggle: function(selector, sucCBK){
        if(!lifx.auth){return;}
        $.ajax({
            url: "https://api.lifx.com/v1/lights/id:"+selector+"/toggle",
            headers: {'Authorization':'Bearer '+lifx.auth},
            type: 'POST',
            contentType: 'application/json',
            success: function(errPARAMS){
                var sucPARAMS = errPARAMS.results;
                if(errPARAMS    ){lifx.callback(sucCBK, sucPARAMS)}
                else{lifx.callback(sucCBK)}
            },
            error: function(errPARAMS){
                if(errCBK){
                    lifx.callback(errCBK,errPARAMS)
                }
            }
        });
    },
    //changes any light state ie. color, brightness, on/off (for that you could just use "lifx.toggle")
    changeState: function(selector, data, sucCBK, errCBK){
        if(!lifx.auth){return;}
        $.ajax({
            url: 'https://api.lifx.com/v1/lights/id:'+selector+'/state',
            headers: {'Authorization':'Bearer '+lifx.auth},
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(data),
            success: function(sucPARAMS){
                lifx.callback(sucCBK, sucPARAMS)
            },
            error: function(errPARAMS){
                if(errCBK){
                    lifx.callback(errCBK,errPARAMS)
                }
            }
        });
    },
    //boiletplate stuff for callbacks to work (and work with anonymous functions)
    callback: function(callback,params){if(arguments.length==0){console.error('Incorrect function parameters')}else if(!params){callback()}else{callback(params)}}
}