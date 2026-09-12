<?php
header("Content-Type: application/json; charset=utf-8");
$dir=__DIR__;
$dataFile=$dir."/data.json";
$uploadDir=$dir."/uploads/";
function getData(){global $dataFile; return json_decode(file_get_contents($dataFile),true);}
function saveData($d){global $dataFile; file_put_contents($dataFile,json_encode($d,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));}
$action=$_GET["action"]??"data";
if($action==="data"){echo json_encode(getData(),JSON_UNESCAPED_UNICODE);exit;}
if($action==="save"){
  if($_SERVER["REQUEST_METHOD"]!=="POST"){http_response_code(405);exit;}
  $d=json_decode(file_get_contents("php://input"),true);
  if(!$d){http_response_code(400);echo json_encode(["error"=>"bad data"]);exit;}
  saveData($d); echo json_encode(["ok"=>true]);exit;
}
if($action==="upload"){
  if(empty($_FILES["image"])){http_response_code(400);echo json_encode(["error"=>"no image"]);exit;}
  $f=$_FILES["image"];
  $info=@getimagesize($f["tmp_name"]);
  if(!$info){http_response_code(400);echo json_encode(["error"=>"invalid image"]);exit;}
  $ext=image_type_to_extension($info[2],false);
  if(!in_array(strtolower($ext),["jpg","jpeg","png","webp"])){http_response_code(400);echo json_encode(["error"=>"unsupported"]);exit;}
  $name="person_".bin2hex(random_bytes(8)).".".$ext;
  if(!move_uploaded_file($f["tmp_name"],$uploadDir.$name)){http_response_code(500);echo json_encode(["error"=>"upload failed"]);exit;}
  echo json_encode(["ok"=>true,"image"=>"uploads/".$name]);exit;
}
http_response_code(404); echo json_encode(["error"=>"not found"]);
?>