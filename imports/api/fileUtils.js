import { Meteor } from "meteor/meteor";

var _getAllFilesFromFolder = function(dir) {
    var filesystem = require("fs");
    var results = [];
    filesystem.readdirSync(dir).forEach(function(file) {
        if (!file.startsWith('.') && file !== 'node_modules') {
        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            try {                   
                results = results.concat(_getAllFilesFromFolder(file))
            } catch (error) {
                results = results.concat(error)
            }
        } else results.push(file);
    }
    });
    return results;
};
console.log(_getAllFilesFromFolder(process.env.PWD));

const fs = require("fs");
const pathImages = `/bundle/programs/web.browser/app/images/${FOLDER}/`;

if (Meteor.isServer) {

    Meteor.methods({
        'listDataToTraining': function () {
            let arrayImages = [];
            fs.readdirSync(pathImages).forEach(file => {
                arrayImages.push(file);
            });

            return arrayImages;
        }
    });
}
