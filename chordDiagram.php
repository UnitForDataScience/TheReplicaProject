<?php
include "./commons.php";
$data = scandir($paintingsDir);
$output = array();
$output["type"] = "Success";
$output["message"] = "Data found";
$responseData = array();
$names = array();
//Looping through all the directories
for ($x = 0; $x < sizeof($data); $x++) {
    if ($data[$x] != '.' && $data[$x] != '..') {
        $prev = null;
        $file = fopen($paintingsDir . $data[$x] . "/data.csv", "r");
        fgetcsv($file);
        while (!feof($file)) {
            $readLine = fgetcsv($file);
            $year = intval($readLine[7]);
            if ($year >= 2014)
                $year = 2014;
            else if ($year >= 2000)
                $year = 2000;
            else if ($year >= 1970)
                $year = 1970;
            else if ($year >= 1940)
                $year = 1940;
            else if ($year >= 1925)
                $year = 1925;
            else if ($year >= 1900)
                $year = 1900;
            else if ($year >= 1885)
                $year = 1885;
            else
                $year = 1860;
            if ($readLine[6] == '1') {
                $prev = null;
            }
            if (!is_null($prev)) {
                if (!$responseData[$year]) {
                    $responseData[$year] = array();
                }
                if (!$responseData[$year][$prev]) {
                    $responseData[$year][$prev] = array();
                }
                if (!$responseData[$year][$prev][$readLine[5]]) {
                    $responseData[$year][$prev][$readLine[5]] = 0;
                }
                $responseData[$year][$prev][$readLine[5]] += 1;
                if (!$names[$year])
                    $names[$year] = array();
                $names[$year][$prev] = true;
                $names[$year][$readLine[5]] = true;
            }
            $prev = $readLine[5];
        }
        fclose($file);
    }
}
$output['data']['matrix'] = $responseData;
$output['data']['names'] = $names;
printData(json_encode($output));
?>