var Manuscript;

(function () {
    if(Manuscript === undefined){
        Manuscript = {};
    }

  // Return root - full path if electron, '/' if web
  Object.defineProperty(Manuscript, 'root', {
    get: function() {
      try {
        return __dirname
      } catch (e) {
        return '/'
      }
    },
    set: function () {
      throw "read only property"
    }
  });

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  Manuscript.openNav = function() {
    document.getElementById("mySidenav").style.width = "200px";
    // document.getElementById("main").style.marginLeft = "200px";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  Manuscript.closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("main").style.marginLeft = "0";
  }
  Manuscript.showItem = function(item_name){

  }
})();
