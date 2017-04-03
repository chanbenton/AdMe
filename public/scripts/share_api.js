window.fbAsyncInit = function() {
  FB.init({
    appId      : '267633323688936',
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
  console.log("FB app now initiated")
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));

$(document).ready(() => {
  document.getElementById('fb').onclick = function() {
    FB.init({ appId: `267633323688936`, status: true, cookie: true, version:'v2.8'});
    FB.ui({
      method: 'share',
      display: 'popup',
      name: 'Facebook Dialogs',
      href: 'localhost:8080/view/2',
      link: 'https://developers.facebook.com/docs/dialogs/',
      picture: 'http://image.ibb.co/m8x55a/solution.jpg',
      caption: 'Click here to share',
      description: 'your description'
    }, function(response){});
  }

})
