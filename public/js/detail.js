document.getElementById('contributionAmount').addEventListener('input', function(){
  let target = document.getElementById('contributionAmount').value;
  console.log(target);
  let format_target = parseInt(target).toLocaleString('vi', {style : 'currency' ,
  currency : 'VND' });
  document.getElementById('targetString').innerHTML = format_target;
})