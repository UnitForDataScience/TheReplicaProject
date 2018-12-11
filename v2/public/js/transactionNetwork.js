var networkColorData =
    {
        museum: ["Art Institute of Chicago",
            "Ashmolean Museum",
            "Birmingham City Museum",
            "Boston Museum of Fine Arts",
            "Bradford Art Gallery",
            "Cecil Higgins Art Gallery",
            "Delaware Art Museum",
            "Dundee City Museum",
            "Farringdon Collection Trustees",
            "Fitzwilliam Museum",
            "Fogg Museum",
            "Frances Loeb Art Center",
            "Glasgow Art Gallery and Museum",
            "Harry Ransom Center",
            "Johannesburg Art Gallery",
            "Lady Lever Gallery",
            "Musee des Beaux Arts",
            "National Gallery of Scotland",
            "National Gallery of So Australia",
            "National Gallery of Victoria",
            "National Museum of Western Art",
            "Rochester Gallery",
            "Russell-Cotes Gallery",
            "Tate Museum",
            "Walker Art Gallery",
            "Whitworth Art Gallery",
            "William Morris Gallery"],
        "dealer":
            ["Agnew",
                "Anderson Galleries",
                "Barbizon House",
                "Buck and Reid",
                "C A Howell and Parsons",
                "C J Sawyer",
                "Charles Fairfax Murray",
                "Charles Fairfax Murray and Agnew",
                "Christies",
                "Chichibu Shokai",
                "James Coats Gallery",
                "D Croal Thomson",
                "Stone Gallery David Hughes",
                "David Hughes",
                "Dowdeswell Gallery",
                "Ephron Gallery",
                "Ernest Gambit",
                "Gooden and Fox",
                "LeFevre Gallery",
                "Leger Galleries",
                "Leggett Brothers",
                "Leicester Galleries",
                "Lyon and Turnbull",
                "The Piccadilly Gallery",
                "Robson and Co",
                "Scott and Fowles",
                "Sothebys",
                "Tarat Auction Rooms",
                "Thomas McLean Gallery",
                "William Vokins",
                "William Walker Sampson",
                "Woolley and Wallace"]
    };

function giveColorOnName(name) {
    if (name)
        for (iter in networkColorData['museum']) {
            if (networkColorData['museum'][iter].toLowerCase() === name.toLowerCase())
                return "blue";
        }
    if (name)
        for (iter in networkColorData['dealer']) {
            if (networkColorData['dealer'][iter].toLowerCase() === name.toLowerCase()) {
                return "red";
            }
        }
    return "yellow";
}

