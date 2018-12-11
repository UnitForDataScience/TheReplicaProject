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
}
/**************************************************************
 * Name of the painting provided so need to find the replica
 * names.
 *************************************************************/
else {
	//Name of the painting does not exists
	if (!file_exists($paintingsDir . $_GET['name'])) {
		$output = array();
		$output["type"] = "Error";
		$output["message"] = "Painting does not exists";
	}
	// Painting exists return the replica names
	else {
		$output = array();
		$output["type"] = "Success";
		$output["message"] = "Data found";
		$output['data'] = array();
		$dataDir = $paintingsDir . $_GET['name'] . '/Replicas';
		$output['replicaData'] = array();
		$replicas = scandir($dataDir);
		for ($i = 0; $i < sizeof($replicas); $i++) {
			if ($replicas[$i] != '.' && $replicas[$i] != '..') {

			    if(file_exists($dataDir . '/' . $replicas[$i] . '/image.jpg')) {
				    array_push($output['data'], '/herberger' . trim($dataDir . '/' . $replicas[$i] . '/image.jpg', '.'));
				} else{
				   array_push($output['data'], "/herberger/public/images/notfound.jpg");
				}
			}
		}
		$file = fopen($paintingsDir . $_GET['name'] . "/data.csv", "r");
		$dataCreation['headers'] = fgetcsv($file);
		while (!feof($file)) {
			$readLine = fgetcsv($file);
			$output['replicaData'][$readLine[0]] = array();
			$output['replicaData'][$readLine[0]]['year'] = $readLine[2];
			$output['replicaData'][$readLine[0]]['medium'] = $readLine[3];
			$output['replicaData'][$readLine[0]]['size'] = $readLine[4];
			$output['replicaData'][$readLine[0]]['location'] = $readLine[8];
			$output['replicaData'][$readLine[0]]['owner'] = $readLine[5];
		}
	}
}
printData(json_encode($output));
?>