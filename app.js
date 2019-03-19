var selector = ''
var auth;
var currentLightColor = false;
$('.container,i,.error').hide();
function startApp(){
    $('.tokenWrapper').hide();
    auth = $('#appToken').val();
        $.ajax({
            url: "https://api.lifx.com/v1/lights/all",
            headers: {'Authorization':'Bearer '+auth},
            success: function(data){
                $.each(data, function(index) {
                    if(data[index].connected==true){$('.select').append('<option>'+data[index].label+'</option>');}
                    else{$('.select').append('<option disabled>'+data[index].label+' &#x26A0</option>');}
                });
                selector = $('.select').val();
                if(data[0].power=='on'){$('#on').show();$('#off').hide();}
                else if(data[0].power=='off'){$('#off').show();$('#on').hide();}
                //params based on whether the light supports color
                currentLightColor = data[0].product.capabilities.has_color;
                $(".Kelvin").val(data[0].color.kelvin);
                var rgb = colorTemperature2rgb(data[0].color.kelvin);
                $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')');
                $('.container').fadeIn();
            }
    });
}

$('.icons').click(function(){
    $('#loader').show();
    $('#on,#off').hide();
    $.ajax({
        url: "https://api.lifx.com/v1/lights/label:"+selector+"/toggle",
        headers: {'Authorization':'Bearer '+auth},
        type: 'POST',
        contentType: 'application/json',
        success: function(){
            $.ajax({
                url: "https://api.lifx.com/v1/lights/label:"+selector,
                headers: {'Authorization':'Bearer '+auth},
                success: function(data){
                    $('#loader').hide();
                    if(data[0].power=='on'){$('#on').show();$('#off').hide();}
                    else if(data[0].power=='off'){$('#off').show();$('#on').hide();}
                }
            });
        }
    });
})
$('.Kelvin').change(function() {
    var kelvin = $('.Kelvin').val();
    var dataColor = {'color': 'kelvin:'+kelvin}
    $.ajax({
        url: 'https://api.lifx.com/v1/lights/label:'+selector+'/state',
        headers: {'Authorization':'Bearer '+auth},
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(dataColor),
        success: function(){
            var rgb = colorTemperature2rgb(kelvin);
            $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')');
        },
        error: function(error) {
            console.log(error.responseJSON.error);
        }
    });
});
$('.brightness').change(function() {
    var dataBright = {
        "brightness": $('.brightness').val()/100,
        "power": "on"
    }
    $.ajax({
        url: 'https://api.lifx.com/v1/lights/label:'+selector+'/state',
        headers: {'Authorization':'Bearer '+auth},
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(dataBright),
        success: function() {
            $.ajax({
                url: "https://api.lifx.com/v1/lights/label:"+selector,
                headers: {'Authorization':'Bearer '+auth},
                success: function(data){
                   console.log(data[0].brightness)
                }
            });
        }
    });
});
//show color value while dragging slider
$(document).on('input', '.Kelvin', function() {
    klvnrgb = colorTemperature2rgb($(this).val());
    $('.Kelvin').css('background','rgb('+klvnrgb.red+','+klvnrgb.green+','+klvnrgb.blue+')');
});
$('.Kelvin').focusout(function(){
    $('.Kelvin').css('background','white');
});
