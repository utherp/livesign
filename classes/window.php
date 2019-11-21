<?php
    require_once('/usr/local/livesign/etc/livesign.php');

    class window extends ezObj {

        /*****************************************\
        \*****************************************/

    /*  Database Definitions */
        static $_db_settings = array(
            // Table name
            'table'             =>  'windows',
            // Primary key field name
            'identifier_field'  =>  'id',
            // Informal data field
            'informal_field'    =>  'meta',
            // Table fields
            'fields'            =>  array (
                'id', 'sign', 'parent', 
				'created', 'expires',
				'type', 'value',
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

		protected function unpack_data (&$data) {
            $propList = array('attributes' => array(), 'styles' => array());
			$list = array();
			$ret = get_db_connection()->fetchAll('select type, name, value from properties where window = ?', array($data['id']));
			foreach ($ret as $r) {
				if (!is_array($propList[$r['type']])) $propList[$r['type']] = array();
				$propList[$r['type']][$r['name']] = $r['value'];
			}
			$data['attributes'] = $propList['attribute'];
			$data['styles'] = $propList['style'];
		}
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

		protected function _post_init() { $this->get_properties(); }

		public function get_properties () {
			if (!($propList = $this->_cache('propList'))) {
                $propList = array('attributes' => array(), 'styles' => array());
				$list = array();
				$ret = get_db_connection()->fetchAll('select type, name, value from properties where window = ?', array($this->id));
				foreach ($ret as $r) {
					if (!is_array($propList[$r['type']])) $propList[$r['type']] = array();
					$propList[$r['type']][$r['name']] = $r['value'];
				}
                $this->_cache('propList', $propList);
				$this->attributes = $propList['attribute'];
				$this->styles = $propList['style'];
            }

            return $propList;
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

        static function &fetch ($id) { return parent::fetch('window', $id); }

    }

