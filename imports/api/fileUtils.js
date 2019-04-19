import { Meteor } from "meteor/meteor";

const fs = require("fs");
const pathImages = `${process.env.PWD}/public/images/${FOLDER}/`;

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