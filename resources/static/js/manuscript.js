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
  if(window.__args__ && window.__args__.config) {
    window.localStorage.setItem('config', JSON.stringify(window.__args__.config))
  }
  Manuscript.config = JSON.parse(window.localStorage.getItem('config'));

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

  Manuscript.db = {};

  Manuscript.db.savePost = function(post, id) {
    if(id) {
      // If an ID is provided, update the existing record
      return Manuscript._db.posts.update({_id: id}, post, {upsert: true})
    } else {
      // Otherwise, save as a new item
      return Manuscript._db.posts.save(post);
    }
  };

  Manuscript.db.getPostsByTitle = function(title) {
    return Manuscript._db.posts.find({
      title: title
    })
  };

  Manuscript.db.getPostByTitle = function(title) {
    return Manuscript._db.posts.findOne({
      title: title
    })
  };

  Manuscript.db.getPostsById = function(_id) {
    return Manuscript._db.posts.find({
      _id: _id
    })
  };

  Manuscript.db.getPostById = function(_id){
    return Manuscript._db.posts.findOne({
      _id: _id
    })
  };

  /**
   * Wrapper to query the database - allows for limit/offset options
   * @param options.offset: Defines start position of search results
   * @param options.limit: Defines how many results to return
   * @returns {Array} of database objects
   */
  Manuscript.db.find = function (query, options) {
    options = options || {};
    let offset = options.offset || 0;
    let limit = (( options.limit === 0 ? Infinity : options.limit ) || 25) + offset;
    let results = Manuscript._db.posts.find(query);
    let rLen = results.length;
    let ret = [];

    // store limit and rLen in varaibles to avoid doing math each loop
    for(i = offset; i < limit && i < rLen; i++) {
      ret.push(results[i])
    }

    return ret;
  };

  Manuscript.db.findOne = function (query, options) {
    return Manuscript.db.find(query, options)[0];
  };

  Manuscript.tags = {};

  /**
   * Update all tags registered with Manuscript
   * @param options - Options to pass to each tag
   */
  Manuscript.updateTags = function (options) {
    //todo: use this
    for(let tag in Manuscript.tags){
      Manuscript.tags[tag].update(options);
    }
  };

  Manuscript.showTab = function (tabId) {
    $('ul.tabs').tabs('select_tab', 'tab-' + tabId);

    // Store the user's last select tab
    window.localStorage.setItem('tab', tabId);
  };
})();
