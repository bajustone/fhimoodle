<?php
require_once(__DIR__ . "../../../config.php");
require_once($CFG->dirroot . '/local/coursebackup/classes/utils/restore.php');

$course_id = $_GET['course_id'];
// Initialize a file URL to the variable
$url = 'https://petrolpath.com/moodle/api/?course_id=' . $course_id;

$file_name = "course_" . $course_id . ".mbz";
$destination_dir = $CFG->courseBackupDir;

$resultObj = new stdClass;

$resultObj->success = false;

// require_login((int) $course_id, false);
if (!is_writable($destination_dir) or !is_dir($destination_dir)) {
        $resultObj->status = true;
        $resultObj->message = "course-backup is not a valid destination dir";
} else {
        $file_final_name = $destination_dir . DIRECTORY_SEPARATOR . $file_name;

        try {
                $course_file = file_get_contents($url);
                if(!$course_file){
                       $restoreResult->message = "could not download course files";
                       echo (json_encode($resultObj));
                       die(); 
                }
                $file = fopen( $file_final_name, 'wb' );
                if(!fwrite( $file, $course_file )){
                        $restoreResult->message = "could not save course files";
                        echo (json_encode($resultObj));
                        die();  
                }
                $restore = new restore_all_courses($file_name);
                $restoreResult = $restore->execute_restore_plan((int) $course_id, 1);
                $resultObj->status = true;
                $resultObj->message = "course synced successfully";
        } catch (Exception $e) {
                $resultObj->message = $e->message;
        }
}
echo (json_encode($resultObj));
