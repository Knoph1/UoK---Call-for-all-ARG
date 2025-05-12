<div class="position-fixed bottom-0 end-0 p-1 mr-5 " style="z-index:1051">
  <div id="liveToast" class="toast custom-toast" role="alert" aria-live="assertive" aria-atomic="true">

    <div id="toastheader" class="toast-header text-white ">
      <strong id="toastmessage_body" class="me-auto py-2 text-center">

      </strong>
      <button id="btn_close_toast" type="button" class="btn-close btn-light" data-bs-dismiss="toast"
        aria-label="Close"></button>
    </div>
  </div>
  <script>
    function showtoastmessage(response) {


      var toastEl = document.getElementById('liveToast');
      if (toastEl) {
        var toastbody = document.getElementById('toastmessage_body');
        var toastheader = document.getElementById('toastheader');
        toastheader.classList.remove('bg-primary', 'bg-success', 'bg-danger', 'bg-info', 'bg-warning', 'bg-secondary');


        if (response && response.type) {
          if (response.type == "success") {
            toastheader.classList.add('bg-success');
          }
          else if (response.type == "warning") {
            toastheader.classList.add('bg-warning');
          }
          else {
            toastheader.classList.add('bg-danger');
          }
        }
        else {
          toastheader.classList.add('bg-danger');
        }
        toastbody.innerText = response && response.message ? response.message : "No Message";
        var toast = new bootstrap.Toast(toastEl, {
          animation:true,
          autohide: true,
          delay: 2000
        });
        toast.show();
      }
    }

  </script>
</div>