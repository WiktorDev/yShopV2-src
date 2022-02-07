var lvlup = document.getElementById("status_lvlup");
if(window.performance){
  var status1 = '<%=payment[0].lvlup_enable %>'
  if(status1 == '0'){
    lvlup.checked = false;
  }else{
    lvlup.checked = true;
  }
}

var lvlupsms = document.getElementById("status_lvlupsms");
if(window.performance){
  var status2 = '<%=payment[0].lvlupsms_enable %>'
  if(status2 == '0'){
    lvlupsms.checked = false;
  }else{
    lvlupsms.checked = true;
  }
}

var paypal = document.getElementById("status_pp");
if(window.performance){
  var status3 = '<%=payment[0].paypal_enable %>'
  if(status3 == '0'){
    paypal.checked = false;
  }else{
    paypal.checked = true;
  }
}