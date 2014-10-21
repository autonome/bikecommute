# Firefox OS Bike Commuting App

This app uses the NFC API in Firefox OS to register tags with a "bcm:your@email.com" text record.

It stores the entries in PouchDB, and displays them in a UI built with Famo.us.

## TODO

* Convert to using VCF contact records
* Sync using PouchDB replication to a remote CouchDB
* Allow registration through the app on device, using NFC write API
