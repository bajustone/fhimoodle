<?php
require_once(__DIR__ . "../../../../../config.php");
require_once($CFG->libdir . '/clilib.php');
require_once($CFG->dirroot . "/backup/util/includes/restore_includes.php");

class restore_all_courses
{

    protected string $courseBackupFile;
    function __construct($backupFileName)
    {
        global $CFG;
        $this->courseBackupFile = $CFG->courseBackupDir . DIRECTORY_SEPARATOR . $backupFileName;
    } 
    function execute_restore_plan(int $courseId, $categoryId = 1)
    {
        global $CFG, $DB;
        $admin = get_admin();
        if (!$admin) die();
        $backupdir = "restore_" . uniqid();
        $path = $CFG->tempdir . DIRECTORY_SEPARATOR . "backup" . DIRECTORY_SEPARATOR . $backupdir;
        $fp = get_file_packer("application/vnd.moodle.backup");
        $fp->extract_to_pathname($this->courseBackupFile, $path);
        try {
            list($fullname, $shortname) = restore_dbops::calculate_course_names(
                $categoryId,
                get_string('restoringcourse'),
                'backup',
                get_string('restoringcourseshortname', 'backup')
            );
            $course = $DB->get_record('course', array('id' => $courseId));

            if ($course->id) {
                $courseId = $course->id;
            } else {

                $this->create_new_course($courseId, $fullname, $shortname, $categoryId);
            }
            $rc = new restore_controller(
                $backupdir,
                $courseId,
                backup::INTERACTIVE_NO,
                backup::MODE_GENERAL,
                $admin->id,
                backup::TARGET_NEW_COURSE
            );

            $rc->execute_precheck();
            $rc->execute_plan();
            $rc->destroy();

            return true;
        } catch (Exception $e) {
            fulldelete($path);
            return false;
        }
    }
    function create_new_course($courseid, $fullname, $shortname, $categoryid)
    {
        global $DB;
        $category = $DB->get_record('course_categories', array('id' => $categoryid), '*', MUST_EXIST);

        $course = new stdClass;
        $course->id = $courseid;
        $course->fullname = $fullname;
        $course->shortname = $shortname;
        $course->category = $category->id;
        $course->sortorder = 0;
        $course->timecreated  = time();
        $course->timemodified = $course->timecreated;
        // forcing skeleton courses to be hidden instead of going by $category->visible , until MDL-27790 is resolved.
        $course->visible = 0;

        $courseid = $this->insert_record('course', $course);

        $category->coursecount++;
        $DB->update_record('course_categories', $category);

        return $courseid;
    }
    function insert_record($table, $dataobject, $returnid = true, $bulk = false, $customsequence = true)
    {
        global $DB;
        $dataobject = (array)$dataobject;

        $columns = $DB->get_columns($table);
        if (empty($columns)) {
            throw new dml_exception('ddltablenotexist', $table);
        }

        $cleaned = array();

        foreach ($dataobject as $field => $value) {

            if (!isset($columns[$field])) {
                continue;
            }
            $column = $columns[$field];
            $cleaned[$field] = $this->normalise_value($column, $value);
        }

        return $DB->insert_record_raw($table, $cleaned, $returnid, $bulk, $customsequence);
    }

    function normalise_value($column, $value)
    {
        $this->detect_objects($value);

        if (is_bool($value)) { // Always, convert boolean to int
            $value = (int)$value;
        } else if ($value === '') {
            if ($column->meta_type == 'I' or $column->meta_type == 'F' or $column->meta_type == 'N') {
                $value = 0; // prevent '' problems in numeric fields
            }
            // Any float value being stored in varchar or text field is converted to string to avoid
            // any implicit conversion by MySQL
        } else if (is_float($value) and ($column->meta_type == 'C' or $column->meta_type == 'X')) {
            $value = "$value";
        }
        return $value;
    }

    function detect_objects($value)
    {
        if (is_object($value)) {
            throw new coding_exception('Invalid database query parameter value', 'Objects are are not allowed: ' . get_class($value));
        }
    }
}
