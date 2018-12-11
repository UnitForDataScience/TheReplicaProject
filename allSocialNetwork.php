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
$nodePaintingCollection = array();
$collection = array();
$maxInNode = 0;
$maxOutNode = 0;
$maxTotal = 0;
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
			if(is_null($nodePaintingCollection[strtolower($readLine[5])])) {
                $nodePaintingCollection[strtolower($readLine[5])] = array();
			}
			array_push($nodePaintingCollection[strtolower($readLine[5])], $readLine[0]);
			$parentElement = $dataCreation['content'][sizeof($dataCreation['content']) - 1];
			$year = (int) $readLine[7];
			if ($year < (int) $_GET["start"] || $year > (int) $_GET["end"]) {
				continue;
			}
			if (sizeof($dataCreation['content']) != 0 && $readLine[6] != '1' && $parentElement[0] == $readLine[0]) {
				if (sizeof($dataCreation['content']) != 0) {
					$insertNode['source'] = strtolower(strtolower($parentElement[5]));
					$insertNode['target'] = strtolower(strtolower($readLine[5]));
					$insertNode['type'] = 'a';
					$insertNode['replicaId'] = strtolower(strtolower($readLine[0]));
					$nodeData['InNode'] = 1;
					array_push($linkData, $insertNode);
				}
			} else {
				$nodeData['InNode'] = 0;
			}
			$nodeData['name'] = strtolower($readLine[5]);
			$nodeData['profession'] = strtolower($readLine[15]);
			$nodeData['OutNode'] = 0;
			$nodeData['replicas'] = array(strtolower(strtolower($readLine[0])));
			if (!is_null($nodeHashMap[strtolower($readLine[5])])) {
				if ($readLine[6] != '1') {
					$nodeHashMap[strtolower($readLine[5])]['InNode']++;
				} else {
					$nodeHashMap[strtolower($readLine[5])]['InNode'] = 0;
				}
                array_push($nodeHashMap[strtolower($readLine[5])]['replicas'], strtolower(strtolower($readLine[0])));
				$maxInNode = max($nodeHashMap[strtolower($readLine[5])]['InNode'], $maxInNode);
				$maxTotal = max($nodeHashMap[strtolower($readLine[5])]['InNode'] + $nodeHashMap[strtolower($readLine[5])]['OutNode'], $maxTotal);
			} else {
				$nodeHashMap[strtolower($readLine[5])] = $nodeData;
			}
			if (sizeof($dataCreation['content']) != 0 && $parentElement[0] == $readLine[0] && $readLine[6] != '1') {
				$nodeHashMap[strtolower($parentElement[5])]['OutNode']++;
				$maxTotal = max($nodeHashMap[strtolower($parentElement[5])]['InNode'] + $nodeHashMap[strtolower($parentElement[5])]['OutNode'], $maxTotal);
				$maxOutNode = max($nodeHashMap[strtolower($parentElement[5])]['OutNode'], $maxOutNode);
			}
			array_push($dataCreation['content'], $readLine);
		}
		fclose($file);
	}
}
foreach ($nodeHashMap as $key => $value) {
	if (!is_null($value['name'])) {
		array_push($nodesData, $value);
	}
}
$output['data']['nodeData'] = $nodesData;
$output['data']['linkData'] = $linkData;
$output['data']['maxInNode'] = $maxInNode;
$output['data']['replicaMapping'] = $nodePaintingCollection;
$output['data']['maxOutNode'] = $maxOutNode;
$output['data']['maxTotal'] = $maxTotal;
printData(json_encode($output));
?>