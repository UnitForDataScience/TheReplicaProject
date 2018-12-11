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
		$file = fopen($paintingsDir . $_GET['name'] . "/data.csv", "r");
		$dataCreation['headers'] = fgetcsv($file);
		$dataCreation['content'] = array();
		$socialGraph = array();
		$collection = array();
		$nodesData = array();
		$linkData = array();
		$nodeHashMap = array();
		$collection = array();
		$maxInNode = 0;
		$maxOutNode = 0;
		$nodePaintingCollection = array();
		$maxTotal = 0;
		while (!feof($file)) {
			//A particular data line is read

			$readLine = fgetcsv($file);

			if ($_GET["replicaName"] != 'All' && $_GET["replicaName"] != $readLine[0]) {
				continue;
			}
			$year = (int) $readLine[7];
			if ($year < (int) $_GET["start"] || $year > (int) $_GET["end"]) {
				continue;
			}
			if(is_null($nodePaintingCollection[strtolower($readLine[5])])) {
                  $nodePaintingCollection[strtolower($readLine[5])] = array();
            }
            array_push($nodePaintingCollection[strtolower($readLine[5])], $readLine[0]);
			$parentElement = $dataCreation['content'][sizeof($dataCreation['content']) - 1];
			//Setting up the node
			if (sizeof($dataCreation['content']) != 0 && $readLine[6] != '1' && $parentElement[0] == $readLine[0]) {
				$insertNode['source'] = strtolower(strtolower($parentElement[5]));
				$insertNode['target'] = strtolower(strtolower($readLine[5]));
				$insertNode['type'] = 'a';
				$insertNode['replicaId'] = strtolower(strtolower($readLine[0]));
				$nodeData['InNode'] = 1;
				array_push($linkData, $insertNode);
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
		foreach ($nodeHashMap as $key => $value) {
			if (!is_null($value['name'])) {
				array_push($nodesData, $value);
			}

		}
		$output['data']['nodeData'] = $nodesData;
		$output['data']['linkData'] = $linkData;
		$output['data']['maxInNode'] = $maxInNode;
		$output['data']['maxOutNode'] = $maxOutNode;
		$output['data']['maxTotal'] = $maxTotal;
		$output['data']['replicaMapping'] = $nodePaintingCollection;
	}
}
printData(json_encode($output));
?>