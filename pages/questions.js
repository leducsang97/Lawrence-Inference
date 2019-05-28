
// Work-around for missing JQuery.postJSON
jQuery["postJSON"] = function(url,data,callback) {
  $.ajax({
    url:url,
    type:'POST',
    data:JSON.stringify(data),
    contentType:'application/json',
    dataType:'json',
    success: callback
  });
};

function handleInput() {
  var attribute = $('#attribute').val();
  var question = $('#question').val();
  var responses = $('#responses').val();
  var survey = $('#survey').val();
  var userData = {attribute:attribute,question:question,responses:responses,survey:survey};
  console.log(userData);
  $.postJSON('http://cmsc106.net/Lawrence/questions?group=ASH',userData);
}
function Button(){
  document.getElementById("submit").innerHTML = "Cool, it's in!";

}
function setUp() {
  $('#submit').click(handleInput);
  $.getJSON('http://cmsc106.net/Lawrence/questions/1?group=ASH',list);

}
$(document).ready(setUp);

function getInfo(){
$.getJSON('http://cmsc106.net/Lawrence/questions/1?group=ASH',list);
}

function list(data){
  for(n=0;n<data.length;n=n+1){
    var newObject=$('<li>');
    newObject.text(data[n].name);
    $('#questions').append(newObject);
  }
}
function displayData(){

}
