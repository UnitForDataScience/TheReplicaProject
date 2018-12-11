<?php
/******************************************************************************
 * This controller gives the output as name of the paintings that are available
 *****************************************************************************/
include './commons.php';
$dataDir = "./public/data/";
$output = array();
$output["type"] = "Success";
$output["message"] = "Data Found Successfully";
$nameOfPaintings = scandir($dataDir);
$output["data"] = $nameOfPaintings;
printData(json_encode($output));
?>
