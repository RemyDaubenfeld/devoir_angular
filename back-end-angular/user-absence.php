<?php

include 'header-init.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'user_id missing']);
    exit();
}

try{

    $query = $connection->prepare("SELECT * FROM absence JOIN status ON absence.status_id = status.status_id WHERE user_id = :user_id ORDER BY absence_date");
    $query->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $query->execute();
    
    
    $absenceUser = $query->fetchAll();
    
    echo json_encode($absenceUser);
    
    }catch (PDOException $e){
        echo $e->getMessage();
    }