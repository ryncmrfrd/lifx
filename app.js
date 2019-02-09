var selector = ''
var auth = 'c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a';
var currentLightColor = false;
$('.buttonContainer,i, #colorSliderColor, #colorSliderKelvin').hide();
$(function() {
    $.ajax({
        url: "https://api.lifx.com/v1/lights/all",
        headers: {'Authorization':'Bearer '+auth},
        success: function(data){
            $.each(data, function(index) {
                if(data[index].connected==true){$('.selectLight').append('<option>'+data[index].label+'</option>');}
                else{$('.selectLight').append('<option disabled>'+data[index].label+' &#x26A0</option>');}
            });
            selector = $('.selectLight').val();
            if(data[0].power=='on'){$('#lightOn').show();$('#lightOff').hide();}
            else if(data[0].power=='off'){$('#lightOff').show();$('#lightOn').hide();}
            //params based on whether the light supports color
            currentLightColor = data[0].product.capabilities.has_color;
            if(currentLightColor){
                $("#colorSliderColor").show();
                $("#colorSliderColor").val(data[0].color.hue);
                var rgb = hsvToRgb(data[0].color.hue,100,100);
                $('body').css('background','rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
            }
            else{
                $("#colorSliderKelvin").show();
                $("#colorSliderKelvin").val(data[0].color.kelvin);
                var rgb = colorTemperature2rgb(data[0].color.kelvin);
                $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')');
            }
            $('.buttonContainer').fadeIn();
        }
    });
});

function selectLight(){
    if($('.selectLight option').prop("disabled")){
        
    }
    else{
        console.log('yeeted')
    }
}

$('.mainButton').click(function(){
    $('#loader').show();
    $('#lightOn,#lightOff').hide();
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
                    if(data[0].power=='on'){$('#lightOn').show();$('#lightOff').hide();}
                    else if(data[0].power=='off'){$('#lightOff').show();$('#lightOn').hide();}
                }
            });
        }
    });
})


$('#colorSliderColor').change(function() {
    var hue = $('#colorSliderKelvin').val();
    var dataColor = {'color': hue}
    $.ajax({
        url: 'https://api.lifx.com/v1/lights/label:'+selector+'/state',
        headers: {'Authorization':'Bearer '+auth},
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(dataColor),
        error: function(error) {
            console.log(error);
        }
    });
});

$('#colorSliderKelvin').change(function() {
    var kelvin = $('#colorSliderKelvin').val();
    var dataColor = {'color': 'kelvin:'+kelvin}
    $.ajax({
        url: 'https://api.lifx.com/v1/lights/label:'+selector+'/state',
        headers: {'Authorization':'Bearer '+auth},
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(dataColor),
        error: function(error) {
            console.log(error.responseJSON.error);
        }
    });
    var rgb = colorTemperature2rgb(kelvin);
    $('body').css('background','rgb('+rgb.red+','+rgb.green+','+rgb.blue+')');
});