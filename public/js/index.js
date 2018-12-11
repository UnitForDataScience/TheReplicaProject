var narrativeMaps;
$(function () {
    $("#time-slider").slider({
        range: true,
        min: 1850,
        max: 1930,
        values: [1850, 1930],
        step: 1,
        slide: function (event, ui) {
            $(ui.handle).text(ui.values[ui.handleIndex])
            $(ui.handle).css({
                "width": "3%",
                "text-align": "center",
                "height": "22"
            });
            $('#range-slider').html(ui.values[0] + " - " + ui.values[1]);
        },
        stop: function (event, ui) {
            if ($('#socialNetworkPicker').val() == 'All') {
                drawSocialNetwork()
            } else {
                drawSocialNetworkPainting()
            }
        }
    });
    var handles = $('#time-slider').find('.ui-slider-handle')
    console.log(handles)
    $(handles[0]).text(1850)
    $(handles[1]).text(1930)
    $(handles[0]).css({
        "width": "3%",
        "text-align": "center",
        "height": "22",
        "display": "inline-table"
    })
    $(handles[1]).css({
        "width": "3%",
        "text-align": "center",
        "display": "inline-table",
        "height": "22"
    })
    /**************************************************
     * This will be the top level execution of the code.
     * Don't declare anything public in the js file as
     * this will create problems.
     *************************************************/
    $('#VisaulTabs').tabs({
        activate: function (event, ui) {
            if (ui.newPanel.attr('id') == 'tabs-3') {
                drawComparisonNetwork();
            }
        }
    });
    $('#narrativeMaps').height(450);
    narrativeMaps = L.map('narrativeMaps').setView([38.134556577054134, -48.51562500000001], 3);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(narrativeMaps);
    $.ajax({
        url: '/herberger/getPaintings.php',
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            for (iter in data['data']) {
                if (data['data'][iter] != '..' && data['data'][iter] != '.') {
                    $('#paintingsPicker').append($('<option>', {
                        value: data['data'][iter],
                        text: data['data'][iter]
                    }));
                    // $('#socialPaintingPicker').append($('<option>', {
                    //     value: data['data'][iter],
                    //     text: data['data'][iter]
                    // }));
                    $('#comparisonNewtworkPicker').append($('<option>', {
                        value: data['data'][iter],
                        text: data['data'][iter]
                    }));
                    $('#socialNetworkPicker').append($('<option>', {
                        value: data['data'][iter],
                        text: data['data'][iter]
                    }));
                    $('#paintingNetworkPicker').append($('<option>', {
                        value: data['data'][iter],
                        text: data['data'][iter]
                    }));
                }
            }
            updateReplicas();
            drawSocialNetwork();
            drawPaintingImages();
        },
        error: function (error) {
            console.log('Some error occured');
        }
    })
});

