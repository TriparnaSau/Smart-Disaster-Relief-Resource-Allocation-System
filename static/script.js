// ---------------- MAP INITIALIZATION ----------------

var map = L.map('map').setView([22.3, 87.9], 10);

// ---------------- EMERGENCY LAYER GROUP ----------------

const emergencyLayerGroup = L.layerGroup().addTo(map);

// ---------------- AMBULANCE EMOJI ICON ----------------

var ambulanceIcon = L.divIcon({

    html: "🚑",

    className: "ambulance-emoji",

    iconSize: [30, 30]

});

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenStreetMap contributors'
    }
).addTo(map);


// ---------------- SHOW ALL SERVICES ----------------

fetch("/services")
    .then(res => res.json())
    .then(data => {

        // Hospitals
        data.hospitals.forEach(h => {

            L.marker(h.location)
                .addTo(map)
                .bindPopup("Hospital: " + h.name);

        });

        // Fire Stations
        data.firestations.forEach(f => {

            L.marker(f.location)
                .addTo(map)
                .bindPopup("Fire Station: " + f.name);

        });

        // Police
        data.police.forEach(p => {

            L.marker(p.location)
                .addTo(map)
                .bindPopup("Police: " + p.name);

        });

        // Ambulances
        data.ambulances.forEach(a => {

            L.marker(a.location)
                .addTo(map)
                .bindPopup("Ambulance: " + a.id);

        });

        // Relief Camps
        data.relief_camps.forEach(c => {

            L.marker(c.location)
                .addTo(map)
                .bindPopup("Relief Camp: " + c.name);

        });

    });


// ---------------- MAP CLICK EVENT ----------------

map.on("click", function (e) {

    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    handleEmergency(lat, lon);

});


// ---------------- EMERGENCY FUNCTION ----------------

function handleEmergency(lat, lon) {

    const disasterType =
        document.getElementById("type").value;

    const severity =
        document.getElementById("severity").value;

    fetch("/emergency", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            latitude: lat,
            longitude: lon,
            disaster: disasterType,
            severity: severity

        })

    })

        .then(res => res.json())

        .then(data => {

            console.log(data);



            // ---------------- TOTAL EMERGENCIES COUNTER ----------------

            let totalElement =
                document.getElementById("total");

            let currentTotal =
                parseInt(totalElement.innerText);

            totalElement.innerText =
                currentTotal + 1;
            // ---------------- DISASTER COUNTERS ----------------

            if (severity === "High") {

                let high =
                    document.getElementById("highCount");

                high.innerText =
                    parseInt(high.innerText) + 1;
            }

            if (disasterType === "Flood") {

                let flood =
                    document.getElementById("floodCount");

                flood.innerText =
                    parseInt(flood.innerText) + 1;
            }

            if (disasterType === "Fire") {

                let fire =
                    document.getElementById("fireCount");

                fire.innerText =
                    parseInt(fire.innerText) + 1;
            }

            if (disasterType === "Cyclone") {

                let cyclone =
                    document.getElementById("cycloneCount");

                cyclone.innerText =
                    parseInt(cyclone.innerText) + 1;
            }

            if (disasterType === "Road Accident") {

                let accident =
                    document.getElementById("accidentCount");

                accident.innerText =
                    parseInt(accident.innerText) + 1;
            }


            // ---------------- USER LOCATION ----------------

            L.circleMarker([lat, lon], {

                radius: 10,
                color: "red",
                fillColor: "red",
                fillOpacity: 1

            })
                .addTo(emergencyLayerGroup)
                .bindPopup("Emergency Location")
                .openPopup();


            // ---------------- MOVING AMBULANCE ----------------

            if (data.ambulance_route) {
                L.polyline(

                    data.ambulance_route,

                    {
                        color: "green",
                        weight: 5
                    }

                ).addTo(emergencyLayerGroup);

                let ambulanceMarker = L.marker(

                    data.ambulance_route[0],

                    {
                        icon: ambulanceIcon
                    }

                ).addTo(emergencyLayerGroup);

                let index = 0;

                let moveAmbulance = setInterval(() => {

                    index++;

                    if (index >= data.ambulance_route.length) {

                        clearInterval(moveAmbulance);

                        return;
                    }

                    ambulanceMarker.setLatLng(

                        data.ambulance_route[index]

                    );

                }, 100);

            }


            // ---------------- HOSPITAL ----------------

            if (data.hospital) {

                L.marker(data.hospital.location)
                    .addTo(map)
                    .bindPopup("Nearest Hospital");

            }

            if (data.hospital_route) {

                L.polyline(
                    data.hospital_route,
                    {
                        color: "blue",
                        weight: 5
                    }
                ).addTo(emergencyLayerGroup);

            }


            // ---------------- FIRE STATION ----------------

            if (data.firestation) {

                L.marker(data.firestation.location)
                    .addTo(map)
                    .bindPopup("Nearest Fire Station");

            }

            if (data.firestation_route) {

                L.polyline(
                    data.firestation_route,
                    {
                        color: "orange",
                        weight: 5
                    }
                ).addTo(emergencyLayerGroup);
            }


            // ---------------- POLICE ----------------

            if (data.police) {

                L.marker(data.police.location)
                    .addTo(map)
                    .bindPopup("Nearest Police");

            }

            if (data.police_route) {

                L.polyline(
                    data.police_route,
                    {
                        color: "black",
                        weight: 5
                    }
                ).addTo(emergencyLayerGroup);
            }


            // ---------------- RELIEF CAMP ----------------

            if (data.relief_camp) {

                L.marker(data.relief_camp.location)
                    .addTo(map)
                    .bindPopup("Nearest Relief Camp");

            }

            if (data.relief_camp_route) {

                L.polyline(
                    data.relief_camp_route,
                    {
                        color: "purple",
                        weight: 5
                    }
                ).addTo(emergencyLayerGroup);

            }

        })

        .catch(error => {

            console.log(error);

        });

}


// ---------------- CURRENT LOCATION EMERGENCY ----------------

function sendCurrentLocation() {

    // Check browser support
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Move map to user location
                map.setView([lat, lon], 13);

                // Show current location
                L.circleMarker([lat, lon], {

                    radius: 10,
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 1

                })
                    .addTo(map)
                    .bindPopup("Your Current Location")
                    .openPopup();

                // Trigger emergency system
                handleEmergency(lat, lon);

            },

            function (error) {

                alert("Location access denied!");

            }

        );

    } else {

        alert("Geolocation is not supported.");

    }

}