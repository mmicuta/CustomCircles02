 // When the browser is ready...
  $(function() {
  
    // Create a new jQuery UI Slider element
    // and set some default parameters.
    $( "#slider" ).slider({
      range: "min",
      value: 50,
      min: 0,
      max: 100,
      slide: function( event, ui ) {
      
        // While sliding, update the value in the #amount div element
        $( "#amount" ).html( ui.value );
        
      }
    });
    
    // Set the initial slider amount in the #amount div element
    var value = $( "#slider" ).slider( "value" );
    $( "#amount" ).html( value );
    
  });