<?php
/*******************************
 * This is the main file for php
 *******************************/
//header("Location: /herberger/v2/");
//die();
?>
<style type="text/css">
    .sliderExpand {
        width: 3%;
        text-align: center;
        height: 22;
    }

    .legend rect {
        fill: white;
        stroke: black;
        opacity: 0.8;
    }

    .country-name {
        margin: 0 !important;
    }

    .key-dot {
        display: inline-block;
        height: 10px;
        margin-right: .5em;
        width: 10px;
    }

    .Museums {
        background: blue;
    }

    .Auction-House {
        background: red;
    }

    .Individual {
        background: yellow;
    }
</style>
<link rel="stylesheet" href="/herberger/lib/leaflet/leaflet.css"/>
<link rel="stylesheet" type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.1.0/MarkerCluster.css">
<link rel="stylesheet" type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.1.0/MarkerCluster.Default.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css">
<link rel="stylesheet" type="text/css" href="/herberger/public/css/index.css">
<link rel="stylesheet" type="text/css"
      href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<meta http-equiv="cache-control" content="max-age=0"/>
<meta http-equiv="cache-control" content="no-cache"/>
<meta http-equiv="expires" content="0"/>
<meta http-equiv="pragma" content="no-cache"/>
<body>
<div id="main" class="container-fluid">
    <div id="VisaulTabs" class="col-md-12">
        <ul>
            <li><a href="#tabs-1">Narratives</a></li>
            <li><a href="#tabs-2">Transaction Network</a></li>
            <li><a href="#tabs-3">Comparison</a></li>
            <li><a href="#tabs-4">Paintings</a></li>
        </ul>
        <div id="tabs-1">
            <div id="NarrativeContainer" class="col-md-12">
                <div class="col-md-12">
                    <div class="col-md-9">
                    </div>
                    <div class="col-md-3">
                        <div class="col-md-3" style="margin-top: 3%;">
                            Painting
                        </div>
                        <div class="col-md-9">
                            <select class="selectpicker" id="paintingsPicker" onchange="updateReplicas()">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-12" style="margin-top: 1%;">
                    <div class="col-md-9">
                        <div class="col-md-4 navigationContain" style="text-align: center;">
                            <i class="fa fa-backward fa-3x navigation" aria-hidden="true" onclick="moveBackward()"></i>
                        </div>
                        <div class="col-md-3 navigationContain" id="pauseNarrativePlay"
                             style="display: none;text-align: center;">
                            <i class="fa fa-pause fa-3x navigation" aria-hidden="true"
                               onclick="pauseNarrativePlay()"></i>
                        </div>
                        <div class="col-md-3 navigationContain" id="playNarrativePlay" style="text-align: center;">
                            <i class="fa fa-play fa-3x navigation" aria-hidden="true" onclick="playNarrativePlay()"></i>
                        </div>
                        <div class="col-md-3 navigationContain" style="text-align: center;">
                            <i class="fa fa-forward fa-3x navigation" aria-hidden="true" onclick="moveForward()"></i>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="col-md-3" style="margin-top: 3%;">
                            Replica
                        </div>
                        <div class="col-md-9">
                            <select class="selectpicker" id="replicaPicker" onchange="updateTheNarrativeDisplay()">
                            </select>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 1.5%;" class="col-md-12">
                    <div id="narrativeMaps" class="col-md-8">
                    </div>
                    <div id="narrativePaintingPicture" class="col-md-4">
                        <div id="narrativeImage" class="col-md-12">
                        </div>
                        <div id="narrativeAboutText" style="text-align: justify;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="tabs-2">
            <div>
                <div class="col-md-12">
                    <div class="col-md-9">
                    </div>
                    <div class="col-md-3">
                        <div class="col-md-3" style="margin-top: 3%;">
                            Degree
                        </div>
                        <div class="col-md-9">
                            <select class="selectpicker" id="changeDegree" onchange="changeDegree()">
                                <option value="Total" selected="true">Total</option>
                                <option value="InNode">In-Node</option>
                                <option value="OutNode">Out-Node</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="col-md-9">
                    </div>
                    <div class="col-md-3">
                        <div class="col-md-3" style="margin-top: 3%;">
                            Painting
                        </div>
                        <div class="col-md-9">
                            <select class="selectpicker" id="socialNetworkPicker" onchange="drawSocialNetworkChange()">
                                <option value="All">All</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="col-md-9">
                    </div>
                    <div class="col-md-3">
                        <div class="col-md-3" style="margin-top: 3%;">
                            Replica
                        </div>
                        <div class="col-md-9">
                            <select class="selectpicker" id="socialReplicaPicker"
                                    onchange="drawSocialNetworkPainting()">
                                <option value="All">All</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div id="SocialNetworkContainer" class="col-md-12">
                        <div class="col-md-10">
                            <div id="time-slider" style="margin:18px;"></div>
                        </div>
                        <div class="col-md-2">
                            <div id="range-slider" style="margin: 15px;">1850 - 1930</div>
                        </div>
                        <div class="col-md-10">
                            <div id="SocialNetworkSVG">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="legend1"><p class="country-name"><span class="key-dot Museums"></span>Museums/Galleries
                                </p></div>
                            <div class="legend1"><p class="country-name"><span class="key-dot Auction-House"></span>Auction-House/Dealer
                                </p></div>
                            <div class="legend1"><p class="country-name"><span class="key-dot Individual"></span>Individual
                                </p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="tabs-3">
            <div id="ComparisonNetwork" class="col-md-12">
                <div class="col-md-12">
                    <div class="col-md-9">
                    </div>
                    <div class="col-md-3">
                        <div class="col-md-3" style="margin-top: 3%;">
                            Painting
                        </div>
                        <div class="col-md-9" style="z-index: 999999999;">
                            <select class="selectpicker" id="comparisonNewtworkPicker"
                                    onchange="drawComparisonNetwork()">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div id="ComparisonNetworkContainer" class="col-md-12">
                    </div>
                </div>
            </div>
        </div>
        <div id="tabs-4">
            <div id="paintingNetwork" class="col-md-12">
                <div class="col-md-12">
                    <div class="col-md-9">
                    </div>
                    <div class="col-md-3">
                        <div class="col-md-3" style="margin-top: 3%;">
                            Painting
                        </div>
                        <div class="col-md-9" style="z-index: 999999999;">
                            <select class="selectpicker" id="paintingNetworkPicker" onchange="drawPaintingImages()">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div id="paintingNetworkContainer" class="col-md-12">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
<script type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/async/2.5.0/async.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="/herberger/lib/leaflet/leaflet.js"></script>
<script type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-polylinedecorator/1.1.0/leaflet.polylineDecorator.min.js"></script>
<script type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.1.0/leaflet.markercluster.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="http://d3js.org/d3-selection-multi.v1.js"></script>
<script type="text/javascript">
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var script = document.createElement('script');
    script.src = "/herberger/public/js/index.js?v=" + uuidv4();
    document.getElementsByTagName('script')[0].parentNode.appendChild(script);
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js"></script>
