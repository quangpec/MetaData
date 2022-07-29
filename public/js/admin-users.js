const selectAll = document.querySelector('#selectAll');
const selectElement = document.querySelectorAll('.selectElement');
function selectAllFunc() {
    for (var sel in selectElement) {
      if (selectAll.checked) {
        selectElement[sel].checked = true;
      } else {
        selectElement[sel].checked = false;
      }
    }
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
   delMany.addEventListener('click',delManyFunc);
  selectAll.addEventListener('click', selectAllFunc);