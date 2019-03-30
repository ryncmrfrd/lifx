/*
      Written by Ryan Comerford. Believe it or not, lifx 
    is what I do for fun. Find me at https://ryncmrfrd.me.
*/

//just to make my life easy
var lifx = {
    auth,
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
    //toggles the on/off state of the selected light
    toggle: function(selector, sucCBK){
        if(!lifx.auth){return;}
        $.ajax({
            url: "https://api.lifx.com/v1/lights/label:"+selector+"/toggle",
            headers: {'Authorization':'Bearer '+lifx.auth},
            type: 'POST',
            contentType: 'application/json',
            success: function(errCBK){
                if(errCBK){lifx.callback(sucCBK, errCBK)}
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
            url: 'https://api.lifx.com/v1/lights/label:'+selector+'/state',
            headers: {'Authorization':'Bearer '+lifx.auth},
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(data),
            success: function(sucPARAMS){
                lifx.callback(sucCBK)
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

// ↓ ignore me ↓
$('.container,i,.error').hide();
var selector, auth, currentLightColor = false;

function startApp(key){
    //start lifx API
    lifx.start(key, function(data){

        //append light options to dropdown selector
        $.each(data, function(index) {
            if(data[index].connected==true){$('.select').append('<option>'+data[index].label+'</option>');}
            else{$('.select').append('<option disabled>'+data[index].label+' &#x26A0</option>');}
        });
        selector = $('.select').val();

        //set UI details to first light
        if(data[0].power=='on'){$('#on').show();$('#off').hide();}
        else if(data[0].power=='off'){$('#off').show();$('#on').hide();}
        currentLightColor = data[0].product.capabilities.has_color;
        $(".Kelvin").val(data[0].color.kelvin);
        var rgb = colorTemperature2rgb(data[0].color.kelvin);

        //set background color
        $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')');
        $('.container').fadeIn();
    }, function(){
        window.location.href = '/'
    })
}

//on click toggle button
$('.icons').click(function(){
    $('#loader').show();
    $('#on,#off').hide();

    //toggle currently selected light
    lifx.toggle(selector, function(data){
        $('#loader').hide();
        if(data[0].power=='on'){$('#on').show();$('#off').hide();}
        else if(data[0].power=='off'){$('#off').show();$('#on').hide();}
    });
})

//on change color slider
$('.Kelvin').change(function() {
    //data to set on light
    var dataColor = {'color': 'kelvin:'+$('.Kelvin').val()}

    //set light color to the one currently selected on slider
    lifx.changeState(selector, dataColor, function(){
        var rgb = colorTemperature2rgb(kelvin);
        $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')');
    })
});

$('.brightness').change(function() {
    //data to set on light
    var dataBright = {
        "brightness": $('.brightness').val()/100,
        "power": "on"
    }

    //set light brightness to the one currently selected on slider
    lifx.changeState(selector, dataBright, function(data){
        console.log(data[0].brightness)
    })
});

//show color value while dragging slider
$(document).on('input', '.Kelvin', function() {
    var klvnrgb = colorTemperature2rgb($(lifx).val());
    $('.Kelvin').css('background','rgb('+klvnrgb.red+','+klvnrgb.green+','+klvnrgb.blue+')');
});

//set color back to white on focus off slider
$('.Kelvin').focusout(function(){
    $('.Kelvin').css('background','white');
});