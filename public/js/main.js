
var map;
var markers = [];
var currentIndex = -1;
var moveAmongMarkers = function() {
    console.log('here')
    if (markers.length > 1) {
        if (currentIndex != -1)
            markers[currentIndex].popupclose();
        currentIndex = (currentIndex + 1) % markers.length;
        markers[currentIndex].popupopen()
    } else if (markers.length == 1 && currentIndex == -1) {
        currentIndex = (currentIndex + 1) % markers.length;
        markers[currentIndex].popupopen()
    }
};
var markersInterval;
$(document).ready(function() {
    map = L.map('map').setView([38.134556577054134, -48.51562500000001], 3);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // L.marker([51.5, -0.09]).addTo(map)
    //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //   .openPopup();
    $.ajax({
        type: "GET",
        url: "/public/data/BeataBeatrix.csv",
        dataType: "text",
        success: function(data) {
            data = processCSVData(data)
            pointList = []
            for (iter in data) {
                if (data[iter]['"REPLICA_ID"'] == '"101_04"') {
                    markers.push(L.marker([parseFloat(data[iter]['"LAT"']), parseFloat(data[iter]['"LONG"'])]).bindPopup("<div style='width:600px'><img src='/public/images/Charles.jpg''></img><br>Charles Lawrence Hutchinson (1854-1924) was a prominent Chicago business leader and philanthropist best remembered as the founding and long-time president of the Art Institute of Chicago. After high school in 1872 he became a clerk in his father&#39;s office, B. P. Hutchinson and Son. Although he never attended college, he was a founding trustee and first treasurer of the University of Chicago. Because of his contributions to philanthropy, art and education, Hutchinson was awarded honorary degrees, a Master of Arts in 1901, an LL. D in 1920, and an honorary Master of Arts degree by Harvard University in 1915. For serving as consul general for Greece in Chicago, Hutchinson was awarded the Badge of the Order of the Redeemer by King George I of Greece in 1908; he was knighted by King Albert I of Belgium in 1919 for his work with the Belgian Relief Committee during World War I. He supported the founding of the League of Nations. Hutchinson served as Chair, Committee of Fine Arts, for Chicago’s Columbian Exposition of 1893. He purchased Rossetti’s Beata Beatrix (oil, 1972) in 1886 at the William Graham sale.</div>", {
                        maxWidth: 'auto'
                    }).addTo(map))
                    pointList.push(new L.LatLng(parseFloat(data[iter]['"LAT"']), parseFloat(data[iter]['"LONG"'])))
                }
            }
            var firstpolyline = new L.Polyline(pointList, {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
            firstpolyline.addTo(map);
            markersInterval = setInterval(moveAmongMarkers, 1000)
        },
        error: function(data) {
            console.log(data)
        }
    })
});

function processCSVData(data) {
    lines = data.split("\n")
    var newData = []
    var headers = lines[0].split(",")
    for (i = 1; i < lines.length - 1; i++) {
        objectSetup = {}
        temp = lines[i].split(",")
        for (j = 0; j < headers.length; j++) {
            objectSetup[headers[j]] = temp[j]
        }
        newData.push(objectSetup)
    }
    return newData
}