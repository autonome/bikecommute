/*

TODO:
* memory storage
* store email, timestamp
* persist storage
* store location
* sync storage to orchestrate
* make website
* add leaderboard to website
* add maps to website

NEXT:
* push to IFTTT
* bot in #mozpdx

QUESTIONS:
* how to generalize the app? make each record configurable in NFC? eg: channel name
* make a client version?

Blocked:
* integrate with mozillians api when it's ready

*/


var db = null;

define(function(require, exports, module) {
  var EventArbiter = require('famous/events/EventArbiter');

  db = new PouchDB('bike');
  /*
  setTimeout(function() {
    var remoteCouch = 'https://moz.iriscouch.com/blahblahblah';
    var options = { live: true };
    db.replicate.to(remoteCouch, options);
    db.replicate.from(remoteCouch, options);
  }, 0);
  */

  //var translate = navigator.mozL10n.get;

  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var View = require('famous/core/View');
  var Modifier = require('famous/core/Modifier');
  var ScrollView  = require('famous/views/ScrollView');

  var mainContext = Engine.createContext();
  var layout = new HeaderFooterLayout({
    headerSize: 60,
    footerSize: 0,
    contentSize: undefined
  });

  mainContext.add(layout);

  layout.header.add(new Surface({
    content: "<h1>B  I  K  E</h1>",
    size: [undefined, 80],
    classes: ["grey-bg"],
    properties: {
      textAlign: "center"
    }
  }));

  /*
  layout.footer.add(new Surface({
    content: "Footer",
    classes: ["grey-bg"],
    properties: {
      lineHeight: "50px",
      textAlign: "center"
    }
  }));
  */

  var commuterView = new ScrollView();
  var commuterSurfaces = [];

  commuterView.sequenceFrom(commuterSurfaces);
  layout.content.add(commuterView);

  function addRowToSurface(obj) {
    var content  = '<div class="list-item">'
      //content += '<img class="list-icon" width="30" src="img/' + listContents[i].type.toLowerCase() + '-icon.png" />';
      content += '<div class="list-subject">' + obj.email + '</div>';
      //content += '<span class="list-type">' + listContents[i]['type'] + '</span>';
      //content += '<img class="list-arrow" width="20" src="img/arrow-icon.png" />';
      content += '</div>';
    var row = new Surface({
      content: content,
      size: [undefined, 50],
      properties: {
        borderBottom:  '1px solid lightgrey'
      }
    });
    row.pipe(commuterView);
    commuterSurfaces.push(row);
  }

  // Get all docs
  // TODO: only get today's docs
  console.log('getting docs...')
  db.allDocs({include_docs: true, descending: true}, function(err, docs) {
    console.log('got docs', docs.rows.length)
    // Iterate over docs
    docs.rows.forEach(function(row) {
      //db.remove(row.doc)
      addRowToSurface(row.doc);
    });
  });

  db.info(function(err, info) {
    db.changes({
      since: info.update_seq,
      include_docs: true,
      live: true
    }).on('change', function(resp) {
      addRowToSurface(resp.doc);
    });
  });

});


if (navigator.mozSetMessageHandler) {

  // TODO: change to vcf
  function NFCActivityHandler(activity) {
    var text = activity.source.data.text;
    if (!text) {
      console.log('nfc: no text records in tag')
      notify('No text records found in our tag!')
    }
    else if (text.indexOf('bcm:') === 0) {
      var email = text.substr(4)
      registerRider(email)
      try {
        console.log('nfc: found matching text record on tag')
        notify('Registered ' + email)
      } catch(ex) {
        console.error('notification failed', ex)
      }
    }
    else {
      console.log('nfc: no matching text record on tag')
      notify('No email found! Is your tag text correct?')
    }
  }

  navigator.mozSetMessageHandler('activity', NFCActivityHandler);
}

function registerRider(email) {
  console.log('rr', email)
  var d = new Date();
  db.put({
    _id: d.toString(),
    ts: d,
    email: email 
  })

  try {
    (new Audio('bicyclebell.wav')).play()
  } catch(ex) {
    console.error('bike sound', ex)
  }
  console.log('rr done')
}

function notify(text) {
  var n = new Notification("B I K E", {body: text});
}

/*
setTimeout(function() {
  registerRider('a@b.com')
}, 500)
*/
