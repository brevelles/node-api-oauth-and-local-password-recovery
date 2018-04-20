// Load dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Item schema
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// Custom ItemSchema methods
ItemSchema.statics.getItemById = function(id, callback){
    this.findOne(id, callback);
};
ItemSchema.statics.getItemByName = function(name, callback) {
    query = {name: name};
    this.findOne(query, callback);
};

// Export Item model
module.exports = mongoose.model('Item', ItemSchema);