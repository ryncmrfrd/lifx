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

//global variables
var selector,
    currentLight_HadColor;

function startApp(auth){
    $('i').hide();
    lifx.start(auth, function(data){

        //
        $('.logout').click(function(){
            localStorage.setItem("lifxAuthKey","");
            window.location.href="login"
        });

        //add lights to dropdown
        $('.app-select').empty()
        $.each(data, function(i) {
            if(data[i].connected==true){
                $('.app-select').append('<option value='+data[i].id+' >'+data[i].label+'</option>');
            }
            else{
                $('.app-select').append('<option disabled>'+data[i].label+' &#x26A0</option>');
            }
        });
        selector = $('.app-select').val();

        //if first light has color capabilities
        currentLight_HadColor = data[0].product.capabilities.has_color;
        if(currentLight_HadColor){
            $('.Kelvin').val(data[0].color.kelvin);
            $('.Color').val(data[0].color.kelvin);
        }
        else{
            $('.Kelvin').val(data[0].color.kelvin);
            $('.Color').hide();
        }

        //if first light is already on
        if(data[0].power=='on'){
            $('#on').show();
            $('#off').hide();
        }
        else{
            $('#off').show();
            $('#on').hide();
        }

        //set brightness
        var brightness = Number(data[0].brightness)*100;
        $('.brightness').val(brightness);
        
        //set current background color
        var rgb = colorTemperature2rgb(data[0].color.kelvin);
        $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')'); 
        $('.app-container, .logout').fadeIn();

    });
}

function updateLights(sel){
    lifx.get('id:'+sel, function(data){
        $('i').hide();
        //if first light is already on
        if(data[0].power=='on'){
            $('#on').show();
            $('#off').hide();
        }
        else{
            $('#off').show();
            $('#on').hide();
        }

        //if first light has color capabilities
        currentLight_HadColor = data[0].product.capabilities.has_color;

        $('.Kelvin').val(data[0].color.kelvin);
        $('.Color').val(data[0].color.kelvin);


        if(currentLight_HadColor){
            $('.Color, .Kelvin').fadeIn();
        }
        else{
            $('.Kelvin').fadeIn();
            $('.Color').fadeOut();
        }

        //set brightness
        var brightness = Number(data[0].brightness)*100;
        $(".brightness").val(brightness);
        //set current background color
        var rgb = colorTemperature2rgb(data[0].color.kelvin);
        $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')');
    })
}


/*
    EVENT LISTENERS
*/

//on change selector
$('.app-select').change(function() {
    selector = $('.app-select').val();
    updateLights($('.app-select').val());
});

//on click toggle button
$('.toggle-icons').click(function(){
    var isOn = $('#on').is(":visible");
    $('#loader').show(); $('#on,#off').hide();
    lifx.toggle(selector, function(){
        $('#loader').hide();
        if(!isOn){
            $('#on').show();$('#off').hide();
        }
        else{
            $('#off').show();$('#on').hide();
        }
    });
})

//on change kelvin slider
$('.Kelvin').change(function() {
    var dataColor = {'color': 'kelvin:'+$('.Kelvin').val()}, kelvin = $('.Kelvin').val();
    lifx.changeState(selector, dataColor, function(){
        var rgb = colorTemperature2rgb(kelvin);
        $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')');
    })
});

//on change color slider
$('.Color').change(function() {
    console.log('changed color')
});

//show color value while dragging slider
$(document).on('input', '.Kelvin', function() {
    var lifxval = $('.Kelvin').val(), klvnrgb = colorTemperature2rgb(lifxval);
    $('body').css('background','rgb('+klvnrgb.red+','+klvnrgb.green+','+klvnrgb.blue+')');
});

//change brightness
$('.brightness').change(function() {
    lifx.changeState(selector, {
        'brightness': $('.brightness').val()/100,
        'power': 'on'
    })
});