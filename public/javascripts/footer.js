function autoHeight() {

    if ( document.body.clientHeight < window.innerHeight ) {
        document.querySelector('#footer').style.position = 'absolute';
        document.querySelector('#footer').style.bottom = '0';
    }
}

document.addEventListener("DOMContentLoaded", function() {
  autoHeight();
});