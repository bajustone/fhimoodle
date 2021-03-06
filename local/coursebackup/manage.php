<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * This script lists all the instances of quiz in a particular course
 *
 * @package    coursebackup
 * @author     BAHATI Justin
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once(__DIR__ . "../../../config.php");
require_once($CFG->dirroot.'/local/coursebackup/classes/form/restore.php');
require_once($CFG->dirroot.'/local/coursebackup/classes/utils/restore.php');

$PAGE->set_url(new moodle_url("/local/coursebackup/manage.php"));
$PAGE->set_context(\context_system::instance());
$PAGE->set_title("Restore courses");
$templateContext = (object)[
    "scriptsPath" => $CFG->wwwroot . "/local/coursebackup/front-end/build/index.js" 
];
require_login((int) $course_id, false);
echo($OUTPUT->header());

echo($OUTPUT->render_from_template("local_coursebackup/manage", $templateContext));

echo($OUTPUT->footer());