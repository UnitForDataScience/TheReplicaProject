<?php
include "./commons.php";

/**************************************************************
 * Name of the painting provided so need to find the replica
 * names.
 *************************************************************/

$output = array();
$output["type"] = "Success";
$output["message"] = "Data found";
$output['data'] = array();
$dataDir = "./public/data/";
$nameOfPaintings = scandir($dataDir);
$nodesData = array();
$linkData = array();
$nodeHashMap = array();
$collection = array();
//Collected the names for all the Paintings
for ($i = 0; $i < sizeof($nameOfPaintings); $i++) {
	//Some are unwanted paintings need to remove that
	if ($nameOfPaintings[$i] != '.' && $nameOfPaintings[$i] != '..') {
		//Making a pointer which will help in reading the content of csv
		$file = fopen($paintingsDir . $nameOfPaintings[$i] . "/data.csv", "r");
		$dataCreation['headers'] = fgetcsv($file);
		$dataCreation['content'] = array();
		//looping over the content of the file
		while (!feof($file)) {
			//A particular data line is read
			$readLine = fgetcsv($file);
			if (sizeof($dataCreation['content']) != 0) {
				$parentElement = $dataCreation['content'][sizeof($dataCreation['content']) - 1];
				$insertNode['source'] = strtolower($parentElement[5]);
				$insertNode['target'] = strtolower($readLine[5]);
				$insertNode['type'] = 'a';
				array_push($linkData, $insertNode);
				$nodeData['name'] = $readLine[5];
				$nodeData['profession'] = $readLine[15];
				$nodeHashMap[$readLine[5]] = $nodeData;
			}
			array_push($dataCreation['content'], $readLine);
		}
		fclose($file);
	}
}
foreach ($nodeHashMap as $key => $value) {
	array_push($nodesData, $value);
}
$output['data']['nodeData'] = $nodesData;
$output['data']['linkData'] = $linkData;

printData(json_encode($output));
?>