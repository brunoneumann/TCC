import { Meteor } from 'meteor/meteor';
import { BrowserPolicy } from 'meteor/browser-policy-common';
import '../lib/constants.js';
import '../imports/api/fileUtils.js';

Meteor.startup(() => {
    BrowserPolicy.content.allowOriginForAll("*");
});
