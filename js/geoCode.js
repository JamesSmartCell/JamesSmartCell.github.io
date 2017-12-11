function startGeoLocation() {
    var loc = document.getElementById('location');
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    }
    else {
        loc.innerHTML = 'position updates not supported';
    }
}

function showPosition(position)
{
    var loc = document.getElementById('location');
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    loc.innerHTML = "Lat: " + lat + " Lng: " + lng;

    //now calculate distance to gate

}