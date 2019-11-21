function(){
	var jLI = $( "li" );
	 
	// Loop over each list istem to set up link.
	jLI.each(
		function( intI ){
			var jThis = $( this );
			var jLink = $( "<a></a>" );
			 
			// Set the link text (trim text first).
			jLink.text(
				jThis.text().replace(
					new RegExp( "^\\s+|\\s+$", "g" ),
					""
				)
			);
			 
			// Set the link href based on the IMDB
			// attribute of the list item.
			jLink.attr({
				"href": jThis.attr( "bn:imdb" ),
				"bn:rel": "Pretty Cool Ladies"
			});
			 
			// Replace the LI content with the link.
			jThis
				.empty()
				.append( jLink );
		}
	);
}
  
