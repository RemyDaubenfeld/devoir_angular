<?php

include 'header-init.php';
include 'jwt-helper.php';

try {
    // Extraire le corps du JWT pour obtenir l'user_id
    $jwt = extractJwtBody();
    $user_id = $jwt->user_id;

    //tansformer le JSON en objet PHP contenant les informations de l'utilisateur
    $json = file_get_contents('php://input');

    // Le convertit en objet PHP
    $absence = json_decode($json);


    $file = null;

    $absence_date = date('Y-m-d', strtotime($_POST['absence_date']));

    $absence_date = date('Y-m-d', strtotime($absence_date . ' +1 day'));

    if (isset($_FILES['absence_proof']) && $_FILES['absence_proof']['error'] == 0) {
        $authorizedFileTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/pdf',
        ];

        $fileType = mime_content_type($_FILES['absence_proof']['tmp_name']);
        $fileExtension = pathinfo($_FILES['absence_proof']['name'], PATHINFO_EXTENSION);

        if (in_array($fileType, $authorizedFileTypes) && $_FILES['absence_proof']['type'] == $fileType) {
            $file = $user_id . '-absence_du_' . $absence_date . '-déclaré_le_' . date('Y-m-d') . '.' . $fileExtension;
            
            if (!move_uploaded_file($_FILES['absence_proof']['tmp_name'], "proof/$file")) {
                echo json_encode(["message" => "Une erreur s'est produite lors du téléchargement du fichier, veuillez recommencer."]);
                exit();
            }
        } else {
            echo json_encode(["message" => "Le fichier doit être au format: pdf, jpg, jpeg, png."]);
            exit();
        }
    }

    // Préparer et exécuter la requête d'insertion
    $query = $connection->prepare("INSERT INTO absence (absence_date, absence_reason, absence_proof, status_id, user_id) 
                                   VALUES (:absence_date, :absence_reason, :absence_proof, :status_id, :user_id)");
    $query->execute([
        "absence_date" => $absence_date,
        "absence_reason" => $_POST['absence_reason'],
        "absence_proof" => $file,
        "status_id" => 1,
        "user_id" => $user_id
    ]);

    echo json_encode(["message" => "L'absence a bien été enregistrée."]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}