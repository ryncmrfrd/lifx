// This is the main script file for the LIFX Chrome Extension
// This script is composed by a block of helper functions that make--
// --calls to the LIFX and block flow functions that exceute the logic--
// --of the view.

//TOKEN and :SELECTOR are defined globally so they don't need to be passed.


// Note: LIFX API allows CORS so we can directly cURL from the client side
// without additional headers.



//------------------------------Helper Functions----------------------------- //

// cURL Request to Check for Available Lights. Also checking if Token is valid via
// status code.
function availableLights() {
    var xhr1 = $.ajax({
        url: "https://api.lifx.com/v1/lights/all",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + tokenLIFX);
        },
        type: 'GET',
        success: function(data) {
            //this block of code parses the available lights and populates the dropdown to select them.
            var lightsArray = [];
            $.each(data, function(i, lightObject) {
                var lightTuple = []; // Here I'm using an internal temporary--
                //--array to create a nested array that works as a tuple [lightID:light:Label]
                lightTuple.push(lightObject.id); // Adding Light ID to the Tuple.
                lightTuple.push(lightObject.label); // Adding LightLabel to the Tuple.
                lightTuple.push(lightObject.power)
                lightsArray.push(lightTuple);
            });

            var groupsArray = [];
            $.each(data, function(i, groupObject) {
                var groupTuple = []; // Here I'm using an internal temporary--
                //--array to create a nested array that works as a tuple [lightID:light:Label]
                groupTuple.push(groupObject.group.id); // Adding group ID to the Tuple.
                groupTuple.push(groupObject.group.name); // Adding LightLabel to the Tuple.
                groupsArray.push(groupTuple);
                groupsArray = groupsArray.uniq([].join); // This a method to remove duplicates.
            });


            $.each(lightsArray, function(i, lightInfo) {
                var state = capitalize(lightInfo[2]);
                $("#dropdownBulb").append('<option value="' + lightInfo[0] + '">' + lightInfo[1] + '</option>');
            });

            $.each(groupsArray, function(i, groupInfo) {
                $("#dropdownGroup").append('<option value="' + groupInfo[0] + '">' + groupInfo[1] + '</option>');
            });

            selector = "all"; // Defining Selector as "All" Initially

        },
        error: function() {
            authenticatedState = true
            //Alert that Token is Invalid.
            revealSnackbarNullToken();
            //purging the local memory
            // chrome.storage.local.remove("token");
        }
    });
}


//Still in the works
function updateLights() {
    var xhr1 = $.ajax({
        url: "https://api.lifx.com/v1/lights/all",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + tokenLIFX);
        },
        type: 'GET',
        success: function(data) {
            //this block of code parses the available lights and populates the dropdown to select them.
            var lightsArray = [];
            $.each(data, function(i, lightObject) {
                var lightTuple = []; // Here I'm using an internal temporary--
                //--array to create a nested array that works as a tuple [lightID:light:Label]
                lightTuple.push(lightObject.id); // Adding Light ID to the Tuple.
                lightTuple.push(lightObject.label); // Adding LightLabel to the Tuple.
                lightTuple.push(lightObject.power)
                lightsArray.push(lightTuple);
            });

            $.each(lightsArray, function(i, lightInfo) {
                var value = lightInfo[0]
                var label = lightInfo[1]
                var state = capitalize(lightInfo[2]);
                $("#dropdownBulb").append('<option value="' + value + '">' + label + " - " + state + '</option>');
            });

        },
        error: function() {
            authenticatedState = true
            //Alert that Token is Invalid.
            revealSnackbarNullToken();
            //purging the local memory
            // chrome.storage.local.remove("token");
        }
    });
}


// Available Scenes Function
function availableScenes() {
    $.ajax({
        url: "https://api.lifx.com/v1/scenes",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + tokenLIFX);
        },
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: '',
        success: function(data) {
            //this block of code parses the available lights and populates the dropdown to select them.
            var scenesArray = [];
            $.each(data, function(i, scenesObject) {
                var sceneTuple = []; // Here I'm using an internal temporary--
                //--array to create a nested array that works as a tuple [lightID:light:Label]
                sceneTuple.push(scenesObject.uuid); // Adding Light ID to the Tuple.
                sceneTuple.push(scenesObject.name); // Adding LightLabel to the Tuple.
                scenesArray.push(sceneTuple);
            });
            scenesArray.sort(function(a, b) {
                if (a[1] < b[1]) return -1;
                if (a[1] > b[1]) return 1;
                return 0;
            });

            $.each(scenesArray, function(i, sceneInfo) {
                $("#dropdownScene").append('<option value="' + sceneInfo[0] + '">' + sceneInfo[1] + '</option>');
            });
            chrome.storage.local.get("lastSelectedScene", function(result) {
                selectedSceneValue = result.lastSelectedScene
                // $("option[value='10']").attr('selected','selected');
                $('option[value=' + selectedSceneValue + ']').attr('selected','selected');
                console.log(selectedSceneValue);
            });
        }
    });
}




