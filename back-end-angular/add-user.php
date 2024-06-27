<?php

include 'header-init.php';
include 'jwt-helper.php';

$user = extractJwtBody();

if ($user->role_name != "Administrateur") {
    http_response_code(403);
    echo '{"message" : "Vous n\'avez pas les droit nécessaire"}';
    exit();
}

//tansformer le JSON en objet PHP contenant les informations de l'utilisateur
$json = file_get_contents('php://input');

// Le convertit en objet PHP
$user = json_decode($json);

//verifier l'email de l'utilisateur est unique
$query = $connection->prepare("SELECT * FROM user WHERE user_mail = :user_mail");
$query->execute(["user_mail" => $user->user_mail]);
$userExist = $query->fetch();

if ($userExist) {
    http_response_code(409); //note : 409 = CONFLICT
    echo '{"message" : "Cet email est déjà utilisé"}';
    exit();
}

//on récupère le role par rapport au nom indiqué dans le JSON
$query = $connection->prepare("SELECT role_id FROM role WHERE role_name = :role_name ");
$query->execute(['role_name' => $user->role_name]);
$role=$query->fetch();

//si le role n'existe pas, on renvoie une erreur 400
if(!$role) {
    http_response_code(400);
    echo '{"message" : "Le rôle n\'existe pas"}';
    exit();
}

//On ajoute l'utilisateur dans la base de données
$query = $connection->prepare("INSERT INTO user(user_mail,user_password,user_firstname, user_lastname, role_id) 
                                VALUES (:user_mail, :user_password, :user_firstname, :user_lastname, :role_id)");

$query->execute([
    "user_mail" => $user->user_mail,
    "user_password" => password_hash($user->user_password, PASSWORD_DEFAULT),
    "user_firstname" => $user->user_firstname,
    "user_lastname" => $user->user_lastname,
    "role_id" => $role['role_id']
]);

echo '{"message" : "L\'utilisateur a bien été ajouté dans la base de données."}';