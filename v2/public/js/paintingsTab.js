function setupPaintingsTab() {
    var paintingName = $('#paintingsPaintingPicker').val();
    $.ajax({
        method: 'get',
        url: '/herberger/getPaintingImages.php?name=' + paintingName,
        success: function (data) {
            data = JSON.parse(data);
            var temp = 0
            var keys = Object.keys(data['replicaData']);
            var htmlString = '';
            for (i in data['data']) {
                if (data['replicaData'][keys[i]]['location'].toLowerCase() == 'off coast' || data['replicaData'][keys[i]]['location'].toLowerCase() == 'offcoast')
                    data['replicaData'][keys[i]]['location'] = 'Private Collection';

                if (temp == 0) {
                    htmlString += '<div style="clear:both;" class="col-sm-12 col-12 col-md-4 col-xl-4 col-lg-4 card paintingCard">'
                }

                else {
                    htmlString += '<div class="col-sm-12 col-12 col-md-4 col-xl-4 col-lg-4 card paintingCard">'

                }
                htmlString += '<img class="card-img-top" src="' + data['data'][i] + '" alt="Card image cap" style="width: 100%;">' +

                    '<div class="card-body">' +

                    '<h5 class="card-title paintingCardInfo">' + keys[i] + '</h5>' +
                    '<hr>' +
                    '<div class="row">' +
                    '<div class="col-sm-12 col-12 col-md-12 col-xl-12 col-lg-12 paintingCardInfo paintingCardInfoDiv">Year: ' + data['replicaData'][keys[i]]['year'] + '</div>' +
                    '<div class="col-sm-12 col-12 col-md-12 col-xl-12 col-lg-12 paintingCardInfo paintingCardInfoDiv">Medium: ' + data['replicaData'][keys[i]]['medium'] + '</div>' +
                    '<div class="col-sm-12 col-12 col-md-12 col-xl-12 col-lg-12 paintingCardInfo paintingCardInfoDiv">Height(in.): ' + data['replicaData'][keys[i]]['size'] + '</div>' +
                    '<div class="col-sm-12 col-12 col-md-12 col-xl-12 col-lg-12 paintingCardInfo paintingCardInfoDiv">Location: ' + data['replicaData'][keys[i]]['location'] + '</div>' +
                    '<div class="col-sm-12 col-12 col-md-12 col-xl-12 col-lg-12 paintingCardInfo paintingCardInfoDiv">Owner: ' + data['replicaData'][keys[i]]['owner'] + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                temp = (temp + 1) % 3
            }
            $('#paintingsDisplay').html(htmlString)

        }
    });
}
