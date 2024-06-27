<?php

include 'header-init.php';


try{

    $query = $connection->query("SELECT * FROM lateness JOIN user ON lateness.user_id = user.user_id ORDER BY lateness_date");
    
    $latenessList = $query->fetchAll();
    
    echo json_encode($latenessList);
    
    }catch (PDOException $e){
        echo $e->getMessage();
    }