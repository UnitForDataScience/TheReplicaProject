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
		$output["message"] = "Painting Replicas found";
		$output["data"] = scandir($paintingsDir . $_GET['name'] . '/Replicas');
	}
}
printData(json_encode($output));
?>