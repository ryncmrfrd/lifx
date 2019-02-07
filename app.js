//important variables
var selector = ''
var auth = 'c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a';
var selectedLightType = true;
//some global functions
function setBackgroundColor(color){
    if(color.hue==0){
        var temperature = colorTemperature2rgb(color.kelvin);
        $('body').css('background',
            'rgb('+temperature.red+','+temperature.green+','+temperature.blue+')'
        );
    }
    else{
        $('body').css('background',
            'rgb('+hue+')'
        );
    }
}
function errorWarning(errorText){
    $('.error').css('top','0')
    $('.error .label').text(errorText);
    setTimeout(function(){
        $('.error').css('top','-100px')
    }, 10000);
}
//sort of "loading" screen
$('.buttonContainer,i').hide();
$( document ).ready(function() {
    $.ajax({
        url: "https://api.lifx.com/v1/lights/all",
        headers: {'Authorization': 'Bearer '+auth},
        success: function(result){
            $.each(result, function(index) {$('#selectLight').append('<option>'+result[index].label+'</option>');});
            selector = "label:" + $("#selectLight").val();
            $('#selectLight').append('<option>All</option>');
            if(result[0].power=='on'){
                $('#lightOn').show();
                $('#lightOff').hide();
            }
            else{
                $('#lightOn').hide();
                $('#lightOff').show();
            }
            selectedLightType = result[0].product.capabilities.has_color
            if(result[0].color.hue==0){$('#temperatureSlider').val(result[0].color.kelvin);}
            else{$('#temperatureSlider').val(result[0].color);}
            setBackgroundColor(result[0].color);
            $('.buttonContainer').fadeIn();
        }
    });
});
//if dropdown changes
$("#selectLight").change(function(){
    var dropdown = $("#selectLight").val();
    if(dropdown == "All"){selector = "all";}
    else{selector = "label:" + dropdown;}
    $.ajax({
        url: "https://api.lifx.com/v1/lights/"+selector,
        headers: {'Authorization': 'Bearer '+auth},
        success: function(result){
            //set light type
            selectedLightType = result[0].product.capabilities.has_color
            //set slider to current color
            if(result[0].color.hue==0){$('#temperatureSlider').val(result[0].color.kelvin);}
            else{$('#temperatureSlider').val(result[0].color);}
            //set background color
            setBackgroundColor(result[0].color);
        }
    });
});
//toggle button
$("#toggleAll").click(function(){
    $('#lightOn, #lightOff').hide();
    $('#loader').show();
    $.ajax({
        url: "https://api.lifx.com/v1/lights/" + selector + "/toggle",
        headers: {'Authorization': 'Bearer '+auth},
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function() {
            $.ajax({
                url: "https://api.lifx.com/v1/lights/all",
                headers: {'Authorization': 'Bearer '+auth},
                success: function(result){
                    $('#loader').hide();
                    if(result[0].power=='on'){
                        $('#lightOn').show();
                        $('#lightOff').hide();
                    }
                    else{
                        $('#lightOn').hide();
                        $('#lightOff').show();
                    }
                }
            });
        },
    });
});
//if color slider changes
$("#temperatureSlider").change(function(){
    var value = $("#temperatureSlider").val()
    var dataColor = {"color": 'kelvin:'+value}
    var temperature = colorTemperature2rgb(value);
    $('body').css('background',
        'rgb('+temperature.red+','+temperature.green+','+temperature.blue+')'
    );
    $.ajax({
        url: "https://api.lifx.com/v1/lights/all/state",
        headers: {'Authorization': 'Bearer '+auth},
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(dataColor),
        success: function(){}
    });
});