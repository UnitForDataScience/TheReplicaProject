<?php
include "./commons.php";
if (is_null($_GET['paintingName']) || is_null($_GET['paintingReplica'])) {
	$output = array();
	$output["type"] = "Error";
	$output["message"] = "Either name not provided or replica no";
} else {
	if (!file_exists($paintingsDir . $_GET['paintingName']) || !file_exists($paintingsDir . $_GET['paintingName'] . '/Replicas/' . $_GET['paintingReplica'])) {
		$output = array();
		$output["type"] = "Error";
		$output["message"] = "Either painting does not exists or its replica";
	} else {
		$output = array();
		$output["type"] = "Success";
		$output["message"] = "Data found";
		/**************************************************
			 * Reading the csv file and parsing the content
		**************************************************/
		$dataCreation = array("headers" => array(), "content" => array(), "about" => file_get_contents($paintingsDir . $_GET['paintingName'] . '/Replicas/' . $_GET['paintingReplica'] . '/About.txt'), "image" => '/herberger' . ltrim($paintingsDir . $_GET['paintingName'] . '/Replicas/' . $_GET['paintingReplica'] . '/image.jpg', '.'));
		$file = fopen($paintingsDir . $_GET['paintingName'] . "/data.csv", "r");
		$dataCreation['headers'] = fgetcsv($file);
		while (!feof($file)) {
			$tempArray = fgetcsv($file);
			if ($tempArray[0] == $_GET['paintingReplica']) {
				array_push($dataCreation['content'], $tempArray);
			}
		}
		fclose($file);
		/****************************************************
			 * creating the content which help in parsing the
			 * content on the visuals
		****************************************************/
		$finalData = array();
		for ($j = 0; $j < sizeof($dataCreation["content"]); $j++) {
			$tempData = array();
			for ($i = 0; $i < sizeof($dataCreation["headers"]); $i++) {
				$tempData[$dataCreation["headers"][$i]] = $dataCreation["content"][$j][$i];
			}
			array_push($finalData, $tempData);
		}
		/*******************************************************
			 * Collecting information for the owner of the paintings
		*******************************************************/
		$locationForReplicaOwners = $paintingsDir . $_GET['paintingName'] . '/Replicas/' . $_GET['paintingReplica'] . '/Owners/';
		for ($i = 0; $i < sizeof($finalData); $i++) {
			$about = "";
			$image = "";
			if(file_exists($locationForReplicaOwners . $finalData[$i]['OWNER'] . '/image.jpg')){
			    $image = '/herberger' . ltrim($locationForReplicaOwners . $finalData[$i]['OWNER'] . '/image.jpg', '.');
			} else {
			    $image = "/herberger/public/images/notfound.jpg";
			}
			if (file_exists($locationForReplicaOwners . $finalData[$i]['OWNER'])) {
				if (file_exists($locationForReplicaOwners . $finalData[$i]['OWNER'] . '/About.txt')) {
					$about = file_get_contents($locationForReplicaOwners . $finalData[$i]['OWNER'] . '/About.txt');
				}
			}
			$finalData[$i]['about'] = $about;
			$finalData[$i]['image'] = $image;
		}
		$output['data']["csvData"] = $finalData;
		$output['data']['about'] = $dataCreation['about'];
		$output['data']['image'] = $dataCreation['image'];
	}
}
printData(json_encode($output));
?>
