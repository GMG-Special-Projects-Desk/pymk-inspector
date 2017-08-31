const Nightmare = require('nightmare');
const vo = require('vo');
const nightmare = Nightmare({
  show: true,
  electronPath: require('electron-nightmare')
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export const run = function*(creds) {
  yield nightmare
    .goto('https://www.facebook.com/friends/requests/?fcref=jwl')
    .type('#email', creds.username)
    .type('#pass', creds.password)
    .click('#loginbutton')
    .wait(2000)

 var previousHeight=0;
 var currentHeight=1;
  console.log('HERE')
  while(previousHeight !== currentHeight) {
    previousHeight = currentHeight;
    var currentHeight = yield nightmare.evaluate(function() {
      var body = document.querySelector('body')
      return body.scrollHeight;
    });

    yield nightmare.scrollTo(getRandomInt(previousHeight, currentHeight), 0)
      .wait(1000);
  }


  var html = yield nightmare.evaluate(function() {
    return document.getElementById('fbSearchResultsBox').innerHTML
  });
  yield nightmare.end();
  return html
}

  // Nightmare.action('scroller', function (done) {
  //   this.evaluate_now(function test () {
  //     var body = document.querySelector('body')
  //     if (!((window.scrollY + window.innerHeight) + 200 > body.clientHeight)) {
  //       window.scrollBy(0, 500)
  //       window.setTimeout(test, 500)
  //     } else {
  //       return {'status': 'complete'}
  //     }
  //   }, done)
  // })