function drawPaintingImages() {
    $('#paintingNetworkContainer').html('');
    $.ajax({
        url: '/herberger/getPaintingImages.php?name=' + $('#paintingNetworkPicker').val(),
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            var temp = 0
            var keys = Object.keys(data['replicaData'])
            console.log(keys);
            for (i in data['data']) {
                if (data['replicaData'][keys[i]]['location'].toLowerCase() == 'off coast' || data['replicaData'][keys[i]]['location'].toLowerCase() == 'offcoast')
                    data['replicaData'][keys[i]]['location'] = 'Private Collection';
                if (temp == 0)
                    $('#paintingNetworkContainer').append('<div class="col-md-4 col-sm-4" style="clear:both;margin-top: 8%;"><image src="' + data['data'][i] + '" ' + (imagesToReduce(data['data'][i]) ? '' : 'style="max-height:400px;"') + ' class="col-md-12 col-sm-12" text="Image Not Found"/><div class="col-md-12"><div class="col-md-12">Replica Id: ' + keys[i] + '</div><div class="col-md-12" style="clear:both;">Year: ' + data['replicaData'][keys[i]]['year'] + '</div><div class="col-md-12" style="clear:both;">Medium: ' + data['replicaData'][keys[i]]['medium'] + '</div><div class="col-md-12" style="clear:both;">Height(in.): ' + data['replicaData'][keys[i]]['size'] + '</div><div class="col-md-12" style="clear:both;">Location: ' + data['replicaData'][keys[i]]['location'] + '</div><div class="col-md-12" style="clear:both;">Owner: ' + data['replicaData'][keys[i]]['owner'] + '</div></div></div>')
                else {

                    var imageString = '<div class="col-md-4 col-sm-4" style="margin-top: 8%;"><image src="' + data['data'][i] + '" ' + (imagesToReduce(data['data'][i]) ? '' : 'style="max-height:400px;"') + ' class="col-md-12 col-sm-12" text="Image Not Found"/><div class="col-md-12"><div class="col-md-12">Replica Id: ' + keys[i] + '</div><div class="col-md-12" style="clear:both;">Year: ' + data['replicaData'][keys[i]]['year'] + '</div><div class="col-md-12" style="clear:both;">Medium: ' + data['replicaData'][keys[i]]['medium'] + '</div><div class="col-md-12" style="clear:both;">Height(in.): ' + data['replicaData'][keys[i]]['size'] + '</div><div class="col-md-12" style="clear:both;">Location: ' + data['replicaData'][keys[i]]['location'] + '</div><div class="col-md-12" style="clear:both;">Owner: ' + data['replicaData'][keys[i]]['owner'] + '</div></div></div>';

                    $('#paintingNetworkContainer').append(imageString)
                }
                temp = (temp + 1) % 3
            }
        },
        error: function (data) {
        }
    })
}

function imagesToReduce(url) {
    var array = Array("109_02", "127_04", "127_05", "123_03", "123_04");
    for (jth in array) {
        if (url.indexOf(array[jth]) != -1) {
            return false
        }
    }
    return true
}

function drawComparisonNetwork() {
    $('#ComparisonNetworkContainer').html('');
    $.ajax({
        url: '/herberger/getComparisonNetwork.php?name=' + $('#comparisonNewtworkPicker').val(),
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            async.waterfall([function (callback) {
                var temp = 0;
                for (iter in data['data']) {

                    $('#ComparisonNetworkContainer').append("<div class='col-md-4' style='margin-top:1%;" + (temp % 3 == 0 ? "clear:both;" : "") + "'><div class='col-md-12' style='height:300;border:1px solid;' id=" + iter + "></div><div class='col-md-12'>Replica ID: " + iter + "</div><div class = 'col-md-12' style='clear:both;'>Year: " + data['data'][iter][0][2] + "</div><div class = 'col-md-12' style='clear:both;'>Medium: " + data['data'][iter][0][3] + "</div><div class = 'col-md-12' style='clear:both;'>Height(in.): " + data['data'][iter][0][4] + "</div></div>")
                    temp++
                }
                setTimeout(function () {
                    callback();
                }, 2);

            }, function (callback) {
                for (iter in data['data']) {
                    var tempMap = L.map(iter).setView([38.134556577054134, -48.51562500000001], 1);
                    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(tempMap);
                    var markers = L.markerClusterGroup({
                        chunkedLoading: true,
                        maxClusterRadius: 5
                    });
                    var group = [];
                    for (i in data['data'][iter]) {
                        var marker = L.marker(L.latLng(data['data'][iter][i][0], data['data'][iter][i][1]));
                        markers.addLayer(marker);
                        group.push(marker);
                    }
                    group = new L.featureGroup(group);
                    tempMap.fitBounds(group.getBounds());
                    tempMap.addLayer(markers);
                }
                callback();
            }], function (error, data) {
                console.log(error);
            })
        },
        error: function (data) {
            console.log(data);
        }
    })
}

