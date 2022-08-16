const _csrf = document.querySelector("#_csrf")
CKEDITOR.replace('txaContent',{
    extraPlugins:'filebrowser',
    filebrowserBrowseUrl:'/list',//upload location
    filebrowserUploadMethod:'form',
    filebrowserUploadUrl:'/admin/uploadfile?_csrf='+_csrf.value,
})
document.getElementById('target').addEventListener('input', function(){
    let target = document.getElementById('target').value;
    let format_target = parseInt(target).toLocaleString('vi', {style : 'currency' ,
    currency : 'VND' });
    document.getElementById('targetString').innerHTML = format_target;
  })