$(function () {
    var narrativeMaps;
    var main = function () {
        //Need to initialize the first visualization
        async.waterfall([function (callback) {
            initializeNarrativeMaps(callback);
        }, function (callback) {
            /**
             * This function is used to update the paintings
             */
            $.ajax({
                url: '/herberger/getPaintings.php',
                method: 'GET',
                success: function (data) {
                    data = JSON.parse(data);
                    allPaintingsSelectBox(data.data);
                    callback();
                },
                error: function (error) {
                    callback();
                }
            })
        }, function (callback) {
            // Thes functions will setup the replicas
            setReplicasForNarratives();
            callback();
        }, function (callback) {
            setupPaintingsTab();
            callback();

        }, function (callback) {
            /**
             * The final touches that need to happen
             */
            $('#narrativePaintingPicker').change(function () {
                setReplicasForNarratives();
            });
            $('#narrativeReplicaPicker').change(function () {
                updateReplicaInfo();
            });
            startNetorkSimulation()
            callback();
        }], function (error, data) {
        });

        function allPaintingsSelectBox(data) {
            var array = Array('narrativePaintingPicker', 'paintingsPaintingPicker', 'comparisonPaintingPicker', 'networkPaintingPicker');
            for (i in array) {
                for (j in data) {
                    if (data[j] != '.' && data[j] != '..') {
                        $('#' + array[i]).append($('<option>', {
                            value: data[j],
                            text: data[j]
                        }));
                    }
                }
            }
        }

        /********************************************************************************
         * Code specifically for narratives tab*******************************************
         *********************************************************************************/
        /*****************************************
         * This function updates on narratives tab
         * for replica
         ****************************************/
            //Some global variables needed for narratives

        var narrativeMarkers = [];
        var narrativePolyLine = [];
        var narrativeDecorator = [];
        var narrativeLatLngs = [];
        var ownerInfo = [];
        var ownerCounter = [];
        var setReplicasForNarratives = function (paintingName = $('#narrativePaintingPicker').val()) {
            async.waterfall([function (callback) {
                var locationToUpdate = 'narrativeReplicaPicker';
                $.ajax({
                    url: '/herberger/getReplicaNames.php',
                    method: 'GET',
                    data: {
                        name: paintingName
                    },
                    success: function (data) {
                        data = JSON.parse(data);
                        data = data['data'];
                        $('#' + locationToUpdate).find('option').remove()
                        for (var i = 0; i < data.length; i++) {
                            if (data[i] != '.' && data[i] != '..') {
                                $('#' + locationToUpdate).append($('<option>', {
                                    value: data[i],
                                    text: data[i]
                                }));
                            }
                        }
                        callback();
                    },
                    error: function (data) {
                        callback(data);
                    }
                })
            }, function (callback) {
                updateReplicaInfo($('#narrativePaintingPicker').val(), $('#narrativeReplicaPicker').val(), callback);
            }, function (callback) {
                callback();
            }], function (error, data) {
            })
        };
        /********************************************
         * This function will update the replica info
         * on the narratives tab
         *******************************************/
        var updateReplicaInfo = function (paintingName = $('#narrativePaintingPicker').val(), paintingReplica = $('#narrativeReplicaPicker').val(), callback = null) {
            $.ajax({
                data: {
                    paintingName: paintingName,
                    paintingReplica: paintingReplica
                },
                method: 'GET',
                url: '/herberger/getReplicaInfo.php',
                success: function (data) {
                    data = JSON.parse(data);
                    if (data['data']) {
                        $("#narrativesImage").attr("src", data['data']['image']);
                        for (var iter = 0; iter < narrativeMarkers.length; iter++) {
                            narrativeMaps.removeLayer(narrativeMarkers[iter]);
                        }
                        narrativeMaps.removeLayer(narrativePolyLine);
                        narrativeMaps.removeLayer(narrativeDecorator);
                        narrativeMarkers = [];
                        narrativeLatLngs = [];
                        // $("#narrativesOwnerImage").attr("src", data['data']['csvData'][0]['image']);
                        ownerInfo = data['data']['csvData'];
                        ownerCounter = 0;
                        var year = data['data']['csvData'][data['data']['csvData'].length - 1]['YEAR'];
                        $('#narrativeYear').html('Year: ' + year);
                        var medium = data['data']['csvData'][data['data']['csvData'].length - 1]['MEDIUM'];
                        $('#narrativeMedium').html('Medium: ' + medium);
                        var size = data['data']['csvData'][data['data']['csvData'].length - 1][' SIZE Height (in)'];
                        $('#narrativeHeight').html('Height(in): ' + size);
                        var location = data['data']['csvData'][data['data']['csvData'].length - 1]['owner_LOC'];
                        $('#narrativePlace').html('Place: ' + location);
                        for (var iter = 0; iter < data['data']['csvData'].length; iter++) {
                            if (data['data']['csvData'][iter]['LAT'] == '51.068787') {
                                data['data']['csvData'][iter]['LAT'] = parseFloat('51.068787')

                            }

                            var tempMarker = L.marker([parseFloat(data['data']['csvData'][iter]['LAT']), parseFloat(data['data']['csvData'][iter]['LONG'])], 5000);
                            var icon = tempMarker.options.icon;
                            icon.options.iconSize = [27, 41]
                            icon.options.iconUrl = 'marker.png'
                            icon.options.shadowUrl = null
                            tempMarker.setIcon(icon);
                            tempMarker.addTo(narrativeMaps);
                            tempMarker.bindPopup(data['data']['csvData'][iter]['owner_LOC']);
                            narrativeMarkers.push(tempMarker);
                            narrativeLatLngs.push([parseFloat(data['data']['csvData'][iter]['LAT']), parseFloat(data['data']['csvData'][iter]['LONG'])])
                        }
                        group = new L.featureGroup(narrativeMarkers);
                        narrativeMaps.fitBounds(group.getBounds());
                        setTimeout(function () {
                            narrativeMaps.setZoom(narrativeMaps.getZoom() - 1);
                        }, 300)
                        narrativePolyLine = L.polyline(narrativeLatLngs, {}).addTo(narrativeMaps);
                        narrativeDecorator = L.polylineDecorator(narrativePolyLine, {
                            patterns: [{
                                offset: 25,
                                repeat: 50,
                                symbol: L.Symbol.arrowHead({
                                    pixelSize: 15,
                                    pathOptions: {
                                        fillOpacity: 1,
                                        weight: 0
                                    }
                                })
                            }]
                        }).addTo(narrativeMaps);
                        moveOwnerCounter()
                    }
                    if (callback) {
                        callback();
                    }
                },
                error: function (data) {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        };
        $('#forwardOwner').on('click', function () {
            moveOwnerCounter(1);
        });
        $('#backwardOwner').on('click', function () {
            moveOwnerCounter(-1);
        });

        function moveOwnerCounter(move = 0) {
            if (!ownerInfo) {
                return;
            }
            ownerCounter = ((ownerCounter + move) + ownerInfo.length) % ownerInfo.length;
            data = ownerInfo[ownerCounter];
            $('#narrativesOwnerImage').attr('src', data['image']);
            $('#narrativeAboutOwner').html(data['about']);
            $('#narrativeOwnerName').html(mappingName(data['OWNER']));
            $('#narrativeOwnerLocation').html(data['owner_LOC']);
            $('#narrativeOwnerNumber').html(data['OWNER #']);
            $('#narrativeOwnerProfession').html(data['owner_PROF']);
        }

        /********************************************
         * This function will initialize the narrative
         * maps whenever required. This is hard reset.
         * Maybe in later phases you can do soft rest.
         *********************************************/
        function initializeNarrativeMaps(callback) {
            setTimeout(function () {
                $('#narrativeMaps').height(430);
                narrativeMaps = L.map('narrativeMaps', {
                    maxZoom: 22
                }).setView([38.134556577054134, -48.51562500000001], 3);
                narratives_layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                });
                narratives_layer.addTo(narrativeMaps);
                callback();
            }, 500);
        }
    };
    main();
    $('#visuals_call').on('click', function () {
        // narrativeMaps.removeLayer(narratives_layer);
        setTimeout(function () {
            // narratives_layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(narrativeMaps);

            narrativeMaps.invalidateSize()
            narrativeMaps.fitBounds(group.getBounds())

        }, 500)
    });
});

function toggleInstruction(id) {
    var data = {
        'instruction1': {
            'title': 'Narratives: Replicas, Owners, Locations',
            'content': '“Narratives" tab contains maps of the trajectories of each replica along with images of owners of each replica and brief information about each owner. Some of the replicas\' trajectories were transcontinental; others stayed in Britain either in London or in provincial museums. In most cases the first version stayed in London.  The slideshow arrows on the lower right panel can be used to move chronologically from one owner to another.   Each replica also has an ID number: 123_04, means the 4th version of that subject. The 123 number is the number assigned the subject and is based on early numbers of all of Rossetti\'s replicas and is retained here as we plan to include more replicas as we extend this project. The maps can be enlarged by moving the mouse zoom and can be moved left to right by dragging. There is a dropdown menu of painting titles at the top of the page.'
        },
        'instruction2': {
            'title': 'Trajectory Comparisons',
            'content': '“Trajectory Comparisons" shows multiple maps to compare different trajectories and locations for each replica of each set that traveled within Britain or abroad. Users can zoom on the individual maps. There is a dropdown menu of painting titles on the upper right. We used Leaflet.js to create a thumbnail map visualization for every replica of a painting for each set of replicas. For private owners whose identity remains unknown we located them off shore for now; updated checks on auction house online sites, Sotheby\'s or Christie\'s, occasionally turn up the sale of a privately owned work and list its price, but not always its new owner\'s name, profession or location.  As we find out these things, we will adjust new owners\' professions, locations and prices and add images to our project.'
        },
        'instruction3': {
            'title': 'Image Comparisons',
            'content': '“Image Comparisons" offers a gallery of the replicas of each set by painting title so users can compare and contrast all replicas in a single set. This is a manual visual comparison. We added meta-information including replica ID number, year, medium, height (in.), final location, final owner. To build this, we used plain Javascript and Bootstrap.'
        },
        'instruction4': {
            'title': 'Collection Browser',
            'content': '"Collection Browser": Filters for searches include titles, replica IDs, owners, owners\' professions, owners\' locations, a number indicating the chronology of the replicas, e.g., 123_04, means the 4th version of that subject.  When a title and ID are selected, the other options related to that selection appear automatically.  When the user returns to the Collection Browser, previous choices are removed by selecting ADVANCE FILTERS which returns users to the search menu; then users must click RESET to clear the previous choices and then click APPLY to search again.  Other uses include searching among the owners or among the professions, to find all lawyers who owned replicas, for example, or all the replicas owned by Frederick Leyland, for example.'
        },
        'instruction5': {
            'title': 'Histograms',
            'content': '"Histograms": With this visualization, you can explore statistical information about different replicas. Each vertical displays the number of replicas in a replica set (defined by paintings sharing a subject). The legend is color coded for locations or total count of replicas in each set.  If users click on a legend, it will remove/add that color/location to compare with other locations or isolate information about other locations.'
        },
        'instruction6': {
            'title': 'Transaction Network',
            'content': '“Transaction Network": This page is interactive. Users can zoom to enlarge or reduce the network. Categories of owners are marked by color. Nodes for museums and non-commercial galleries are blue; auction houses, commercial galleries and dealers are red; and individual collectors are yellow. Owners involved in multiple transaction have a larger node size. Users can filter out the nodes of any category to focus on the other category(ies) of owners. Users can also hover on a node to see the owner\'s name and that owner\'s transactions. Users can pick a title from the dropdown menu on the upper right to find a particular replica\'s transactions and by hovering over the nodes, the owner\'s names will appear for that set of transactions. <br><br>' +
                'The slide with dates is also interactive.  Years can be moved and to focus on a snapshot of a single year, users can overlap the sliders to find the one year users wish to examine.  When  checking a date or span of year, users will see owners and transactions for the replica selected or for the "all" selection for all the replicas. In some years there is only the owner without a transaction; to find more complete transactions, users should explore a range of years. <br><br>' +
                'Some owners owned multiple versions of several replicas and crossed or combined more than one owner network with their ownerships. This idea prompted us to look into a transactional system of the paintings, so we formalized some parameters We decided to build a Network graph using D3.js. With this slider, a user could view which owner was more active in which time period. With that in mind, we used D3.js and Jquery to build an excellent view of a transactional network. Another feature we added to this visualization was the projection feature on particular paintings and a specific replica of a painting. Once a painting or replica ID is selected, the network will display only the network for that painting or replica. With this feature, a user can look at a specific transactional network for a particulate replica.'
        },
        'instruction7': {
            'title': '"Transaction Chord Flow Diagrams"',
            'content': '"Transaction Chord Flow Diagrams" complement the Transaction Network; in the Transaction Network the quantity of transactions per person or institution is indicated by node size. In the Transaction Chord Flow Diagrams, which are separated by time periods, we can see who has been relatively most active in transactions in a given period of time. It is helpful to compare the same of years in the Transaction Network and the Transaction Chord Flow Diagrams.<br><br>' +
                'These chord flow diagrams help visualize the traffic of replicas among owners.  We have broken the data down into several ranges of years.  Each diagram for each range of years has chords anchored along the circumference or curved outer edge. The anchors of the chords are color-coded to match the category of recipient owner: auction house/dealer (red), museums/permanent galleries (blue), individual collectors (yellow).  The size of each bundle of chords anchored together indicates the relative number of transactions by that owner. Clockwise the chords first designate dealers/auction houses in red, then museums in blue, then individual owners in yellow.<br><br>' +
                'The chords comprise of anchor points and ribbons which are strands that link owners to one another within and across the circle, going from the seller or source of the transaction to the buyer/recipient of the replica being transmitted. Users can hover over a ribbon to see a sentence briefly describing the transaction. Some of the ribbons are thin or very close together, so when you move your mouse to hover over a ribbon, be careful about which ribbon you are hovering over; we have added a highlighting effect to help users see the ribbon they are looking for and to help users navigate the diagram.<br><br>' +
                'Ribbons are colored to match the recipient; the cords are colored to match the seller. By comparing diagrams with one another, users can observe tendencies in the overall volume and variety of those who dealt with the replicas we have on record. For example, in several diagrams, if we inspect Charles Fairfax Murray’s chords and ribbons, we can observe how much he dominated the market of both primary and secondary sales of Rossetti\'s replicas and the kinds of owners to whom he usually sold replicas.  As you browse along the edge, you can consider what kind of entity received the replica and what kind of entity sold or transmitted the replica.'
        }

    };
    $('#instructionTitle').text(data[id]['title']);
    $('#instructions').html(data[id]['content']);
    $('#chordModal').modal('toggle');
}

function getThisOut(name) {
    $('#' + name).click()
}
