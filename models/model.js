var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
	email: { type: String, required: true},
	selections: [Number],
	dateAdded : { type: Date, default: Date.now },
})

// export 'Collection' model so we can interact with it in other files
module.exports = mongoose.model('Collection',collectionSchema);