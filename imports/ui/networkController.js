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
                instance.state.set('status', 'Model carregado!');

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
                        instance.state.set('processingImage', `Adicionando imagem ${index + 1}: ${image}`);
                        index++;
                        setTimeout(() => { addImage() }, 10);
                    });
                };
            } else {
                instance.state.set('status', 'Imagens adicionadas!');
                instance.state.set('label', `${images.length} imagens para treinar..`);
                $("#btnStartTraining").removeClass("hide");
            }
        };

        addImage();
    };

    startTraining(instance) {
        classifier.train(function (lossValue) {
            if (lossValue == null) {
                instance.state.set('status', 'Treinamento completo!');
                instance.state.set('label', 'Escolha uma imagem para classificar');
                instance.state.set('processingImage', '');
                $("#labelErrorTax").text("");
                $("#containerImageToPredict").removeClass("hide");
                $("#trainingPanel").addClass("hide");
            } else {
                $("#labelErrorTax").text("Valor de perda: "+lossValue);
            }
        });
    };


    classify(instance) {
        let image = document.getElementById('imageToPredict');
        classifier.classify(image, (err, results) => {
            let array = [];
            results.forEach((element, index) => {
                array.push({
                    label: element.label,
                    confidence: `${element.confidence * 100} %`
                });

                if(index===(results.length-1)) {
                    instance.state.set('results', array);
                }
            });
            console.log(results);
        });
    };

}