<?php

include 'header-init.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'user_id missing']);
    exit();
}

try{

    $query = $connection->prepare("SELECT * FROM lateness where user_id = :user_id ORDER BY lateness_date");
    $query->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $query->execute();
    
    
    $latenessUser = $query->fetchAll();
    
    echo json_encode($latenessUser);
    
    }catch (PDOException $e){
        echo $e->getMessage();
    }