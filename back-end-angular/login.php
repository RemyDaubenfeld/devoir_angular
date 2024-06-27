<?php

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'header-init.php';
include 'jwt-helper.php';

//tansformer le JSON en objet PHP contenant les informations de l'utilisateur
$json = file_get_contents('php://input');

// Le convertit en objet PHP
$user = json_decode($json);

// vérifier que l'utilisateur existe dans la base de donnée
$query = $connection->prepare("SELECT user_id, user_mail, user_firstname, user_lastname, user_password, role_name FROM user JOIN role ON user.role_id = role.role_id WHERE user_mail = :user_mail");

$query->execute([
    "user_mail" => $user->user_mail,
]);

$userDb = $query->fetch();

if (!$userDb) {
    http_response_code(403);
    echo '{"message" : "email ou mot de passe incorrect"}';
    exit();
}

//verifier si le mot de passe en clair de l'utilisateur est compatible avec le mot de passe hashé en bdd
if (!password_verify($user->user_password, $userDb['user_password'])) {
    http_response_code(403);
    echo '{"message" : "email ou mot de passe incorrect"}';
    exit();
}

$jwt = generateJwt($userDb);

$response = [
    "jwt" => $jwt,
    "user" => [
        'user_id' => $userDb['user_id'],
        'user_mail' => $userDb['user_mail'],
        'user_firstname' => $userDb['user_firstname'],
        'user_lastname' => $userDb['user_lastname'],
        'role_name' => $userDb['role_name']
    ]
];

echo json_encode($response);