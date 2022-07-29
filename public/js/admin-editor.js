const _csrf = document.querySelector("#_csrf")
CKEDITOR.replace('txaContent',{
    extraPlugins:'filebrowser',
    filebrowserBrowseUrl:'/list',//upload location
    filebrowserUploadMethod:'form',
    filebrowserUploadUrl:'/admin/uploadfile?_csrf='+_csrf.value,
})
