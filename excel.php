<?php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$inputFileName = './docs/direct_example.xlsx';
$reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
$spreadsheet = $reader->load($inputFileName);
$sheet = $spreadsheet->getActiveSheet();
$cell = $_POST['title1'];
$sheet->setCellValue('A1', $cell);

$writer = new Xlsx($spreadsheet);
$path = './docs/direct_1.xlsx';
$writer->save($path);

echo json_encode($path)
?>