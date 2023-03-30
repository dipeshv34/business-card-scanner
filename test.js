const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: "business-scanner-382220-7f07efe496d7.json",
});

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
// const fileName = 'Local image file, e.g. /path/to/image.png';

// Performs text detection on the local file

(async () => {
    const [result] = await client.textDetection('./test.jpg');
    const detections = result.textAnnotations;
    console.log('Text:');   
    detections.forEach(text => console.log(text));
})();