function inNodeSimulation() {
    node.attr('r', function (d) {

        return inNodeScale(parseInt(d.InNode));

    })
}

function outNodeSimulation() {
    node.attr('r', function (d) {

        return outNodeScale(parseInt(d.OutNode));

    })
}

function maxTotalSimulation() {
    node.attr('r', function (d) {
        return maxTotalScale(parseInt(((d.InNode ? d.InNode : 0) + (d.OutNode ? d.OutNode : 0))));
    })
}

function drawSocialNetworkChange() {
    $('#socialReplicaPicker')
        .find('option')
        .remove()
    $('#socialReplicaPicker').append($('<option>', {
        value: 'All',
        text: 'All'
    }));
    $('#socialReplicaPicker').selectpicker('refresh')
    if ($('#socialNetworkPicker').val() == 'All') {
        drawSocialNetwork()
    } else {
        drawSocialNetworkPainting()
    }
}

function giveColorOnName(name) {
    var museum = ["Art Institute of Chicago",
        "Ashmoleon Museum",
        "Barbican House",
        "Birmingham City Museum",
        "Boston Museum of Fine Arts",
        "Delaware Art Museum",
        "Dowdeswell Gallery",
        "Dundee City Museum",
        "Farringdon Collection Trustees",
        "Fitzwilliam Museum",
        "Fogg",
        "Frances Loeb Art Center",
        "Harry Ransom Center",
        "Birmingham Museum",
        "Johannesburg Art Gallery",
        "Metropolitan Museum",
        "Metropolitan Museum of Art ",
        "National Gallery of South Australia",
        "Lady Lever Gallery",
        "Musee des Beaux Arts",
        "National Gallery of Scotland",
        "National Gallery of So. Australia",
        "National Museum of Western Art",
        "Rochester Gallery",
        "Russell-Cotes Gallery",
        "Tate Museum",
        "Bradford Art Gallery",
        "Whitworth Art Gallery",
        "Walker Art Gallery",
        "William Morris Gallery"];
    var dealer = ["Charles Fairfax Murray",
        "Agnew",
        "Christies",
        "Coats Gallery",
        "Ephron Galleries",
        "Leger Galleries",
        "LeFevre Gallery",
        "Sothebys",
        "Knoedler",
        "Robson and Co",
        "William Walker Sampson",
        "Croal Thompson",
        "Leggett Brothers",
        "David Hughes",
        "Ernest Gambit",
        "Tarat Auction Rooms",
        "Leicester Galleries",
        "Chichibu-Shokai",
        "Gooden and Fox",
        "Dunthorne",
        "Murray",
        "Agnew",
        "Chichibu Shokai",
        "C A Howell and Parsons",
        "Stone Gallery"];
    if (name)
        for (iter in museum) {
            if (museum[iter].toLowerCase() == name.toLowerCase())
                return "blue"
        }
    if (name)
        for (iter in dealer) {
            if (dealer[iter].toLowerCase() == name.toLowerCase()) {
                return "red"
            }
        }
    return "yellow"
}

function paintingChangeSocialNetwork() {
    $('#socialReplicaPicker')
        .find('option')
        .remove()
    $('#socialReplicaPicker').append($('<option>', {
        value: 'All',
        text: 'All'
    }));
    drawSocialNetworkPainting();
}

