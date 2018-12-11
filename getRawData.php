<?php
include "./commons.php";
/***************************************************
 * This php script fetches all the raw data for all
 * the paintings
 **************************************************/
$data = scandir($paintingsDir);
$output = array();
$output["type"] = "Success";
$output["message"] = "Data found";
$responseData = array();
//Looping through all the directories
for ($x = 0; $x < sizeof($data); $x++) {
	if ($data[$x] != '.' && $data[$x] != '..') {
		$file = fopen($paintingsDir . $data[$x] . "/data.csv", "r");
		fgetcsv($file);
		while (!feof($file)) {
			$tempArray = fgetcsv($file);
			$element = array();
			$element['paintingName'] = trim($tempArray[1]);
			$element['replicaId'] = trim($tempArray[0]);
			$element['ownerName'] = $tempArray[5];
			$element['ownerNumber'] = $tempArray[6];
			$element['ownerCity'] = $tempArray[8];

			//$element['paintingImage'] = '/herberger' . ltrim($paintingsDir . $data[$x] . "/Replicas/" . $element['replicaId'] . '/image.jpg', '.');
			if (file_exists($paintingsDir . $data[$x] . "/Replicas/" . $element['replicaId'] . '/image.jpg')) {
            				$element['paintingImage'] = '/herberger' . ltrim($paintingsDir . $data[$x] . "/Replicas/" . $element['replicaId'] . '/image.jpg', '.');
            			} else {
            				$element['paintingImage'] = '/herberger/public/images/notfound.jpg';
            			}
			$element['ownerProfession'] = $tempArray[15];
			$locationForReplicaOwners = $paintingsDir . $data[$x] . '/Replicas/' . $element['replicaId'] . '/Owners/';
			if (file_exists($locationForReplicaOwners . $tempArray[5] . '/image.jpg')) {
				$element['ownerImage'] = '/herberger' . ltrim($locationForReplicaOwners . $tempArray[5] . '/image.jpg', '.');
			} else {
				$element['ownerImage'] = '/herberger/public/images/notfound.jpg';
			}

			array_push($responseData, $element);
		}
		fclose($file);
	}
}
$output['data'] = $responseData;
printData(json_encode($output))
?>
