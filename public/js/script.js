$(function(){
  $("#username").keyup(function(){
      var val = $("#username").val();
      if(val.length<4){
        $("span").html("<b>Username should be 4 characters minimum</b>");}
      else {
        $("span").html("");
      }
      console.log('value : '+val.length);
    });
});