function drawSocialNetworkPainting() {
    $('#SocialNetworkSVG').html('')
    var values = $('#time-slider').slider("option", "values");
    $.ajax({
        method: 'GET',
        url: '/herberger/getSocialNetworkData.php?name=' + $('#socialNetworkPicker').val() + "&start=" + values[0] + "&end=" + values[1] + '&replicaName=' + $('#socialReplicaPicker').val(),
        success: function (data) {
            data = JSON.parse(data);
            console.log(data)
            console.log('here');
            var width = 960,
                height = 500;
            var svg = d3.select('#SocialNetworkSVG')
                .append('svg').attr('height', height)
                .attr('width', width);
            var radius = 15;
            svg.append("defs").append("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 20)
                .attr("refY", 0)
                .attr("markerWidth", 7)
                .attr("markerHeight", 7)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");
            inNodeScale = d3.scaleLinear()
                .domain([0, parseInt(data['data']['maxTotal'])])
                .range([3, 20]);

            outNodeScale = d3.scaleLinear()
                .domain([0, parseInt(data['data']['maxTotal'])])
                .range([3, 20]);
            maxTotalScale = d3.scaleLinear()
                .domain([0, parseInt(data['data']['maxTotal'])])
                .range([3, 20]);

            var nodes_data = data['data']['nodeData'],
                links_data = data['data']['linkData'];
            //set up the simulation and add forces
            var simulation = d3.forceSimulation()
                .nodes(nodes_data);
            var link_force = d3.forceLink(links_data)
                .id(function (d) {
                    return d.name;
                });
            var charge_force = d3.forceManyBody()
                .strength(-30);
            var center_force = d3.forceCenter((width - 10) / 2, (height - 10) / 2);
            simulation
                .force("charge_force", charge_force)
                .force("center_force", center_force)
                .force("links", link_force);
            //add encompassing group for the zoom
            g = svg.append("g")
                .attr("class", "everything");

            //This gives the link colour
            function linkColour(d) {
                return "black";
            }

            //draw lines for the links
            var link = g.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(links_data)
                .enter().append("line")
                .attr("stroke-width", 1)
                .attr("marker-end", "url(#arrow)")
                .style("stroke", linkColour);

            function circleColour(d) {
                return giveColorOnName(d.name)
            }

            tempNode = g.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes_data)
                .enter()
            node = tempNode.append("circle")
                .attr('stroke-width', '0.7')
                .attr("r", function (d) {
                    if ($('#changeDegree').val() == 'Total') {
                        return maxTotalScale(parseInt(((d.InNode ? d.InNode : 0) + (d.OutNode ? d.OutNode : 0))));
                    } else if ($('#changeDegree').val() == 'InNode') {

                        return inNodeScale(parseInt(d.InNode));
                    } else {
                        return outNodeScale(parseInt(d.OutNode));
                    }
                })
                .attr("fill", circleColour);
            node.append("svg:title")
                .text(function (d, i) {
                    return d.name
                });
            textNode = tempNode.append("text")

            function tickActions() {
                //update circle positions each tick of the simulation
                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
                textNode
                    .attr("x", function (d) {
                        return d.x
                    })
                    .attr("y", function (d) {
                        return d.y
                    })
                    .text(function (d, i) {
                        // if (parseInt(d.InNode) + parseInt(d.OutNode) >= 3)
                        return d.name
                        // else
                        //     return ""
                    });
                //update link positions
                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

            }

            //add tick instructions:
            simulation.on("tick", tickActions);

            function zoom_actions() {
                g.attr("transform", d3.event.transform)
            }

            var zoom_handler = d3.zoom()
                .on("zoom", zoom_actions);
            zoom_handler(svg);

            function drag_start(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            //make sure you can't drag the circle outside the box
            function drag_drag(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function drag_end(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            //add drag capabilities
            var drag_handler = d3.drag()
                .on("start", drag_start)
                .on("drag", drag_drag)
                .on("end", drag_end);

            drag_handler(node);
            if ($('#socialReplicaPicker').val() == 'All')
                updateSocialNetworkReplicas();
        },
        error: function (data) {
            console.log(data)
        }
    })
}

function drawSocialNetwork() {
    $('#SocialNetworkSVG').html('')
    var values = $('#time-slider').slider("option", "values");
    $.ajax({
        method: 'GET',
        //url: '/herberger/getSocialNetworkData.php?name=' + $('#socialPaintingPicker').val(),
        url: '/herberger/allSocialNetwork.php?start=' + values[0] + "&end=" + values[1],
        success: function (data) {
            data = JSON.parse(data);
            var width = 960,
                height = 500;
            var svg = d3.select('#SocialNetworkSVG')
                .append('svg').attr('height', height)
                .attr('width', width);
            var radius = 15;
            svg.append("defs").append("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 20)
                .attr("refY", 0)
                .attr("markerWidth", 7)
                .attr("markerHeight", 7)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");
            inNodeScale = d3.scaleLinear()
                .domain([0, parseInt(data['data']['maxTotal'])])
                .range([3, 20]);

            outNodeScale = d3.scaleLinear()
                .domain([0, parseInt(data['data']['maxTotal'])])
                .range([3, 20]);
            maxTotalScale = d3.scaleLinear()
                .domain([0, parseInt(data['data']['maxTotal'])])
                .range([3, 20]);

            var nodes_data = data['data']['nodeData'],
                links_data = data['data']['linkData'];
            //set up the simulation and add forces
            var simulation = d3.forceSimulation()
                .nodes(nodes_data);
            var link_force = d3.forceLink(links_data)
                .id(function (d) {
                    return d.name;
                });
            var charge_force = d3.forceManyBody()
                .strength(-30);
            var center_force = d3.forceCenter((width - 10) / 2, (height - 10) / 2);
            simulation
                .force("charge_force", charge_force)
                .force("center_force", center_force)
                .force("links", link_force);
            //add encompassing group for the zoom
            g = svg.append("g")
                .attr("class", "everything");

            //This gives the link colour
            function linkColour(d) {
                return "black";
            }

            //draw lines for the links
            var link = g.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(links_data)
                .enter().append("line")
                .attr("stroke-width", 1)
                .attr("marker-end", "url(#arrow)")
                .style("stroke", linkColour);

            function circleColour(d) {
                return giveColorOnName(d.name)
            }

            tempNode = g.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes_data)
                .enter()
            node = tempNode.append("circle")
                .attr('stroke-width', '0.7')
                .attr("r", function (d) {
                    if ($('#changeDegree').val() == 'Total') {
                        return maxTotalScale(parseInt(((d.InNode ? d.InNode : 0) + (d.OutNode ? d.OutNode : 0))));
                    } else if ($('#changeDegree').val() == 'InNode') {
                        return inNodeScale(parseInt(d.InNode));
                    } else {
                        return outNodeScale(parseInt(d.OutNode));
                    }
                })
                .attr("fill", circleColour);
            node.append("svg:title")
                .text(function (d, i) {
                    return d.name
                });
            textNode = tempNode.append("text")

            function tickActions() {
                //update circle positions each tick of the simulation
                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
                textNode
                    .attr("x", function (d) {
                        return d.x
                    })
                    .attr("y", function (d) {
                        return d.y
                    })
                    .text(function (d, i) {
                        //if (parseInt(d.InNode) + parseInt(d.OutNode) >= 3)
                        return d.name
                        //else
                        //   return ""
                    });
                //update link positions
                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

            }

            //add tick instructions:
            simulation.on("tick", tickActions);

            function zoom_actions() {
                g.attr("transform", d3.event.transform)
            }

            var zoom_handler = d3.zoom()
                .on("zoom", zoom_actions);
            zoom_handler(svg);

            function drag_start(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            //make sure you can't drag the circle outside the box
            function drag_drag(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function drag_end(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            //add drag capabilities
            var drag_handler = d3.drag()
                .on("start", drag_start)
                .on("drag", drag_drag)
                .on("end", drag_end);

            drag_handler(node);

        },
        error: function (data) {
            console.log(data)
        }
    })
}

function updateReplicas(paintingName = $('#paintingsPicker').val()) {
    $.ajax({
        url: '/herberger/getReplicaNames.php',
        method: 'GET',
        data: {
            name: paintingName
        },
        success: function (data) {
            data = JSON.parse(data);
            $('#replicaPicker')
                .find('option')
                .remove()

            if (data['data']) {
                for (iter in data['data']) {
                    if (data['data'][iter] != '..' && data['data'][iter] != '.') {
                        $('#replicaPicker').append($('<option>', {
                            value: data['data'][iter],
                            text: data['data'][iter]
                        }));
                    }
                }
            }
            $('.selectpicker').selectpicker('refresh');
            updateTheNarrativeDisplay();
        },
        error: function (data) {
            console.log(data);
        }
    })
}

function updateSocialNetworkReplicas(paintingName = $('#socialNetworkPicker').val()) {
    $.ajax({
        url: '/herberger/getReplicaNames.php',
        method: 'GET',
        data: {
            name: paintingName
        },
        success: function (data) {
            data = JSON.parse(data);
            $('#socialReplicaPicker')
                .find('option')
                .remove()
            $('#socialReplicaPicker').append($('<option>', {
                value: 'All',
                text: 'All'
            }));
            if (data['data']) {
                for (iter in data['data']) {
                    if (data['data'][iter] != '..' && data['data'][iter] != '.') {
                        $('#socialReplicaPicker').append($('<option>', {
                            value: data['data'][iter],
                            text: data['data'][iter]
                        }));
                    }
                }
            }
            $('#socialReplicaPicker').selectpicker('refresh');
        },
        error: function (data) {
            console.log(data);
        }
    })
}

function changeDegree() {
    if ($('#changeDegree').val() == 'Total') {
        maxTotalSimulation();
    } else if ($('#changeDegree').val() == 'InNode') {
        inNodeSimulation();
    } else {
        outNodeSimulation();
    }
}

function updateComparisonGraph() {

}

var narrativeMarkers = [];
var currentIndex = -1;
var markersInterval;
var narrativeLatLngs = [];
var narrativePolyLine = [];
var narrativeDecorator = [];

function pauseNarrativePlay() {
    $('#pauseNarrativePlay').hide();
    $('#playNarrativePlay').show();
    if (markersInterval) {
        clearInterval(markersInterval);
    }
}

function moveBackward() {
    //if (markersInterval) {
    currentIndex = ((currentIndex - 1) + narrativeMarkers.length) % narrativeMarkers.length
    currentIndex = ((currentIndex - 1) + narrativeMarkers.length) % narrativeMarkers.length
    moveAmongMarkers();
//}
}

function moveForward() {
    //if (markersInterval) {
    moveAmongMarkers();
//}
}

function playNarrativePlay() {
    $('#pauseNarrativePlay').show();
    $('#playNarrativePlay').hide();
    // if (markersInterval) {
    moveAmongMarkers();
    markersInterval = setInterval(moveAmongMarkers, 7000)
//}
}

var moveAmongMarkers = function () {
    if (narrativeMarkers.length > 1) {
        if (currentIndex != -1)
            narrativeMarkers[currentIndex].closePopup();
        currentIndex = (currentIndex + 1) % narrativeMarkers.length;
        narrativeMarkers[currentIndex].openPopup()
    } else if (narrativeMarkers.length == 1 && currentIndex == -1) {
        currentIndex = (currentIndex + 1) % narrativeMarkers.length;
        narrativeMarkers[currentIndex].popupopen()
    }
};

function updateTheNarrativeDisplay(paintingName = $('#paintingsPicker').val(), paintingReplica = $('#replicaPicker').val()) {
    $.ajax({
        data: {
            paintingName: paintingName,
            paintingReplica: paintingReplica
        },
        method: 'GET',
        url: '/herberger/getReplicaInfo.php',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            if (data['data']) {
                $('#narrativeImage').html('<img width="100%" src="' + data['data']['image'] + '"/>')
                $('#narrativeAboutText').html('<div class="col-md-12"><div class="col-md-12">Year: ' + data['data']['csvData'][0]['YEAR'] + '</div><div class="col-md-12" style="clear:both;">Medium: ' + data['data']['csvData'][0]['MEDIUM'] + '</div><div class="col-md-12" style="clear:both;">Height(in.): ' + data['data']['csvData'][0][' SIZE Height (in)'] + '</div><div class="col-md-12" style="clear:both;">Location: ' + data['data']['csvData'][data['data']['csvData'].length - 1]['owner_LOC'] + '</div></div>');
                for (iter in narrativeMarkers) {
                    narrativeMaps.removeLayer(narrativeMarkers[iter]);
                }
                narrativeMaps.removeLayer(narrativePolyLine);
                narrativeMaps.removeLayer(narrativeDecorator);
                narrativeMarkers = [];
                narrativeLatLngs = [];
                for (iter in data['data']['csvData']) {
                    var tempMarker = L.marker([parseFloat(data['data']['csvData'][iter]['LAT']), parseFloat(data['data']['csvData'][iter]['LONG'])], 5000);
                    var icon = tempMarker.options.icon;
                    console.log(icon);
                    icon.options.iconSize = [32, icon.options.iconSize[1]]
                    icon.options.iconUrl = 'marker.png'
                    tempMarker.setIcon(icon);
                    narrativeMarkers.push(tempMarker.bindPopup('<div style="width:400px;overflow: auto;"><div class="col-md-12" style="overflow:auto;"><div class="col-md-6" style="border:1px solid;min-height: 200px;"><div class="col-md-12"><img src="' + data['data']['csvData'][iter]['image'] + '" style="min-height:150px;border-bottom:1px solid;" width="100%" alt="No Image found"/></div><div class="col-md-12"><b>Owner:</b> ' + data['data']['csvData'][iter]['OWNER'] + '</div><div class="col-md-12"><b>Location</b>: ' + data['data']['csvData'][iter]['owner_LOC'] + '</div><div class="col-md-12"><b>Number</b>: ' + data['data']['csvData'][iter]['OWNER #'] + '</div><div class="col-md-12"><b>Profession</b>: ' + data['data']['csvData'][iter]['owner_PROF'] + '</div></div><div class="col-md-6" style="overflow:scroll;height:250px;line-height:100%;">' + data['data']['csvData'][iter]['about'] + '</div></div></div>', {
                        maxWidth: 'auto',
                        maxHeight: 'auto'
                    }).addTo(narrativeMaps));
                    narrativeLatLngs.push([parseFloat(data['data']['csvData'][iter]['LAT']), parseFloat(data['data']['csvData'][iter]['LONG'])])
                }
                var group = new L.featureGroup(narrativeMarkers);
                narrativeMaps.fitBounds(group.getBounds());
                narrativePolyLine = L.polyline(narrativeLatLngs, {}).addTo(narrativeMaps);
                narrativeDecorator = L.polylineDecorator(narrativePolyLine, {
                    patterns: [
                        {
                            offset: 25,
                            repeat: 50,
                            symbol: L.Symbol.arrowHead({
                                pixelSize: 15,
                                pathOptions: {
                                    fillOpacity: 1,
                                    weight: 0
                                }
                            })
                        }
                    ]
                }).addTo(narrativeMaps);
                currentIndex = -1
                $('#pauseNarrativePlay').hide();
                $('#playNarrativePlay').show();
                moveAmongMarkers()
                if (markersInterval) {
                    clearInterval(markersInterval);
                }
                // markersInterval = setInterval(moveAmongMarkers, 7000)
            } else {
                $('#narrativeImage').html('')
                $('#narrativeAboutText').html('');
                if (markersInterval) {
                    clearInterval(markersInterval);
                }
                for (iter in narrativeMarkers) {
                    narrativeMaps.removeLayer(narrativeMarkers[iter]);
                }
            }
        },
        error: function (data) {
        }
    })
}
