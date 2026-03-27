var map = L.map('map').setView([22.1, 87.9], 9);

var totalEmergencies = 0;

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);


fetch("/services")
.then(res => res.json())
.then(data => {

    data.hospitals.forEach(h=>{
        L.marker(h.location)
        .addTo(map)
        .bindPopup("Hospital: "+h.name)
    })

    data.firestations.forEach(f=>{
        L.marker(f.location)
        .addTo(map)
        .bindPopup("Fire Station: "+f.name)
    })

    data.police.forEach(p=>{
        L.marker(p.location)
        .addTo(map)
        .bindPopup("Police Station: "+p.name)
    })

})


fetch("/ambulances")
.then(res=>res.json())
.then(data=>{

    data.forEach(a=>{

        L.marker(a.location)
        .addTo(map)
        .bindPopup("Ambulance "+a.id)

    })

})


map.on("click", function(e){

    var lat = e.latlng.lat
    var lon = e.latlng.lng

    totalEmergencies++

    document.getElementById("total").innerText = totalEmergencies

    fetch("/emergency",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            lat:lat,
            lon:lon
        })

    })
    .then(res=>res.json())
    .then(data=>{

        var amb = data.ambulance

        L.polyline([
            [amb.location[0], amb.location[1]],
            [lat, lon]
        ],{
            color:"red"
        }).addTo(map)

        alert("Ambulance "+amb.id+" dispatched!")

    })

})