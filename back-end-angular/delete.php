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

$userId = $_GET['user_id'];

//On recupère l'utilisateur' dans la bdd
$query = $connection->prepare("SELECT * FROM user WHERE user_id = ?");
$query->execute([$userId]);
$user = $query->fetch();

//si il n'y a pas de produit on retourne une erreur 404
if(!$userId) {
    http_response_code(404);
    echo '{"message" : "Cet utilisateur n\'existe pas"}';
    exit();
}


$query = $connection->prepare("DELETE FROM user WHERE user_id = ?");

$query->execute([$userId]);

echo '{"message" : "l\'utilisateur a bien été supprimé"}';