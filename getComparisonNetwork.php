<?php
include "./commons.php";
/*****************************************************************
 * If the painting name is not provided we have to throw error and
 * inform on the problem.
 ****************************************************************/
if (is_null($_GET["name"])) {
    $output = array();
    $output["type"] = "Error";
    $output["message"] = "Name of the painting not provided";
} /**************************************************************
 * Name of the painting provided so need to find the replica
 * names.
 *************************************************************/
else {
    //Name of the painting does not exists
    if (!file_exists($paintingsDir . $_GET['name'])) {
        $output = array();
        $output["type"] = "Error";
        $output["message"] = "Painting does not exists";
    } // Painting exists return the replica names
    else {
        $output = array();
        $output["type"] = "Success";
        $output["message"] = "Data found";
        $output['data'] = array();
        $file = fopen($paintingsDir . $_GET['name'] . "/data.csv", "r");
        fgetcsv($file);

        while (!feof($file)) {
            $tempArray = fgetcsv($file);
            if (is_null($output['data'][$tempArray[0]])) {
                $output['data'][$tempArray[0]] = array();
            }
            array_push($output['data'][$tempArray[0]], array(floatval($tempArray[12]), floatval($tempArray[13]), $tempArray[2], $tempArray[3], $tempArray[4], $tempArray[8]));

        }
        fclose($file);
    }
}
printData(json_encode($output));
?>