let featureExtractor;
let classifier;

export default class networkController {

    initMl5(images, instance) {

        if (images && images.length > 0) {

            // network options
            let options = {
                numClasses: NUM_CLASSES,
                batchSize: images.length
            };

            // Load MobileNet
            featureExtractor = ml5.featureExtractor('MobileNet', options, modelLoaded);

            function modelLoaded() {
                instance.state.set('status', 'Model loaded');

                setTimeout(() => {
                    // Starting featureExtractor method for classification
                    classifier = featureExtractor.classification();

                    // Starting adding images
                    networkController.prototype.addImages(images, instance);
                }, 2000);

                // var img1 = new Image();
                // img1.src = "/images/crestamento_bacteriano-1.png";
                // img1.width = 224;
                // img1.height = 224;
                // classifier.addImage(img1, 'doencaA');
            };
        }
    };

    addImages(images, instance) {
        let index = 0;
        let addImage = () => {

            if (images[index]) {
                let image = images[index];
                // Get image label to training
                let label = image.substring(0, image.indexOf('-'));

                // Instantiate new Image object
                let img = `<img id="${image}" src="/images/${FOLDER}/${image}" title="${label}" class="margin-right-5">`;
                $("#containerImages").append(img);

                let imageElement = document.getElementById(`${image}`);
                // Wait for image load
                imageElement.onload = () => {
                    classifier.addImage(imageElement, label, () => {
                        instance.state.set('processingImage', `Adding image ${index + 1}: ${image}`);
                        index++;
                        setTimeout(() => { addImage() }, 10);
                    });
                };
            } else {
                instance.state.set('status', 'Images added!');
                instance.state.set('label', `${images.length} images to train..`);
                $("#btnStartTraining").removeClass("hide");
            }
        };

        addImage();
    };

    startTraining() {
        classifier.train(function (lossValue) {
            if (lossValue == null) {
                console.log('Training Complete');
                $("#containerImageToPredict").removeClass("hide");
            } else {
                console.log(lossValue);
            }
        });
    };


    classify() {
        let image = document.getElementById('imageToPredict');
        classifier.classify(image, (err, results) => {
            console.log(results);
            $("#disease").text(results);
        });
    };

}