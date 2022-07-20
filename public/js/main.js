const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const selectAll = document.querySelector('#selectAll');
const selectElement = document.querySelectorAll('.selectElement');
const delMany = document.querySelector('#delMany');
const formDel = document.querySelector('#formDel');
const del = document.querySelector("#del");
function del_del(){
  console.log(del);
  setTimeout(() => {
    del.remove();
  }, 3000);
}
function delManyFunc(){
 let listId = [];
 for (var i =0; i<selectElement.length; i++) {
  if(selectElement[i].checked){
    const Id = selectElement[i].id.split("_");
    listId.push(Id[1]);
  } 
 }
 const strId = listId.toString();
 document.getElementById("listId").value=strId;
}

function selectAllFunc() {
  for (var sel in selectElement) {
    if (selectAll.checked) {
      selectElement[sel].checked = true;
    } else {
      selectElement[sel].checked = false;
    }
  }
}

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);
selectAll.addEventListener('change', selectAllFunc);
delMany.addEventListener('click',delManyFunc)
document.addEventListener('DOMContentLoaded',del_del);