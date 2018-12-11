/**************************************
 * This code is for the raw data output
 *************************************/
$(document).ready(function () {
    intializeRawData();

    function intializeRawData() {
        $(document).ready(function () {

            $.ajax({
                url: '/herberger/getRawData.php',
                method: 'get',
                success: function (data) {
                    data = JSON.parse(data)['data'];
                    $('.multi-select').multiSelect({
                        selectableHeader: "<input type='text' class='search-input col-sm-12 col-12 col-xl-12 col-lg-12 col-md-12' autocomplete='on'>",
                        selectionHeader: "<input type='text' class='search-input col-md-12 col-sm-12 col-12 col-lg-12 col-xl-12'  autocomplete='on'>",
                        afterInit: function (ms) {
                            var that = this;
                            var $selectableSearch = that.$selectableUl.prev();
                            var $selectionSearch = that.$selectionUl.prev();
                            var selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)';
                            var selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

                            that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                                .on('keydown', function (e) {
                                    if (e.which === 40) {
                                        that.$selectableUl.focus();
                                        return false;
                                    }
                                });

                            that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                                .on('keydown', function (e) {
                                    if (e.which == 40) {
                                        that.$selectionUl.focus();
                                        return false;
                                    }
                                });
                        },
                        afterSelect: function () {
                            this.qs1.cache();
                            this.qs2.cache();
                            // searchRawData();
                            updateSearchCriteria();
                        },
                        afterDeselect: function () {
                            this.qs1.cache();
                            this.qs2.cache();
                            //searchRawData();
                            updateSearchCriteria();
                        }
                    });

                    for (iter in data) {

                        $('#rawDataSrc').append('<tr><td>' + data[iter]['paintingName']
                            + '</td><td><img src="' + data[iter]['paintingImage'] + '" alt="No-Image" class="img-thumbnail img-fluid" style="max-height:300px; max-width:200px;"/></td><td>'
                            + data[iter]['replicaId'] + '</td>' +
                            '<td>' + data[iter]['ownerNumber'] + '</td>' +
                            '<td>' + data[iter]['ownerName'] + '</td>' +
                            '<td>' + data[iter]['ownerCity'] + '</td>' +
                            '<td><img src="' + data[iter]['ownerImage'] + '" alt="No-Image" class="img-thumbnail img-fluid" style="max-height:300px; max-width:200px;"/></td><td>' + data[iter]['ownerProfession'] + '</td></tr>')
                    }

                    updateSearchCriteria();

                    //update search criteria.
                    function updateSearchCriteria() {
                        var array = {
                            '#paitingFilter': true,
                            '#replicaFilter': true,
                            '#owernFilter': true,
                            '#professionFilter': true,
                            '#ownerCityFilter': true,
                            '#ownerNumberFilter': true
                        };

                        for (iter in array) {

                            if ($(iter).val().length != 0) {
                                array[iter] = false;
                            }
                        }
                        var paintingNames = {};
                        var replicaIds = {};
                        var ownerNames = {};
                        var professions = {};
                        var ownerCity = {};
                        var ownerNumber = {};

                        for (iter in data) {

                            if (($('#paitingFilter').val().length == 0 || $('#paitingFilter').val().indexOf(data[iter]['paintingName']) != -1)
                                && ($('#replicaFilter').val().length == 0 || $('#replicaFilter').val().indexOf(data[iter]['replicaId']) != -1)
                                && ($('#professionFilter').val().length == 0 || $('#professionFilter').val().indexOf(data[iter]['ownerProfession']) != -1)
                                && ($('#owernFilter').val().length == 0 || $('#owernFilter').val().indexOf(data[iter]['ownerName']) != -1)
                                && ($('#ownerCityFilter').val().length == 0 || $('#ownerCityFilter').val().indexOf(data[iter]['ownerCity']) != -1)
                                && ($('#ownerNumberFilter').val().length == 0 || $('#ownerNumberFilter').val().indexOf(data[iter]['ownerNumber']) != -1)) {
                                ownerNames[data[iter]['ownerName'].trim()] = true;
                                paintingNames[data[iter]['paintingName'].trim()] = true;
                                replicaIds[data[iter]['replicaId'].trim()] = true;
                                professions[data[iter]['ownerProfession'].trim()] = true;
                                ownerCity[data[iter]['ownerCity'].trim()] = true;
                                ownerNumber[data[iter]['ownerNumber'].trim()] = true;
                            }
                        }
                        paintingNames = Object.keys(paintingNames);
                        paintingNames.sort();
                        replicaIds = Object.keys(replicaIds);
                        replicaIds.sort();
                        ownerNames = Object.keys(ownerNames);
                        ownerNames.sort();
                        professions = Object.keys(professions);
                        professions.sort();
                        ownerCity = Object.keys(ownerCity);
                        ownerCity.sort();
                        ownerNumber = Object.keys(ownerNumber);

                        if (array['#paitingFilter']) {

                            $('#paitingFilter').empty();
                            for (iter in paintingNames) {
                                $('#paitingFilter').append($('<option>', {
                                    value: paintingNames[iter],
                                    text: paintingNames[iter]
                                }))
                            }
                        }
                        if (array['#replicaFilter']) {
                            $('#replicaFilter').empty();
                            for (iter in replicaIds) {
                                $('#replicaFilter').append($('<option>', {
                                    value: replicaIds[iter],
                                    text: replicaIds[iter]
                                }))
                            }
                        }
                        if (array['#professionFilter']) {
                            $('#professionFilter').empty();
                            for (iter in professions) {
                                $('#professionFilter').append($('<option>', {
                                    value: professions[iter],
                                    text: professions[iter]
                                }))
                            }
                        }
                        if (array['#owernFilter']) {
                            $('#owernFilter').empty();
                            for (iter in ownerNames) {
                                $('#owernFilter').append($('<option>', {
                                    value: ownerNames[iter],
                                    text: ownerNames[iter]
                                }))
                            }
                        }
                        if (array['#ownerNumberFilter']) {
                            $('#ownerNumberFilter').empty();
                            for (iter in ownerNumber) {
                                $('#ownerNumberFilter').append($('<option>', {
                                    value: ownerNumber[iter],
                                    text: ownerNumber[iter]
                                }))
                            }
                        }
                        if (array['#ownerCityFilter']) {
                            $('#ownerCityFilter').empty()
                            for (iter in ownerCity) {
                                $('#ownerCityFilter').append($('<option>', {
                                    value: ownerCity[iter],
                                    text: ownerCity[iter]
                                }))
                            }
                        }

                        $('.multi-select').multiSelect('refresh')
                    }

                    // This function will be called once search data is called
                    function searchRawData() {
                        $('#rawDataTable').DataTable().search(
                            '',
                            false, false
                        ).draw();
                    }

                    $('#applyFilter').on('click', function () {
                        searchRawData();
                    });
                    $('#resetFilter').on('click', function () {
                        var array = {
                            '#paitingFilter': true,
                            '#replicaFilter': true,
                            '#owernFilter': true,
                            '#professionFilter': true,
                            '#ownerCityFilter': true,
                            '#ownerNumberFilter': true
                        };
                        for (key in array) {
                            $(key).val([])
                        }
                        updateSearchCriteria();
                        $('.multi-select').multiSelect('refresh')
                    });
                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                            var selectedPaintings = $('#paitingFilter').val();

                            var tempAns = false;
                            if (selectedPaintings.length == 0)
                                tempAns = true;
                            else
                                for (iter in selectedPaintings) {
                                    if (selectedPaintings[iter].indexOf(data[0]) != -1) {
                                        tempAns = true;
                                        break;
                                    }
                                }

                            if (!tempAns) return false;
                            var selectedReplicas = $('#replicaFilter').val();
                            tempAns = false;
                            if (selectedReplicas.length == 0)
                                tempAns = true;
                            else
                                for (iter in selectedReplicas) {
                                    if (selectedReplicas[iter].indexOf(data[2]) != -1) {
                                        tempAns = true;
                                        break;
                                    }
                                }
                            if (!tempAns) return false;

                            var selectedReplicas = $('#owernFilter').val();
                            tempAns = false;
                            if (selectedReplicas.length == 0)
                                tempAns = true;
                            else
                                for (iter in selectedReplicas) {
                                    if (selectedReplicas[iter].indexOf(data[4]) != -1) {
                                        tempAns = true;
                                        break;
                                    }
                                }
                            if (!tempAns) return false;
                            var selectedReplicas = $('#professionFilter').val();
                            tempAns = false;
                            if (selectedReplicas.length == 0)
                                tempAns = true;
                            else
                                for (iter in selectedReplicas) {
                                    if (selectedReplicas[iter].indexOf(data[7]) != -1) {
                                        tempAns = true;
                                        break;
                                    }
                                }
                            if (!tempAns) return false;
                            var selectedReplicas = $('#ownerNumberFilter').val();
                            tempAns = false;
                            if (selectedReplicas.length == 0)
                                tempAns = true;
                            else
                                for (iter in selectedReplicas) {
                                    if (selectedReplicas[iter].indexOf(data[3]) != -1) {
                                        tempAns = true;
                                        break;
                                    }
                                }
                            if (!tempAns) return false;

                            var selectedReplicas = $('#ownerCityFilter').val();
                            tempAns = false;
                            if (selectedReplicas.length == 0)
                                tempAns = true;
                            else
                                for (iter in selectedReplicas) {
                                    if (selectedReplicas[iter].indexOf(data[5]) != -1) {
                                        tempAns = true;
                                        break;
                                    }
                                }
                            if (!tempAns) return false;
                            return true;
                        }
                    );
                    $('#rawDataTable').DataTable({
                        paging: true,
                        columnDefs: [
                            {
                                width: 200,
                                targets: [0, 1, 2, 3, 4, 5]
                            }
                        ],
                        "searching": true,
                        fixedColumns: true
                    });
                }
            })
        });


    }
});
