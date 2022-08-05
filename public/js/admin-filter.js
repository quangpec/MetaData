const url = document.querySelector('#url');
const urlUser = document.querySelector('#urlUser')
const linkFilter = document.querySelector('#linkFilter');
const linkFilterUser = document.querySelector('#linkFilterUser')
function gotoUrl(){
    linkFilter.href='/admin/projects?'+url.value;
    linkFilterUser.href='/admin/users?'+urlUser.value;
    console.log(urlUser.value);
}
url.addEventListener('change',gotoUrl);
urlUser.addEventListener('change',gotoUrl);
