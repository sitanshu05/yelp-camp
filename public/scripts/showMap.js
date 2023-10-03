mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: JSON.parse(center), // starting position [lng, lat]
    zoom: 13, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl())


new mapboxgl.Marker()
    .setLngLat(JSON.parse(center))
    .setPopup(
        new mapboxgl.Popup({offset : 25})
        .setHTML(
            `<h3>${title}</h3>`
        )
    )
    .addTo(map)