document.getElementById('contributionAmount').addEventListener('input', function(){
  let target = document.getElementById('contributionAmount').value;
  let format_target
  if(target){
  format_target = parseInt(target).toLocaleString('vi', {style : 'currency' ,
  currency : 'VND' });
}else{
  format_target = parseInt(0).toLocaleString('vi', {style : 'currency' ,
  currency : 'VND' });

}
  document.getElementById('targetString').innerHTML = format_target;
})