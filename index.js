$('.buttonContainer,i').hide();
$( document ).ready(function() {
    $.ajax({
        url: "https://api.lifx.com/v1/lights/all",
        headers: {'Authorization': 'Bearer c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a'},
        success: function(data){
            $.each(data, function(index) {
                console.log(data[index])
                $('#selectLight').append(
                    '<option>'+data[index].label+'</option>'
                );
            });
            $('.buttonContainer').fadeIn();
            if(data[0].power == 'on'){$('#lightOn').show();}
            else{$('#lightOff').show();}
            $('#temperatureSlider').val(data[0].color.kelvin)
            changeBodyColor(data[0].color)
        }
    });
});
function ToggleLights(){
    $('#loader').show();
    $('#lightOn').hide();
    $('#lightOff').hide();
    $.ajax({
        url: "https://api.lifx.com/v1/lights/all/toggle",
        headers: {'Authorization': 'Bearer c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a'},
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        success: function(){
            $.ajax({
                url: "https://api.lifx.com/v1/lights/all",
                headers: {'Authorization': 'Bearer c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a'},
                success: function(data){
                    $('#loader').hide();
                    if(data[0].power == 'on'){
                        $('#lightOn').show();
                        $('#lightOff').hide();
                    }
                    else{
                        $('#lightOn').hide();
                        $('#lightOff').show();
                    }
                    changeBodyColor(data[0].color);
                },
            });
        }
    });
}
function changeLightColorBYKELVIN(kelvin){
        var dataColor = {
            "color": 'kelvin:'+kelvin
        }
        $.ajax({
            url: "https://api.lifx.com/v1/lights/all/state",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer" + " " + "c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a");
            },
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(dataColor),
            success: function() {},
            error: function(error) {
                console.log(error);
            }
        });
    }

$("#temperatureSlider").change(function () {
    var value = $("#temperatureSlider").val()
    var temperature = colorTemperature2rgb(value);
    changeLightColorBYKELVIN(value);
    $('body').css('background',
        'rgb('+temperature.red+','+temperature.green+','+temperature.blue+')'
    );
});

function changeBodyColor(color){
    if(color.hue == 0){
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