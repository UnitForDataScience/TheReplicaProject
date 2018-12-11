$(function () {
    var toogle = false;
    $('#comparison-tab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
        setTimeout(function () {
            updateComparisonChart();
        }, 100);

    });
    $('#comparisonPaintingPicker').on('change', function () {
        setTimeout(function () {
            updateComparisonChart();
        }, 100);
    });

    function updateComparisonChart() {
        var paintingName = $('#comparisonPaintingPicker').val();
        $('#comparisonDisplay').html('');
        $.ajax({
            url: '/herberger/getComparisonNetwork.php?name=' + paintingName,
            method: 'GET',
            success: function (data) {
                data = JSON.parse(data)

                async.waterfall([function (callback) {
                    var temp = 0;

                    for (iter in data['data']) {

                        $('#comparisonDisplay').append("<div class='col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 card paintingCard' style='margin-top:1%;" + (temp % 3 == 0 ? "clear:both;" : "") + "'>" +
                            "<div class='card-img-top' style='height:300px;border:1px solid;' id=" + iter + "></div>" +
                            "<div class=\"card-body\">" +
                            '<h5 class="card-title paintingCardInfo">' + iter + '</h5>' +
                            '<hr>' +
                            '<div class="row">' +
                            '<div class="col-sm-12 col-12 col-md-12 col-xl-12 col-lg-12 paintingCardInfo paintingCardInfoDiv">Year: ' + data['data'][iter][0][2] + '</div>' +
                            '<div class="col-sm-12 col-12 col-md-12 col-xl-12 col-lg-12 paintingCardInfo paintingCardInfoDiv">Medium: ' + data['data'][iter][0][3] + '</div>' +
                            '<div class="col-sm-12 col-12 col-md-12 col-xl-12 col-lg-12 paintingCardInfo paintingCardInfoDiv">Height(in.): ' + data['data'][iter][0][4] + '</div>' +
                            '</div>' +
                            "</div>" +
                            "</div>");
                        temp++
                    }
                    setTimeout(function () {
                        callback();
                    }, 100);

                }, function (callback) {
                    for (iter in data['data']) {
                        var tempMap = L.map(iter).setView([38.134556577054134, -48.51562500000001], 1);
                        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(tempMap);
                        var markers = L.markerClusterGroup({
                            chunkedLoading: true,
                            maxClusterRadius: 0.1
                        });
                        var group = [];
                        for (i in data['data'][iter]) {
                            var num1 = parseFloat(data['data'][iter][i][1]);
                            var num = parseFloat(data['data'][iter][i][0]);

                            // if (isNaN(num)) {
                            //
                            //     num = 51.068787;
                            // }
                            var marker = L.marker(L.latLng(num, num1));
                            marker.bindPopup(data['data'][iter][i][5]);
                            tempMap.addLayer(marker);
                            group.push(marker);
                        }
                        group = new L.featureGroup(group);
                        tempMap.fitBounds(group.getBounds());
                        //tempMap.addLayer(markers);
                    }
                    callback();
                }], function (error, data) {
                    console.log(error);
                })


            }
        });
    }


});

