<?php
/*******************************
 * This is the main file for php
 *******************************/
header("Location: /herberger/main.php?v=" . uniqid());
//header("Location: /herberger/v2/");
die();
?>
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
<meta http-equiv="cache-control" content="max-age=0"/>
<meta http-equiv="cache-control" content="no-cache"/>
<meta http-equiv="expires" content="0"/>
<meta http-equiv="pragma" content="no-cache"/>
<body>
<div id="main" class="container-fluid">
    <div id="VisaulTabs" class="col-md-12">
        <ul>
            <li><a href="#tabs-1">Narratives</a></li>
            <li><a href="#tabs-2">Social Network</a></li>
            <li><a href="#tabs-3">Comparison</a></li>
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
            <div id="SocialNetworkContainer" class="col-md-12">
                <div class="col-md-12">
                    <div class="col-md-9">
                    </div>
                    <div class="col-md-3">
                        <div class="col-md-3" style="margin-top: 3%;">
                            Painting
                        </div>
                        <div class="col-md-9">
                            <select class="selectpicker" onchange="drawSocialNetwork()" id="socialPaintingPicker">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div id="SocialNetworkSVG">
                    </div>
                    <div id="time-slider"></div>
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
                        <div class="col-md-9">
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
    </div>
</div>
</body>
<script type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="/herberger/lib/leaflet/leaflet.js"></script>
<script type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.1.0/leaflet.markercluster.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="http://d3js.org/d3-selection-multi.v1.js"></script>
<script src="/herberger/public/js/index.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js"></script>