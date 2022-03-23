<?php
	
	include_once('lib/curl_query.php');
	include_once('lib/simple_html_dom.php');

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$rawData = file_get_contents('php://input');
	
	$html = curl_get($rawData);
	$dom = str_get_html($html);
	
	$title = $dom->find('title');
	$description = $dom->find('meta[name="description"]');
	$images = $dom->find('img');
	
	foreach($images as $image){
		echo $image->href, $title, $description;
	}
	}
	

	
	
