delimiter //
CREATE PROCEDURE create_object(pclass, pname, pcreator)
BEGIN
	DECLARE done INT DEFAULT 0;
	DECLARE objid INT;
	DECLARE propname VARCHAR(100);
	DECLARE proptype, propdisp VARCHAR(16);
	DECLARE propval BLOB;
    DECLARE clsprop CURSOR for select name, type, disposition, `default` from class_properties where class = pclass;

	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

	OPEN clsprop;

	INSERT INTO objects (class, name, creator) values (pclass, pname, pcreator);
	SET @objid = select last_insert_id();

	REPEAT
		FETCH clsprop INTO propname, proptype, propdisp, propval;
		IF NOT done THEN
			INSERT INTO properties (object, disposition, name, value) values (objid, propdisp, propname, propval);
		END IF;
	UNTIL done END REPEAT;

	CLOSE clsprop;
END

delimiter ;

