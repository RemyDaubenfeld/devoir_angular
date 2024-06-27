<?php

include 'header-init.php';
include 'jwt-helper.php';

$user = extractJwtBody();

if ($user->role_name === "Etudiant") {
    http_response_code(403);
    echo '{"message" : "Vous n\'avez pas les droit nécessaire"}';
    exit();
}

if (!isset($_GET['absence_id'])) {
    echo '{"message" : "il n\'y a pas d\'identiant dans l\'URL"}';
    http_response_code(400);
    exit;
}

try {

    $query = $connection->prepare("UPDATE absence SET status_id = :status_id WHERE absence_id = :absence_id");
                                   
    $query->execute(["status_id" => 2,
                    "absence_id" => $_GET['absence_id']]);

    echo json_encode(["message" => "L'absence est passé en injustifiée."]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}