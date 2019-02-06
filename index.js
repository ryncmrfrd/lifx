$('i').hide();
$( document ).ready(function() {
    $.ajax({
        url: "https://api.lifx.com/v1/lights/all",
        headers: {'Authorization': 'Bearer c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a'},
        success: function(data){
            $('button').show();
            if(data[0].power == 'on'){$('#lightOn').show();}
            else{$('#lightOff').show();}
            changeColor(data[0].color)
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

                    changeColor(data[0].color)
                },
            });
        }
    });
}

function changeLightColor(){
    console.log('change light color');
    var dataColor = {
        "color": "5000"
    }
    $.ajax({
        url: "https://api.lifx.com/v1/lights/all/state",
        headers: {'Authorization': 'Bearer c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a'},
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(dataColor),
        success: function(data) {
            console.log(data);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function changeColor(color){
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