// API Call to Change Brightness with LIFX API.
function changeBright(brightValue, powerState) {
    var dataBright = {
        "brightness": brightValue,
        "power": powerState
    }
    $.ajax({
        url: "https://api.lifx.com/v1/lights/" + selector + "/state",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + tokenLIFX);
        },
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(dataBright),
        success: function(data) {
            //alert(JSON.stringify(data));
        },
        error: function() {
            console.log(dataBright);
        }
    });
}


// API Call to Change Color with LIFX API.
function changeColor(value) {
    var dataColor = {
        "color": value
    }
    $.ajax({
        url: "https://api.lifx.com/v1/lights/" + selector + "/state",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + tokenLIFX);
        },
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(dataColor),
        success: function(data) {
            //alert(JSON.stringify(data));
        },
        error: function() {
            console.log(dataBright);
        }
    });
}

// API Call to Change Kelvin with LIFX API.
function changeKelvin(kelvinValue) {
    var dataColor = {
        "color": kelvinValue
    }
    $.ajax({
        url: "https://api.lifx.com/v1/lights/" + selector + "/state",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + tokenLIFX);
        },
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(dataColor),
        success: function(data) {
            //alert(JSON.stringify(data));
        },
        error: function() {
            console.log(dataBright);
        }
    });
}

// API Call to Activate a Scene with LIFX API.
function activateScene(sceneID) {
    $.ajax({
        url: "https://api.lifx.com/v1/scenes/scene_id:" + sceneID + "/activate",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + tokenLIFX);
        },
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {},
        error: function() {
            console.log(sceneID);
        }
    });
}

// API Call to Toggle Lights.
function togglePower() {
    $.ajax({
        url: "https://api.lifx.com/v1/lights/" + selector + "/toggle",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + tokenLIFX);
        },
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function(data) {
            updateLights();
            //alert(JSON.stringify(data));
        },
    });
}

//------------------------------  Flow Functions----------------------------- //


//-----------Auth Init--------------- //
$('#oauth-button').click(function() {
    window.oauth2.start();
});

$('#manual-token').click(function() {
    oauthDisplayState = false
    getPositionAndRunUI()
    tokenValidation();
});

$('#oauth-token').click(function() {
    oauthDisplayState = true;
    getPositionAndRunUI()
    tokenValidation();
});

// Get LIFX Token From User. This function runs when the user submits the Token.
// if availablelights(); gets a 200 status code then the token is saved
// in the local storage.
function getTokenManual() {
    $("#submitValue").click(function() {
        tokenLIFX = $("#field").val(); //Global Variable
        availableLights(); // Getting available lights
        var obj = { 'token': tokenLIFX };
        // Save it using the Chrome extension storage API.
        chrome.storage.local.set(obj, function() {
            // Notify that we saved.
        });
    });
}


// function setOauthToken() {
// var tokenOAUTH = window.oauth2.getToken();
// var obj = {'token': tokenOAUTH};
// chrome.storage.local.set(obj, function() {
//       // Notify that we saved.
//       console.log('oAuth Token saved');
//     });
// };


// 1) Get Valid Token if not available. Continue if available.
// This function would run first checking for available tokens
// in the local storage. If there's not an available token, then
// it would define the state necessary to get one (View wise).
function tokenValidation() {
    chrome.storage.local.get("token", function(result) {
        tokenLIFX = result.token
        if (typeof tokenLIFX == "string") {
            // Hide Submit Token Section
            availableLights();
            authenticatedState = true
            oauthDisplayState = false;
            getPositionAndRunUI()
            availableScenes();
        } else if (oauthDisplayState == false) {
            getPositionAndRunUI()
            getTokenManual();
        } else if (oauthDisplayState == true) {
            getPositionAndRunUI()
        }
    });
}







