<?php

$rawData = file_get_contents('php://input');
$arr = json_decode($rawData, true);
$keys = [];

for ($i=0; $i < count($arr); $i++) { 
    $sizes = getimagesize($arr[$i]);
    if (isset($sizes)) {
        if (($sizes[0] < 450) || ($sizes[1] < 450) || ($sizes[2] > 3)) {
            array_push($keys, $i);
        }
    }
}

$keys = array_reverse($keys);
for ($i=0; $i < count($keys); $i++) {
    array_splice($arr, $keys[$i], 1);
}

echo json_encode($arr);

?>