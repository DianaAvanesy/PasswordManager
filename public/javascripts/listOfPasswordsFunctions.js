
// Function that provides search. Taken from stackoverflow
function searchTableByWebsite() {
/** Not the main feature! Modified and taken from: https://stackoverflow.com/questions/42451865/how-do-i-iterate-through-each-td-and-tr-in-a-table-using-javascript-or-jquery */
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("search");
        filter = input.value.toUpperCase();
        table = document.getElementById("table");
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    };


function confirmDeletion() {
    return confirm('Are you sure you want to delete this password enity?');
};

//Function that will show password or hide when called
function swapPasswordVisibility(show, hide)
{
   divPasswordShow = document.getElementById(show);
   divPasswordHide = document.getElementById(hide);
   if( divPasswordHide.style.display == "none" )
   {
      divPasswordShow.style.display = "none";
      divPasswordHide.style.display = "block";
   }
   else
   {
      divPasswordShow.style.display = "block";
      divPasswordHide.style.display = "none";
   }
};