/// These functions are mainly controls to select bulbs and
/// change their color and brightness.

// Listen for Bulb Selection :Selector
$('#dropdownBulb').change(
    function() {
        value = $("#dropdownBulb").val(); //Global Variable
        if (value == "all") {
            selector = "all"
        } else {
            selector = "id:" + value
        }
    });

// Listen for Group Selection :group_id
$('#dropdownGroup').change(
    function() {
        value = $("#dropdownGroup").val(); //Global Variable
        if (value == "all") {
            selector = "all"
        } else {
            selector = "group_id:" + value
        }
    });

// Listen for Scene Selection :group_id
$('#dropdownScene').change(
    function() {
        value = $("#dropdownScene").val(); //Global Variable
        if (value == "all") {
            selector = "all"
        } else {
            selector = "group_id:" + value
            selectedSceneValue = value
            var obj = { 'lastSelectedScene': selectedSceneValue };
            // Save it using the Chrome extension storage API.
            chrome.storage.local.set(obj, function() {
                // Notify that we saved.
            });
        }
    });

// Listen for Scene Selection and Activation
$('#applyScene').click(
    function() {
        value = $("#dropdownScene").val(); //Global Variable
        if (value == "select") {
            // Show Snackbar Saying Please Select a Scene
            revealSnackbarNoSelect();
        } else {
            sceneID = value
        }
        activateScene(sceneID);
    });

// Brightness Control
$(function() {
    var handle = $("#custom-handle");
    $("#slider").slider({
        value: 0,
        step: 10,
        min: 0,
        max: 100,
        create: function() {
            handle.text("OFF");
        },
        slide: function(event, ui) {
            if (ui.value == 0) {
                handle.text("OFF");
            } else {
                handle.text(ui.value);
            }
        },
        change: function(event, ui) {
            var brightValue = ui.value / 100
            console.log(brightValue);
            changeBright(brightValue, "on");
        }
    });
});


// Toggle Power

$('#togglePower').click(
    function() {
        togglePower();
        // $("#slider").slider("option", "value", 0);
        var handle = $("#custom-handle");
        handle.text("OFF")
    });

// Color Control
$('input.color-radio').change(
    function() {
        var selectedColor = $(this).attr('id');
        if (selectedColor == "neutral-filter") {
            changeKelvin("kelvin:9000")
        } else if (selectedColor == "neutral-filter2") {
            changeKelvin("kelvin:8000")
        } else if (selectedColor == "neutral-filter3") {
            changeKelvin("kelvin:7000")
        } else if (selectedColor == "neutral-filter4") {
            changeKelvin("kelvin:5000")
        } else if (selectedColor == "classic-filter") {
            changeKelvin("kelvin:4000")
        } else if (selectedColor == "classic-filter2") {
            changeKelvin("kelvin:3500")
        } else if (selectedColor == "classic-filter3") {
            changeKelvin("kelvin:3200")
        } else if (selectedColor == "classic-filter4") {
            changeKelvin("kelvin:3000")
        } else {
            var selectedColor = $(this).css('background-color').rgbToHex();
            changeColor(selectedColor);
        }
    });


// Log-out - Disconnect Extension
$('#logout').click(function() {
    chrome.storage.local.clear();
    window.close();
    // tokenValidation();
});


// ----Helper Prototypes and Converters Functions---
// Deleting Duplicate Arrays in Multidimensional Array
// as found in: http://stackoverflow.com/questions/14415787/
Array.prototype.uniq = function(key) {
    var set = {};
    return $.grep(this, function(item) {
        var k = key ? key.apply(item) : item;
        return k in set ? false : set[k] = true;
    });
}

// Converts a jQuery RGB String into a HEX Value
String.prototype.rgbToHex = function() {
    var rgb = this.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


// Capitalizes the first letter of a String
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * Sort values alphabetically in select
 * source: http://stackoverflow.com/questions/12073270/sorting-options-elements-alphabetically-using-jquery
 */
$.fn.extend({
    sortSelect() {
        let options = this.find("option"),
            arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();

        arr.sort((o1, o2) => { // sort select
            let t1 = o1.t.toLowerCase(),
                t2 = o2.t.toLowerCase();
            return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
        });

        options.each((i, o) => {
            o.value = arr[i].v;
            $(o).text(arr[i].t);
        });
    }
});





// ---- Initialize Popup JS Functions--- //

tokenValidation();