function startNetorkSimulation() {
    //Initialization Steps
    var svg = d3.select('#networkSvg'),
        width = svg.attr('width'),
        height = svg.attr('height');
    temp = svg;
    svg = svg.append('g');

    var link = svg.append("g").selectAll(".link"),
        node = svg.append("g").selectAll(".node");
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .id(function (d) {
                return d.name;
            }).distance(function (d) {
                return 300;
            }))
        .force("charge", d3.forceManyBody()
            .strength(function (d) {
                return -300;
            }))
        .force("center", d3.forceCenter(width / 2, height / 2));

    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'gray');

    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', 'gray');


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
        },
        stop: function (event, ui) {
            fetchData()
        }
    });
    var handles = $('#time-slider').find('.ui-slider-handle')
    $(handles[0]).text(1850);
    $(handles[1]).text(1930);
    $(handles[0]).css({
        "width": "3%",
        "text-align": "center",
        "height": "22",
        "display": "inline-table"
    });
    $(handles[1]).css({
        "width": "3%",
        "text-align": "center",
        "display": "inline-table",
        "height": "22"
    });
    $('#networkPaintingPicker').on('change', function () {
        setReplicasForNetwork()
    });
    $('#networkReplicaPicker').on('change', function () {
        fetchData();
    });
    /********************************************************************
     * This function will update the replica list if a painting is chosen
     *******************************************************************/
    var setReplicasForNetwork = function (paintingName = $('#networkPaintingPicker').val()) {
        var locationToUpdate = "networkReplicaPicker";
        if (paintingName == "All") {
            $('#' + locationToUpdate).find('option').remove();

            $('#' + locationToUpdate).append($('<option>', {
                value: 'All',
                text: 'All'
            }));
            fetchData();
        }
        else {
            $.ajax({
                url: '/herberger/getReplicaNames.php',
                method: 'GET',
                data: {
                    name: paintingName
                },
                success: function (data) {
                    data = JSON.parse(data);
                    data = data['data'];
                    $('#' + locationToUpdate).find('option').remove();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] != '.' && data[i] != '..') {
                            $('#' + locationToUpdate).append($('<option>', {
                                value: data[i],
                                text: data[i]
                            }));
                        }
                    }
                    fetchData()
                },
                error: function (data) {

                }
            });
        }

    };
    var nodeData = [];
    var linkData = [];
    var replicaMapping = [];

    /*************************************************
     * This function is used to fetch Data for replica
     ************************************************/
    var fetchData = function (paintingName = $('#networkPaintingPicker').val(), replicaId = $('#networkReplicaPicker').val()) {
        var url = "/herberger/";
        var values = $('#time-slider').slider("option", "values");
        if (paintingName == 'All') {
            url += 'allSocialNetwork.php?start=' + values[0] + "&end=" + values[1]
        } else {
            url += 'getSocialNetworkData.php?name=' + paintingName + "&start=" + values[0] + "&end=" + values[1] + '&replicaName=' + replicaId
        }
        $.ajax({
            url: url,
            success: function (data) {
                data = JSON.parse(data);

                nodeData = data['data']['nodeData'];
                linkData = data['data']['linkData'];
                replicaMapping = data['data']['replicaMapping'];
                radiusScale = d3.scaleLinear()
                    .domain([0, data['data']['maxTotal']])
                    .range([10, 40]);
                update_node_data_filter();
            }
        });
    };

    var arc = d3.symbol().type('triangle-down')
        .size(function (d) {
            return 1000;
        });


    /***************************************
     * Update the data for the network graph
     **************************************/

    function update(data_node = nodeData, data_link = linkData) {
        node = node.data(data_node, function (d) {
            return d.name;
        });
        node.exit().remove();
        var newNode = node.enter().append('circle').attr('class', 'node')
            .attr('r', function (d) {
                return radiusScale(parseInt(d['InNode']) + parseInt(d['OutNode']));
            })
            .attr('fill', function (d) {
                return giveColorOnName(d.name)
            }).call(d3.drag()
                .on("start", drag_start)
                .on("drag", drag_drag)
                .on("end", drag_end)
            );

        node = node.merge(newNode);
        link = link.data(data_link, function (d, i) {
            return i;
        });
        link.exit().remove();
        newLink = link.enter().append("path")
            .attr("class", "link");
        link = link.merge(newLink);
        node.on('mouseover', function (d) {

            svg.selectAll('text').remove();
            var array = [d];
            d.s = new Set();

            var mapping = replicaMapping[d.name];
            link.style('stroke-width', function (l) {
                if (mapping.indexOf(l['replicaId']) != -1) {
                    if (l.source !== d) {
                        if (array.indexOf(l.source) === -1) {
                            l.source.s = new Set();
                            l.source.s.add(l['replicaId']);
                            array.push(l.source);
                        } else {
                            var index = array.indexOf(l.source);
                            array[index].s.add(l['replicaId']);
                        }
                    }
                    if (l.target !== d) {
                        if (array.indexOf(l.target) === -1) {
                            l.target.s = new Set();
                            l.target.s.add(l['replicaId']);
                            array.push(l.target);
                        } else {
                            var index = array.indexOf(l.target);
                            array[index].s.add(l['replicaId']);
                        }
                    }
                    return 4;
                }
                else {
                    return 1;
                }
            });
            node.style('opacity', function (l) {
                if (array.indexOf(l) !== -1) {
                    var tooltip = svg.append('g').attr('class', 'tooltip').style('opacity', 1);
                    tooltip
                        .append('path')
                        .attr("d", d3.symbol().size([80]).type(d3.symbolTriangle))
                        .attr("transform", function () {
                            var radius = (radiusScale(l['InNode'] + l['OutNode']) + 10);

                            return "translate(" + l['x'] + ", " + (l['y'] - radius) + ")rotate(180)"
                        })
                        .style("fill", function () {
                            return 'black'
                        }).attr('opacity', 0.7);
                    var width = 250;
                    var widthCenter = width / 2;
                    var rectHeight = 30;
                    var string = '';
                    // var texts = [];
                    // if (l.s) {
                    //     i = 0;
                    //     l.s.forEach(function (value) {
                    //         console.log(value);
                    //         if (i == 0) {
                    //             rectHeight += 15;
                    //             if (string) {
                    //                 texts.push(string)
                    //             }
                    //             string = value
                    //         } else {
                    //             string += ',' + value
                    //         }
                    //         i = (i + 1) % 4;
                    //     });
                    //     if (string) {
                    //         texts.push(string);
                    //     }
                    // }
                    tooltip.append('rect')
                        .attr('x', l['x'] - widthCenter)
                        .attr('y', l['y'] - rectHeight - (radiusScale(l['InNode'] + l['OutNode']) + 10 + 3))
                        .attr('height', rectHeight + '')
                        .attr('width', width + '')
                        .attr('fill', 'black');
                    tooltip.append('text')
                        .attr('x', l['x'] - widthCenter + 15)
                        .attr('y', l['y'] - rectHeight - (radiusScale(l['InNode'] + l['OutNode']) + 10) + 15)
                        .text(mappingName(l['name']));
                    return 1
                } else {
                    return 0.1
                }
            });
        });
        node.on('mouseout', function () {
            svg.selectAll('text').remove();
            svg.selectAll(".n").remove();
            $(".tooltip").remove();
            link.style('stroke-width', 4);
            node.style('opacity', function (l) {
                return 1;
            });
        });
        // node.on('click', function (d) {
        //     var array = [];
        //     var map = {};
        //     for (l in linkData) {
        //         if (d.replicas.indexOf(linkData[l]['replicaId']) != -1) {
        //             if (!map[linkData[l].source.name]) {
        //                 map[linkData[l].source.name] = {};
        //                 array.push(linkData[l].source.name)
        //             }
        //             if (!map[linkData[l].source.name][linkData[l].target.name]) {
        //                 map[linkData[l].source.name][linkData[l].target.name] = 0;
        //                 array.push(linkData[l].target.name)
        //             }
        //             map[linkData[l].source.name][linkData[l].target.name]++;
        //         }
        //     }
        //     console.log(map);
        //     var matrix = [];
        //     for (i in array) {
        //         matrix.push(new Array(array.length));
        //         for (var j = 0; j <= i; j++) {
        //             if (map[array[i]] && map[array[i]][array[j]]) {
        //                 matrix[i][j] = map[array[i]][array[j]]
        //             } else {
        //                 matrix[i][j] = 1;
        //             }
        //         }
        //     }
        //     chord_setup(matrix);
        //     $('#chordModal').modal('toggle');
        // });
        simulation
            .nodes(nodeData)
            .on("tick", ticked);
        simulation.force("link")
            .links(linkData);
        simulation.alpha(1).alphaTarget(0).restart();
    }


    var radiusScale = d3.scaleLinear()
        .domain([0, 20])
        .range([20, 40]);


    function ticked() {
        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            }).attr('r', function (d) {
            return radiusScale(parseInt(d['InNode']) + parseInt(d['OutNode']));
        });
        link
            .attr('d', function (d) {
                const deltaX = d.target.x - d.source.x;
                const deltaY = d.target.y - d.source.y;
                const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const normX = deltaX / dist;
                const normY = deltaY / dist;

                const sourcePadding = radiusScale(d.source['InNode'] + d.source['OutNode']) + 5;
                const targetPadding = radiusScale(d.target['InNode'] + d.target['OutNode']) + 5;

                const sourceX = d.source.x + (sourcePadding * normX);
                const sourceY = d.source.y + (sourcePadding * normY);
                const targetX = d.target.x - (targetPadding * normX);
                const targetY = d.target.y - (targetPadding * normY);

                return `M${sourceX},${sourceY}L${targetX},${targetY}`;
            })

            .attr('marker-end', function (d, i) {
                return 'url(#end-arrow)'
            });
        // link.for(function (l) {
        //     l.filtered = true;
        // })
    }


    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(temp);

    function zoom_actions() {
        svg.attr("transform", d3.event.transform)
    }

    //Drag functions
    //d is the node
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

    //Initialization calls
    setReplicasForNetwork();
    var filter_list = [];
    $('#filter_auction').on('click', function () {
        toggle_auction();
        update_node_data_filter();
    });
    $('#filter_museum').on('click', function () {
        toggle_museum();
        update_node_data_filter();
    });
    $('#filter_indi').on('click', function () {
        toggle_indi();
        update_node_data_filter();
    });

    function toggle_museum() {
        var index = filter_list.indexOf('blue');
        if (index > -1) {
            filter_list.splice(index, 1)
        } else {
            filter_list.push('blue')
        }
    }

    function toggle_auction() {
        var index = filter_list.indexOf('red');
        if (index > -1) {
            filter_list.splice(index, 1)
        } else {
            filter_list.push('red')
        }
    }

    function toggle_indi() {
        var index = filter_list.indexOf('yellow');
        if (index > -1) {
            filter_list.splice(index, 1)
        } else {
            filter_list.push('yellow')
        }
    }

    function update_node_data_filter() {
        var new_node = nodeData.filter(function (n) {
            if (filter_list.indexOf(giveColorOnName(n.name)) > -1) {
                return false;
            }
            return true;
        });
        var new_link = linkData.filter(function (l) {
            if (filter_list.indexOf(giveColorOnName(l.source.name)) > -1 || filter_list.indexOf(giveColorOnName(l.target.name)) > -1) {
                return false;
            }
            return true;
        });
        update(new_node, new_link);
    }
}




