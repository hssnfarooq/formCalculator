var debugVar = "Default Value";

// Toggle button
/*document.querySelector('.toggle-button').addEventListener('click', function () {
    slideout.toggle();
}); */

var map;
var watchID;
var collectionGPS;


window.onload = function () {
    $(".rel-wrap input").keyup(function () {
        if ($(this).val().length > 0) {
            $(this).parent().addClass("focused");
        }
        else {
            $(this).parent().removeClass("focused");
        }

    });

    $(".gps").click(function () {
        initMap();

        $(".blackout").fadeIn();

        //map.setZoom(15);
        $(".maplocation").fadeIn();
        var inputId = $(this).attr("data");
        geo_results.target = inputId;
        setTimeout(function () {
            if (geo_results.found == false) {
                $(".maplocation h3").html("Check if GPS is enabled");
            }
        }, 10000);
        collectionGPS = navigator.geolocation.watchPosition(GetLocation, null, geo_options);
    });

    $(".blackout").click(function () {
        $(".blackout").fadeOut();
        $(".maplocation").fadeOut();
    });
    $(".close").click(function () {
        $(".blackout").fadeOut();
        $(".maplocation").fadeOut();
    });


    $("select").change(function () {
        $(this).removeClass("placeholder");
    }).each(function () {
        if ($(this).val() == null)
        {
            $(this).addClass("placeholder");
        }
    });

    $(".banner").slick({
        arrows: false
    });
    $(".banner").show();

    $(".slider2 .slider2-option").click(function () {
        var getOption = $(this).index();
        $(this).parent().attr("class", "slider2 select-" + getOption);
    });


    
    $(".slider2 label").click(function () { $("#" + $(this).attr("for")).prop("checked", true); });

    $(".mobiBtn").click(function () {
        $(this).toggleClass("selected");
        $("#menu").toggleClass("selected");
        $("body").toggleClass("freeze");
        $(".nav.navbar-nav").removeClass("submenu");
    });


    $("input").click(function () {
        $(this).removeClass("error");
    });

    $(".hasSubmenu>a").click(function (e) {
        e.preventDefault();
        $(".submenu").addClass("hide");
        $(this).next().removeClass("hide");
        $(".nav.navbar-nav").toggleClass("submenu");
    });

    $(".closeSubmenu").click(function (e) {
        e.preventDefault();
        $(this).parent().toggleClass("show");
        $(".nav.navbar-nav").toggleClass("submenu");
    });
}

var geo_options = {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000
};

var geo_results = {
    target: "",
    description: "",
    docid: "",
    long: "",
    lat: "",
    found: false
}

var firstTime = true;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: -26.082243, lng: 28.022909 },
        disableDefaultUI: true,
        draggable: false,
        zoomControl: true,
        disableDoubleClickZoom: false
    });
};

function saveResults() {
    navigator.geolocation.clearWatch(collectionGPS);
    $(".maplocation").fadeOut();

    $("input[data='" + geo_results.target + "']").val(geo_results.description);
    $("#" + geo_results.target + "ID").val(geo_results.docid);
    $("#" + geo_results.target + "Lat").val(geo_results.lat);
    $("#" + geo_results.target + "Long").val(geo_results.long);
}

function GetLocation(location) {

    if (location.coords.longitude == null) {
        $(".maplocation h3").html("GPS Disabled");
        $(".maplocation button").slideUp();
        geo_results.found = false;
    }
    else {
        $(".maplocation h3").html("Found");
        $(".maplocation button").slideDown();
        geo_results.found = true;
    }
    var accuracy = location.coords.accuracy / 3;
    var ahalf = accuracy / 2;
    map.panTo({ lat: location.coords.latitude, lng: location.coords.longitude });
    // alert(ahalf);
    $("#mapPoint").css({
        top: 'Calc( 50% - ' + ahalf + 'px )',
        left: 'Calc( 50% - ' + ahalf + 'px )',
        height: accuracy + 'px',
        width: accuracy + 'px'
    });

    $("#debug").html(
        "Long:" + location.coords.latitude + "<br/>" +
        "Lat:" + location.coords.longitude + "<br/>" +
        "Acc:" + location.coords.accuracy + "<br/>" +
        "Dir:" + location.coords.heading + "<br/>" +
        "Speed:" + location.coords.speed + "<br/>"
        );

    $.ajax({
        url: '/Afrigis.ashx?i=4&latitude=' + location.coords.latitude + "&longitude=" + location.coords.longitude,
        dataType: "json",
        type: 'GET',
        async: false, //blocks window close
        success: function (json) {
            $("#location").html(json.result[0].description);
            geo_results.description = json.result[0].description;
            geo_results.docid = json.result[0].docID;
            geo_results.lat = json.result[0].latitude;
            geo_results.long = json.result[0].longitude;

            // showPosition("mapholder", geo_results.long, geo_results.lat);
        },
        error: function () {
            showError('Unable to connect to the address lookup servers.');
        }
    });

}


