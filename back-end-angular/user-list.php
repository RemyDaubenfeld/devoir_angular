<?php

include 'header-init.php';
include 'jwt-helper.php';

$user = extractJwtBody();

if ($user->role_name != "Administrateur") {
    http_response_code(403);
    echo '{"message" : "Vous n\'avez pas les droit nécessaire"}';
    exit();
}

try{

$query = $connection->query("SELECT user_mail, user_id, user_lastname, user_firstname, role_name FROM user JOIN role ON user.role_id = role.role_id");

$userList = $query->fetchAll();

echo json_encode($userList);

}catch (PDOException $e){
    echo $e->getMessage();
}