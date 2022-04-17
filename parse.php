<?php

include_once 'simple_html_dom.php';

$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);
$url = strip_tags($data['url']);

    function dlPage($url, $referer = 'https://google.com/') {
       

                $ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36");
		curl_setopt($ch, CURLOPT_REFERER, $referer);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);	
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		$data = curl_exec($ch);               
		curl_close($ch);

		return $data;
        }
        $html = dlPage($url);
        $dom_tree = str_get_html($html);

echo $dom_tree;
?>