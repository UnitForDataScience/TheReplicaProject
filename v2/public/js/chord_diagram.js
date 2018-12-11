$(function () {
    $.ajax({
        url: '/herberger/chordDiagram.php',
        method: 'get',
        success: function (data) {
            data = JSON.parse(data);
            // build_chord(data['data']['matrix'][1860], Object.keys(data['data']['names'][1860]));
            var keys = Object.keys(data['data']['matrix']);
            for (i in keys) {
                var iter = keys[i];
                var next = (parseInt(i) + 1 < keys.length ? keys[parseInt(i) + 1] : 'Present');
                var name = 'chord' + iter;

                $('#add_chord').append(' <div class="col-6"><div class="col-12" style="text-align: center;">' + iter + ' to ' + next + '</div>' +
                    '                                <svg width="500" style="clear: both;" height="500" id="' + name + '"></svg>\n' +
                    '                            </div>')
                build_chord(data['data']['matrix'][iter], Object.keys(data['data']['names'][iter]), name)
            }
        }
    })
});

function build_chord(matrix, names, id) {
    // matrix = data['data']['matrix'];
    // names = Object.keys(data['data']['names']);
    var data = [];
    names.sort(function (a, b) {
        var dict = {
            'red': 1,
            'blue': 2,
            'yellow': 3
        };
        return dict[giveColorOnName(a)] - dict[giveColorOnName(b)];
    });
    for (index_1 in names) {
        array = [];
        for (index_2 in names) {
            name_1 = names[index_1];
            name_2 = names[index_2];
            if (matrix[name_1] && matrix[name_1][name_2]) {
                array.push(matrix[name_1][name_2]);
            } else {
                array.push(0);
            }
        }
        data.push(array);
    }
    var matrix = data;
    var svg = d3.select("#" + id),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        outerRadius = Math.min(width, height) * 0.5 - 110,
        innerRadius = outerRadius - 10;

    var formatValue = d3.formatPrefix(",.0", 1e1);

    var chord = d3.chord()
        .padAngle(0.02)
        .sortSubgroups(d3.descending);

    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var ribbon = d3.ribbon()
        .radius(innerRadius);


    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .datum(chord(matrix));

    var group = g.append("g")
        .attr("class", "groups")
        .selectAll("g")
        .data(function (chords) {
            return chords.groups;
        })
        .enter().append("g");

    group.append("path")
        .style("fill", function (d) {
            return giveColorOnName(names[d.index])
        })
        .style('opacity', function (d) {
            return 0.7;
        })
        .style("stroke", function (d) {
            return d3.rgb(giveColorOnName(names[d.index])).darker();
        })
        .attr("d", arc);

    var groupTick = group.selectAll(".group-tick")
        .data(function (d) {
            return groupTicks(d, 1);
        })
        .enter().append("g")
        .attr("class", "group-tick")
        .attr("transform", function (d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)";
        });

    groupTick.append("line")
        .attr("x2", 6);

    groupTick
        .filter(function (d) {
            return d.value === 0;
        })
        .append("text")
        .attr("x", 8)
        .attr("dy", ".50em")
        .attr("transform", function (d) {
            return d.angle > Math.PI ? "rotate(180) translate(-16)" : null;
        })
        .style("text-anchor", function (d) {
            return d.angle > Math.PI ? "end" : null;
        })
        .text(function (d) {
            return names[d.index];
        });
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style('font-size', '12px')
        .style('border', 'solid 1px')
        .style('background-color', 'black')
        .style('color', 'white')
        .style('padding', '2px')
        .style('border-radius', '1px');
    g.append("g")
        .attr("class", "ribbons")
        .selectAll("path")
        .data(function (chords) {
            return chords;
        })
        .enter().append("path")
        .attr("d", ribbon)
        .style("fill", function (d) {
            return giveColorOnName(names[d.target.index])
        })
        .style('opacity', function (d) {
            return 0.4;
        })
        .style("stroke", function (d) {
            return d3.rgb(giveColorOnName(names[d.target.index])).darker();
        })
        .on("mouseover", function (d) {
            d3.select(this).style("opacity", 1);
            return tooltip.style("visibility", "visible").text(names[d.source.index] + ' transfered ' + d.source.value + ' replica' + (parseInt(d.source.value) > 1 ? 's' : '') + ' to ' + names[d.target.index]);
        })
        .on("mousemove", function () {
            d3.select(this).style("opacity", 1);
            return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            d3.select(this).style("opacity", 0.4);
            return tooltip.style("visibility", "hidden");
        });

// Returns an array of tick angles and values for a given group and step.
    function groupTicks(d, step) {
        var k = (d.endAngle - d.startAngle) / d.value;

        return d3.range(0, d.value, step).map(function (value) {
            return {value: value, angle: value * k + d.startAngle, index: d.index};
        });
    }
}