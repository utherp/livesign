<?php

    // Load global context variables so they can be used in path.php and load.php
    global $system_config;
    $system_config = array();
    $system_config['GLOBAL'] = parse_ini_file('config.ini');
    foreach ($system_config['GLOBAL'] as $n => $v) @define(strtoupper($n), $v, true);

    ini_set('include_path', ini_get('include_path') . ':/usr/local/livesign/etc');
    // This includes all the framework pieces (now all loaded from all.php)
    require_once('framework/all.php');

/***********************************************
 * Main initialization
 ***********************************************/

    // load system configuration
    $system_config = array();

    include_paths(INCLUDE_PATHS);

    load_definitions('flags');

    ini_set('session.save_path', '/usr/local/livesign/sessions');
    
?>
