<?php

include 'header-init.php';
include 'jwt-helper.php';

try {
    $jwt = extractJwtBody();
    $user_id = $jwt->user_id;

    //tansformer le JSON en objet PHP contenant les informations de l'utilisateur
    $json = file_get_contents('php://input');

    // Le convertit en objet PHP
    $lateness = json_decode($json);

    $query = $connection->prepare("INSERT INTO lateness(lateness_date,lateness_reason, user_id) 
                                    VALUES (:lateness_date, :lateness_reason, :user_id)");

    $query->execute([
        "lateness_date" => $lateness->lateness_date,
        "lateness_reason" => $lateness->lateness_reason,
        "user_id" => $user_id
    ]);

    echo '{"message" : "Le retard a bien été enregistré."}';
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}
