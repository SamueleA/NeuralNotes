console.debug('login.js');
define([
    'storage/thought-storage',
    'api/google-drive-api',
    'ui/spinner/site-global-loading-bar',
    'api/google-login',
    'text!./login.html',
    'api/google-api-loader',
    'router'
], function(
    thoughtStorage,
    googleDriveApi,
    siteGlobalLoadingBar,
    googleLogin,
    loginPageHTML,
    googleApiLoader,
    router
) {
    let element;

    var spinner = siteGlobalLoadingBar.create('login');

    return {
        render: render
    };

    function render() {
        element = document.createElement('div');
        element.innerHTML = loginPageHTML;

        onRender();
        return element;
    }

    function onRender() {
        element.querySelector('#authorize-button').addEventListener('click', handleAuthClick);
    }


      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
          console.debug('login.handleAuthClick()');

          var spinnerName = 'loading google drive login';
          siteGlobalLoadingBar.show(spinnerName);
          googleApiLoader
              .load()
              .then(function() {
                  return googleLogin.gapiAuthorize()
              })
              .then(function(authResult) {
                  console.debug('login.js: auth success! calling thoughtStorage.scanDrive()');
                  siteGlobalLoadingBar.hide(spinnerName);
                  //return googleLogin.handleAuthResult(authResult);
              })
              .then(thoughtStorage.scanDrive)
              .then(function() {
                  console.info('login: drive scanned, redirecting to the app main page');
                  router.go('notes');
              });

          return false;
      }


});
