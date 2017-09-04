var Manuscript;

(function () {
  if (Manuscript === undefined) {
    Manuscript = {};
  }

  try {
    Manuscript.root = __dirname + '/'
  } catch (e) {
    Manuscript.root = '/'
  }

  // Make user config available to frontend
  Manuscript.config = window.__args__.config;

  // Set up logging with Toast and console messages
  /**
   * Log a message to the console and to the user via TOAST
   * @param message   Message to display to user
   * @param detail    Details to dump to log
   * @param timeout   TOAST timeout (Forever if undefined)
   * @param className Classname of the TOAST (use for color)
   * @private
   */
  Manuscript._message = function(message, detail, timeout, className) {
      console.log(message, detail !== undefined ? detail : '');
      // Wrap in doc ready check incase logging is called before page loads
      $(document).ready(function () {
        Materialize.toast(message, timeout || undefined, className || undefined)
      });
  };
  /**
   * Log an informational message
   * @param message Friendly message for the user
   * @param details Detailed message for the log
   */
  Manuscript.info = function (message, details) {
    Manuscript._message(message, details, 4000)
  };
  /**
   * Log an error message
   * @param message Friendly message for the user
   * @param details Detailed message for the log
   */
  Manuscript.error = function (message, details) {
    Manuscript._message('Error: ' + message, details, undefined, 'red')
  };
  /**
   * Log a warning message
   * @param message Friendly message for the user
   * @param details Detailed message for the log
   */
  Manuscript.warning = function (message, details) {
    Manuscript._message('Warning: ' + message, details, 10000, 'orange')
  };

  try {
    // Attempt to connect to the database, and sends an error via toast if it fails
    Manuscript._db = require('diskdb');
    if(!Manuscript._db.connect(Manuscript.config.dataDirectory, ['posts'])) {
      throw "Could not connect to database";
    }
    Manuscript.info("Successfully connected to database");
  } catch (e) {
    Manuscript.error('Database initialization error', e);
  }

  Manuscript.savePost = function(post, id) {
    if(id) {
      // If an ID is provided, update the existing record
      return Manuscript._db.posts.update({_id: id}, post, {upsert: true})
    } else {
      // Otherwise, save as a new item
      return Manuscript._db.posts.save(post);
    }
  };

  Manuscript.getPostsByTitle = function(title) {
    return Manuscript._db.posts.find({
      title: title
    })
  };

  Manuscript.getPostByTitle = function(title) {
    return Manuscript._db.posts.findOne({
      title: title
    })
  };

  Manuscript.getPostsById = function(_id) {
    return Manuscript._db.posts.find({
      _id: _id
    })
  };

  Manuscript.getPostById = function(_id){
    return Manuscript._db.posts.findOne({
      _id: _id
    })
  };

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  Manuscript.openNav = function () {
    document.getElementById("mySidenav").style.width = "200px";
    // document.getElementById("main").style.marginLeft = "200px";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  Manuscript.closeNav = function () {
    document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("main").style.marginLeft = "0";
  }
  Manuscript.showItem = function (item_name) {

  }
})();
