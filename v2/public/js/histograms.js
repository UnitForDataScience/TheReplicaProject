$(function () {

    Highcharts.chart('totalWork', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Total Number of Autograph Replicas Per Subject'
        },
        subtitle: {
            text: 'Number of these in the US: 14 = 17.5%'
        },
        xAxis: {
            categories: [
                "Beata Beatrix", "Blessed Damozel", "Bocca Baciata", "Dante’s Dream", "Donna della Finestra", "Hesterna Rosa", "How They Met Themselves", "Joan of Arc", "Lady Lilith", "The Loving Cup", "Lucrezia Borgia", "Magdalene at the Door", "Pandora", "Paolo and Francesca", "Proserpine", "Regina Cordium", "Salutation of Beatrice", "Venus Verticordia"
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Count',
            data: [7, 3, 2, 3, 6, 3, 3, 4, 6, 5, 2, 5, 6, 3, 9, 4, 4, 5]
        }]
    });


    Highcharts.chart('hist_comp', {

        chart: {
            type: 'column'
        },

        title: {
            text: 'Number of replicas in London Museums vs Number of Replicas in Abroad Museums vs Number of Replicas in UK outside London Museums'
        },
        subtitle: {
            text: ""
        },
        xAxis: {
            categories: ["Beata Beatrix", "Blessed Damozel", "Bocca Baciata", "Dante’s Dream", "Donna della Finestra", "Hesterna Rosa", "How They Met Themselves", "Joan of Arc", "Lady Lilith", "The Loving Cup", "Lucrezia Borgia", "Magdalene at the Door", "Pandora", "Paolo and Francesca", "Proserpine", "Regina Cordium", "Salutation of Beatrice", "Venus Verticordia"]
        },

        yAxis: {
            allowDecimals: false,
            min: 0
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>';
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [{
            name: 'UK',
            data: [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
            stack: '1'
        }, {
            name: 'Abroad',
            data: [3, 1, 2, 0, 1, 1, 0, 1, 4, 2, 1, 0, 1, 1, 0, 1, 3, 0],
            stack: '1'
        }, {
            name: 'UK outside London',
            data: [2, 1, 0, 2, 2, 0, 2, 1, 0, 2, 0, 3, 3, 1, 3, 1, 1, 2],
            stack: '1'
        }]
    });

    Highcharts.chart('in_london', {
        chart: {
            type: 'column'
        },

        title: {
            text: 'No. of Replicas in London vs. No. of Replicas in Abroad vs. No. of Replicas in UK outside London vs No. of Replicas in Private Collection'
        },
        subtitle: {
            text: ""
        },
        xAxis: {
            categories: ["Beata Beatrix", "Blessed Damozel", "Bocca Baciata", "Dante’s Dream", "Donna della Finestra", "Hesterna Rosa", "How They Met Themselves", "Joan of Arc", "Lady Lilith", "The Loving Cup", "Lucrezia Borgia", "Magdalene at the Door", "Pandora", "Paolo and Francesca", "Proserpine", "Regina Cordium", "Salutation of Beatrice", "Venus Verticordia"]
        },

        yAxis: {
            allowDecimals: false,
            min: 0
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>';
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            name: '# Replicas',
            data: [7, 3, 2, 3, 6, 3, 3, 4, 6, 5, 2, 5, 6, 3, 9, 4, 4, 5],
            stack: '1'
        }, {
            name: 'In London',
            data: [1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 2, 1, 1, 1, 0, 0],
            stack: '2'
        }, {
            name: 'Abroad',
            data: [3, 1, 2, 0, 1, 1, 0, 1, 4, 2, 1, 0, 1, 1, 0, 1, 3, 0],
            stack: '2'
        }, {
            name: 'UK outside London',
            data: [2, 1, 0, 2, 3, 0, 2, 1, 0, 2, 0, 3, 3, 1, 3, 1, 1, 2],
            stack: '2'
        }, {
            name: 'PC',
            data: [1, 1, 0, 0, 1, 1, 1, 1, 2, 1, 0, 2, 0, 0, 5, 1, 0, 3],
            stack: '2'
        }]
    });
});