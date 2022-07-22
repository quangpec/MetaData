const url = document.querySelector('#url');
const linkFilter = document.querySelector('#linkFilter');
function gotoUrl(){
    linkFilter.href='/admin/projects?'+url.value;
    console.log(linkFilter.href)
}
url.addEventListener('change',gotoUrl);