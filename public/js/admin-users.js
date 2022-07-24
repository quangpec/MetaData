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
  selectAll.addEventListener('click', selectAllFunc);