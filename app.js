//important variables
var selector = 'all'
var auth = 'c2b237e0d34308de34e17dfb1f43d576822f2b55a298cc550511b42b998b5a9a';
//sort of "loading" screen
$('.buttonContainer,i').hide();
$( document ).ready(function() {
    $.ajax({
        url: "https://api.lifx.com/v1/lights/all",
        headers: {'Authorization': 'Bearer '+auth},
        success: function(result){
            //add options to light slection dropdown menu
            $.each(result, function(index) {
                $('#selectLight').append(
                    '<option>'+result[index].label+'</option>'
                );
            });
            //show off icon
            $('#lightOff').show();
            //set slider to current color
            if(result[0].color.hue==0){
                $('#temperatureSlider').val(result[0].color.kelvin);
            }
            else{
                $('#temperatureSlider').val(result[0].color);
            }
            //end "loading" screen
            $('.buttonContainer').fadeIn();
        }
    });
});

//if dropdown changes
$("#selectLight").change(function(){
    var dropdown = $("#selectLight").val();
    //change selector based on dropdown value
    if(dropdown == "All"){selector = "all";}
    else{selector = "label:" + dropdown;}
    $.ajax({
        url: "https://api.lifx.com/v1/lights/"+selector,
        headers: {'Authorization': 'Bearer '+auth},
        success: function(result){
            console.log(result)
        }
    });
});

$("#toggleAll").click(function(){
    var currentState = $('#lightOff:visible');
    console.log(currentState)
    $('#lightOn, #lightOff').hide();
    $('#loader').show();
    /*$.ajax({
        url: "https://api.lifx.com/v1/lights/"+selector+"/toggle",
        headers: {'Authorization': 'Bearer '+auth},
        success: function(result){
            $('#loader').hide();
            if($('#lightOff').is(":visible")){
                $('#lightOn').show();
                $('#lightOff').hide();
            }
            else{
                $('#lightOn').hide();
                $('#lightOff').show();
            }
        }
    });*/

    $('#loader').hide();
    if(currentState){
        console.log('off')
        $('#lightOn').show();
        $('#lightOff').hide();
    }
    else if($('#lightOff:hidden')&&$('#lightOn:visible')){
        console.log('on')
        $('#lightOn').hide();
        $('#lightOff').show();
    }

});