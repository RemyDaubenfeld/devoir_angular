<?php

include 'header-init.php';


try{

    $query = $connection->query("SELECT * FROM absence JOIN user ON absence.user_id = user.user_id JOIN status ON absence.status_id = status.status_id ORDER BY absence_date");
    
    $absenceList = $query->fetchAll();
    
    echo json_encode($absenceList);
    
    }catch (PDOException $e){
        echo $e->getMessage();
    }