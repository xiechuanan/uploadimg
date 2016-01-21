<?php
// 上传图片
$base64_url = $_POST['base64_url']; // 这个值有问题
$base64_url = str_replace('%2B',"+",$base64_url);
if (!file_exists("./Uploads/")) {
	mkdir("./Uploads/", 0777, true);
}

$base64_body = substr(strstr($base64_url,','),1);
$img = base64_decode($base64_body);
$targetName = './Uploads/'.date('YmdHis').rand(1000,9999).'.png';
if (file_put_contents($targetName,$img)){
	exit($targetName);
} else {
	exit('fail');
}

?>