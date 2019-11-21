<?php
    /********************************************************
     * These are misc functions for the EZ Node
     * framework.  This file should not be included directly
     * as it is included by ezFramework.php
     *
     * -- Stephen  2010-06-28
     */

    require_once('ezFramework.php');

    /* Misc functions */

    /****************************************
     * this function records the trigger name, event name and current timestamp
     * it is most likely to be removed/replaced soon
     *      -- Stephen 2010-06-28
     */

    function record_trigger_time($trigger_name, $event_name = false) {
        if ($event_name !== false)
            file_put_contents(abs_path(EVENTS_META_FILE), $event_name . '('.time().")\n", FILE_APPEND);
        return file_put_contents(abs_path(TRIGGER_LOG_PATH, $trigger_name), time() . "\n", FILE_APPEND);
    }


    /***********************************************
     * Functions for getting the mac and ip addr
     ***********************************************/

    function get_mac() {
        return trim(exec(
                '/sbin/ifconfig | ' . 
                '/bin/grep '. NETWORK_INTERFACE . ' | ' . 
                "/bin/sed 's/.*HWaddr //g'"
            ));
    }

    /***********************************************/

    function get_ip() {
        return trim(exec(
            '/sbin/ifconfig ' . NETWORK_INTERFACE . ' | /bin/grep "inet addr" | ' .
            '/bin/sed \'s/^[^0-9]*\([0-9\.]*\).*/\1/\''
        ));
    }

    /***********************************************/
    /***********************************************/

    function get_proto() {
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTOCOL'])) {
            if ($_SERVER['HTTP_X_FORWARDED_PROTOCOL'] == 'ON') {
                return 'https://';
            }
        }
        return 'http://';
    }
    /***********************************************/
    function get_host($hostname = false) {
        $bus = load_this_bus();
        if (!$hostname) {
            $bouncepath = '/buses/' . $bus->get_hostname();
            $hostname = $bus->get_hostname() . '.' . DOMAIN_NAME . WEB_ROOT;
        } else if ($bus->get_hostname() . '.' . DOMAIN_NAME == SERVER_HOST) {
            $bouncepath = SERVER_WEB_ROOT;
            $hostname = SERVER_HOST . '.' . DOMAIN_NAME;
        }

        if (isset($_SERVER['HTTP_X_FORWARDED_HOST']) && $_SERVER['HTTP_X_FORWARDED_HOST'] != $_SERVER['HOST_NAME'])
            return $_SERVER['HTTP_X_FORWARDED_HOST'] . $bouncepath;

        return $hostname;
    }
    /***********************************************/

