const fs = require('fs');
const { createHash } = require('crypto');

function getSnapSourceShasum(sourceCode) {
    return createHash('sha256').update(sourceCode, 'utf8').digest('base64');
}

fs.readFile('./dist/bundle.js', 'utf8', function(err, data){
    let shasum = getSnapSourceShasum(data);
    console.log(shasum);
});
