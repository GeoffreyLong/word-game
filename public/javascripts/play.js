$(document).ready(function(){
  // The selected letter element
  var selected = null;

  $('#board').on('click', '.boardElm', function(){
    if ($(this).text() != ""){
      console.log('Contains a letter');
    }
    else{
      $(this).text($(selected).text());
      $(selected).remove();
      selected = null;
    }
  });
  
  $('#letters').on('click', '.letterElm', function(){
    selected = $(this);
  });
});
