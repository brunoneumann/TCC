import { Meteor } from 'meteor/meteor';
import { BrowserPolicy } from 'meteor/browser-policy-common';
import '../imports/api/fileUtils.js';


Meteor.startup(() => {
    BrowserPolicy.content.allowOriginForAll("*");
});
