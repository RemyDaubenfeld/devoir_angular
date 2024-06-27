<?php

include 'header-init.php';
include 'jwt-helper.php';

$user = extractJwtBody();

if ($user->role_name != "Administrateur") {
    http_response_code(403);
    echo '{"message" : "Vous n\'avez pas les droit nécessaire"}';
    exit();
}

if (!isset($_GET['user_id'])) {
    echo '{"message" : "il n\'y a pas d\'identiant dans l\'URL"}';
    http_response_code(400);
    exit;
}

// Prend les données brutes de la requête
$json = file_get_contents('php://input');

// Le convertit en objet PHP
$user = json_decode($json);


//On recupère l'utilisateur dans la bdd
$query = $connection->prepare("SELECT * FROM user WHERE user_id = ?");
$query->execute([$_GET['user_id']]);
$userDb = $query->fetch();

//si il n'y a pas d'utilisateur on retourne une erreur 404
if (!$userDb) {
    http_response_code(404);
    echo '{"message" : "Cet utilisateur n\'existe pas"}';
    exit();
}

// si l'utilisateur n'a pas fourni le mot de passe, on lui affecte l'ancien
// sinon on hash le mot de passe à modifier
if(!$user->user_password == ''){
    $user->user_password = $UserDb['user_password'];
} else {
    $user->user_password =password_hash($user->user_password, PASSWORD_DEFAULT);
}

// On récupère l'id du role à affecter à l'utilisateur

$query = $connection->prepare("SELECT role_id FROM role WHERE role_name = ?");
$query->execute([$user->role_name]);
$role = $query->fetch();

if(!$role) {
    http_response_code(400);
    echo '{"message" : "Ce rôle n\'existe pas"}';
    exit();
}


$query = $connection->prepare("UPDATE user SET user_mail = :user_mail, user_firstname = :user_firstname, user_lastname = :user_lastname, user_password = :user_password, role_id = :role_id WHERE user_id = :user_id");

$query->execute([
    "user_mail" => $user->user_mail,
    "user_firstname" => $user->user_firstname,
    "user_lastname" =>  $user->user_lastname,
    "user_password" => $user->user_password,
    "role_id" => $role['role_id'],
    "user_id" => $_GET['user_id']
]);

echo '{"message" : "L\'utilisateur a bien été modifié"}';