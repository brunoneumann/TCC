import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import networkController from './networkController.js';
import './app.html'
import '../../lib/constants.js';

Template.app.onRendered(function () {
    $('#imageToPredict').cropper('destroy');
    $('#imageToPredict').attr('src', '');
});

Template.app.onCreated(function () {
    this.state = new ReactiveDict();
    this.state.set('status', 'Iniciando MobileNet..');

    let self = this;

    Meteor.call("listDataToTraining", (err, images) => {
        arrayImages = images;

        networkController.prototype.initMl5(images, self);
    });

});

Template.app.helpers({
    'status': function () {
        return Template.instance().state.get('status');
    },
    'label': function () {
        return Template.instance().state.get('label');
    },
    'processingImage': function () {
        return Template.instance().state.get('processingImage');
    },
    'results': function() {
        return Template.instance().state.get('results');
    }
});

Template.app.events({

    'click [id=btnStartTraining]': function (e, tmpl) {
        networkController.prototype.startTraining(tmpl);
    },

    'change [id=fileUploaded]': function (e, tmpl) {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            
            console.log("carregando novos arquivos");
            
            $('#imageToPredict').attr('src', '');

            let reader = new FileReader();

            reader.onerror = function (e) {
                reader.abort();
            };

            reader.onload = function (evt) {
                $('#imageToPredict').attr('src', evt.target.result);
                $('#imageToPredict').css("width", "100%").css("height", "auto");

                setTimeout(() => {
                    $('#imageToPredict').cropper({
                        aspectRatio: 120 / 120,
                        dragMode: 'move',
                        viewMode: 2,
                        autoCropArea: 0.50,
                        restore: false,
                        modal: true,
                        guides: false,
                        highlight: false,
                        cropBoxMovable: true,
                        cropBoxResizable: false,
                        movable: false,
                        zoomable: true
                    });

                    $("#btnStartPredict").attr("disabled", false), $("#btnStartPredict").removeClass("hide");

                }, 2000);
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    },

    'click [id=btnStartPredict]': function (e, tmpl) {
        let canvas = $("#imageToPredict").cropper("getCroppedCanvas", {
            width: 120,
            height: 120,
            fillColor: '#fff',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });
        let dataImage = canvas.toDataURL("image/jpeg");

        $('#imageToPredict').cropper('destroy');
        $('#imageToPredict').attr('src', '');

        $("#btnStartPredict").addClass("hide");

        setTimeout(() => {
            $('#imageToPredict').attr('src', dataImage);
            $('#imageToPredict').css("width", "120").css("height", "120");

            $("#tableDiseases").removeClass("hide");

            setTimeout(() => {
                networkController.prototype.classify(tmpl);
            },500);
        }, 800);
    },

})