function showError(message) {
    var newBox = $('<div class="errorBox">' + message + '</div>').appendTo('body').slideUp(0).slideDown();
    setTimeout(function () {
        newBox.slideUp(500);
    }, 4000);
    setTimeout(function () {
        newBox.remove();
    }, 4500);
}



var lineNames = {
    "Business": ["Building Name", "Floor", "", ""],
    "Farm": ["", "Plot", "Nearby Landmarks", ""],
    "Home": ["", "", "", ""],
    "Hospital": ["Hospital Name", "Floor", "Ward", "Room"],
    "Hotel": ["Hotel Name", "Hotel Room Number", "", ""],
    "Office Park": ["Office Park Name", "Building", "Floor", "Suite Number"],
    "Residential Complex": ["Complex Name", "Unit Number", "", "Floor"],
    "Shopping Centre": ["Shopping Centre Name", "Floor", "", "Store Number"],
    "School": ["School Name", "", "Faculty / Class", ""],
    "Mine": ["", "Shaft Number", "Nearby Landmarks", ""]
}

/*
checkbox name: the value of the name attribute
linesContainerID: the ID of the div that contains the 3 text input options for extra info
client: null, else if the client exists, a client javascript array, as seen in the Parcels/CollectionDelivery page
*/
function addressType(checkboxName, linesContainerID, client) {
    var type = $("input[name='" + checkboxName + "']:checked").val();
    var lines = $("#" + linesContainerID + " input").val("");
    for (i = 0; i < 4; i++)
    {
        $(lines[i]).attr("placeholder", lineNames[type][i]);
        if (lineNames[type][i].length == 0)
            $(lines[i]).stop().slideUp();
        else
        {
            $(lines[i]).slideDown();
            if (client != null) $(lines[i]).val(client[lines[i]]);
        }  
    }
}


function PopulateRestrictedItems(dropdown) {
    $(dropdown).html("");
    $.ajax({
        type: "POST",
        url: '/Home/getRestrictedItems',
        dataType: 'json',
        //success: function (data) {

        //    var select = $(dropdown), options = '';
        //    select.empty();

        //    options += "<option value='' disabled selected>Select</option><option value='-1'>No</option>";
        //    for (var i = 0; i < data.Items.length; i++) {
        //        options += "<option value='" + data.Items[i].RecordType + "'>" + data.Items[i].RecordType + ' - ' + data.Items[i].ListItemID + "</option>";
        //    }

        //    select.append(options);

        //    select = $(), options = '';
        //    select.empty();
        //    options += "<option value='-1'>No</option>";
        //    for (var i = 0; i < data.Items.length; i++) {
        //        options += "<option value='" + data.Items[i].RecordType + "'>" + data.Items[i].RecordType + ' - ' + data.Items[i].ListItemID + "</option>";
        //    }
        //    select.append(options);
        //}

        success: function (result) {
            $(dropdown).append($("<option/>", { html: "Select", value: "", selected: true, disabled: true }));
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                var desc = (item.Restriction == 1 ? "Restricted - " : (item.Restriction == 0 ? "Prohibited - " : ""));

                $(dropdown).append($("<option/>", { html: desc + item.Description, value: item.Restriction }));
            }
        },
        complete: null
    });
}

function save_select_text(select, textbox) {
    $(select).change(function () {
        var textVal = $(this).children("option[value='" + $(this).val() + "']").html();
        $(textbox).val(textVal);
    });
    
}
