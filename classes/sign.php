<?php
    require_once('/usr/local/livesign/etc/livesign.php');

    class sign extends ezObj {

        /*****************************************\
        \*****************************************/

    /*  Database Definitions */
        static $_db_settings = array(
            // Table name
            'table'             =>  'signs',
            // Primary key field name
            'identifier_field'  =>  'id',
            // Informal data field
            'informal_field'    =>  'meta',
            // Table fields
            'fields'            =>  array (
                'id', 'width', 'height', 
				'ipaddr', 'registered', 'polled',
                'meta' 
            )
        );

    /*  CareView Object Settings */
        static $_ez_settings = array(
            /*  Property name translations */
            'property_translations' =>  array(
            ),
            'object_translations'   =>  array(
            ),
        );

        protected function get__ez_settings() { return self::$_ez_settings; }
        protected function get__db_settings() { return self::$_db_settings; }

/*
        protected function unpack_data (&$data) {
            foreach (array('start', 'end') as $tm) {
                if (isset($data[$tm]))
                    $data[$tm] = strtotime($data[$tm]);
            }
        }
*/
        protected function pack_data (&$data) {
            return;
        }

        /***************************************************\
        \***************************************************/

		public function get_windows () {
            if (!($windowList = $this->_cache('windowList'))) {
				$windowList = array();
//                $windowList = new objectList('windows', 'window');
				foreach (parent::fetch_all('window', 'sign = ?', array($this->id)) as $w) 
					$windowList[$w->id] = $w;
//				$windowList->_set_list($list, true);
                $this->_cache('windowList', $windowList);
            }
            return $windowList;
		}

        /***************************************************\
        \***************************************************/

		public function get_changes () {
			$db = get_db_connection();
			$res = $db->fetchAll('select c.window, c.duration, c.easing, c.type, c.name, c.old, c.new, c.changed ' .
								 ' from changes c, windows w, signs s ' .
								 ' where c.window = w.id ' .
								 ' and w.sign = s.id ' .
								 ' and s.id = ? ' .
							     ' and ( c.changed >= s.polled ) ' .
								 ' and ( c.changed <= now() ) ' .
								 ' order by c.changed', array($this->id));
			$this->polled = date('Y-m-d H:i:s');
			$this->save();
			return $res;
		}

        /***************************************************\
        \***************************************************/

        public function save () {
            $isnew = !$this->id;
            if (!($ret = parent::save())) {
                // commented this out as this is most likely a case where
                // the state simply hasn't changed
//                logger("Warning: failed to save state '{$this->id}'");
                return $ret;
            }
            return $ret;
        }

        static function &fetch ($id) { return parent::fetch('sign', $id); }

    }

