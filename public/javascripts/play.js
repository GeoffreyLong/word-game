$(document).ready(function(){
  // The selected letter element
  var selected = null;
  var turnNumber = 0;

  $('#board').on('click', '.boardElm', function(){
    if ($(this).text() != ""){
      console.log('Contains a letter');
    }
    else{
      $(this).text($(selected).text());
      $(this).removeClass('existent');
      $(selected).remove();
      selected = null;
    }
  });
  
  $('#letters').on('click', '.letterElm', function(){
    selected = $(this);
  });

  $('#submit').click(function(){
    console.log('Submit clicked');

    // Call a function to compile all the words
    compileWords();
    // Call a function to check if the words are valid
    // If they are then 
    //    Increment the turnNumber
    //    Reassemble the board
  });

  function compileWords(){
    console.log('Compiling Words');
    var words = [];

    // Iterate over rows
    $('#board tr').each(function() {
      var tempWord = '';
      var newWord = false;

      $(this).find('td').each(function(){
        // Get the button from the td
        var button = $(this).find('button');
        var curLetter = $(button).text();
        if (curLetter.length != 0){
          if (!$(button).hasClass('existent')){
            newWord = true;
          }
          tempWord += curLetter;
        }
        else{
          if (tempWord.length && newWord){
            words.push(tempWord);
            console.log(tempWord);
          }
          tempWord = '';
          newWord = false;
        }
      });

      // Get the words that are on the edge (end in a letter) 
      if (tempWord && newWord){
        words.push(tempWord);
        console.log(tempWord);
      }
    });



    // Iterate over columns
    var numberOfTDs = $('#board tr:nth-child(1)').find('td').length;
    for (var i = 1; i <= numberOfTDs; i++){
      $('#board tr td:nth-child('+i+')').each(function () {
        console.log($(this).find('button').text());

        //TODO same exact thing as above... recycle logic 
      });
    }
  }
});

