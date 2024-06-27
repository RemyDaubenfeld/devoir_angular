<?php

include 'header-init.php';


if (!isset($_GET['user_id'])) {
    echo '{"message" : "il n\'y a pas d\'identifiant dans l\'URL"}';
    http_response_code(400);
    exit;
}

$query = $connection->prepare("SELECT user_mail, user_id, role_name, user_firstname, user_lastname FROM user JOIN role ON user.role_id = role.role_id WHERE user_id = ?");
$query->execute([$_GET['user_id']]);

$user = $query->fetch();

if (!$user) {
    echo json_encode(["message" => "Utilisateur inexistant"]);
    http_response_code(404);
    exit;
}

echo json_encode($user);