$(document).ready(function(){
  $('.gameNumber').on('click', function(){
    var data = {};
    data.gameNumber = $(this).text();
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      url: 'http://localhost:3000/newGame',
      statusCode: {
        200: function(data) {
          // I think it will just render a new page with nothing on this end
        },
        400: function() {
          alert("Didn't work");
        }
      }
    });
  });
});
