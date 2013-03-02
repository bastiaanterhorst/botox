var Botox = {

  __loading: false,
  __history: {},
  __rootUrl: "",
  __currentState: {},
  __currentTarget: {},
  __currentData: {},
  __previousData: {},

  init: function(){
    Botox.__history = window.History;
    if ( !History.enabled ) {
      // bail if history is not supported
      return false;
    }

    // get the root url of the site
    Botox.__rootUrl = History.getRootUrl();

    // assign the click handler to appropriate links
    $(document).on('click', 'a:not(.no-botox):not([data-remote])', Botox.handleUrl);

    // respond to state changes by loading the requested page through xhr
    $(window).bind('statechange', Botox.stateChange);

    // we're ready
    $(Botox).trigger('BotoxReady');

  },

  handleUrl: function(e) {

    // get the url to load
    var url = $(this).attr('href');
    var title = $(this).attr('title') || null;

    // no xhr if the link is not internal
    if(!(url.substring(0,Botox.__rootUrl.length) === Botox.__rootUrl || url.indexOf(':') === -1)) {
      return true;
    }

    // no xhr if the link was cmd-clicked
    if ( e.which == 2 || e.metaKey ) {
      return true;
    }

	// no xhr if the link points to an item that is served from the systems folder	
	if (url.indexOf("/system/") == 0) {
		return true;
	}

    // we're good, xhr this link
    History.pushState(null,title,url);

    // remember the element that triggered this load
    Botox.__currentTarget = e.currentTarget;
    
    // trigger an event that a state has been pushed
    $(Botox).trigger('BotoxStatePushed', Botox.__currentState.url);

    // prevent the browser from handling the link
    e.preventDefault();
    return false;
  },

  stateChange: function(e) {
    // we'll be loading soon
    $(Botox).trigger('BotoxDataWillLoad', Botox.__currentState.url);
    Botox.setLoading(true);
    Botox.__currentState = Botox.__history.getState();
    Botox.loadRequest(Botox.__currentState.url, Botox.requestLoaded);
  },

  loadRequest: function(url, callback) {
    // perform the request
    $.getJSON(url, callback);
  },

  requestLoaded: function(response, textStatus, jqXHR) {
    // loading has completed
    Botox.setLoading(false);

    // set new values
    Botox.__previousData = Botox.__currentData;
    Botox.__currentData = response;

    // let the world know we're done, and pass along the current and last responses
    $(Botox).trigger('BotoxDataDidLoad', [Botox.__currentData, Botox.__previousData]);
  },

  requestError: function(jqXHR, textStatus, errorThrown) {
    $(Botox).trigger('BotoxDataLoadError', Botox.__currentState.url);
    return false;
  },

  setLoading: function(loading) {
    loading = (loading==true) ? true : false;
    Botox.__loading = loading;
  }

};
