<?php

    ini_set('include_path', ini_get('include_path') . ':/usr/local/livesign/etc/');
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_USER_ERROR | E_USER_WARNING | E_COMPILE_ERROR | E_COMPILE_WARNING | E_RECOVERABLE_ERROR );
    define('NODE_TYPE', 'bus');

    // Load global context variables so they can be used in path.php and load.php
    global $system_config;
    $system_config = array();
    $system_config['GLOBAL'] = parse_ini_file('ezFramework.ini');
    foreach ($system_config['GLOBAL'] as $n => $v) @define(strtoupper($n), $v, true);

    // This includes all the framework pieces (now all loaded from all.php)
    require_once('framework/all.php');

/***********************************************
 * Main initialization
 ***********************************************/

    // load system configuration
    $system_config = array();

    // These lines load the remote session handler

#    ini_set('session.save_path', SESSION_SERVER);
#    require_once('remote_session.php');

    load_definitions('flags');
    
?>
