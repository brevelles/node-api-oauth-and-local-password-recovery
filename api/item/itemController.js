// Load Item model
const Item = require('./itemModel');

exports.get = (req, res, next) => {
    Item.find({}, (err, items) => {
        if(err) {
            next(err);
        } else {
            res.json(items);
        };
    });
}

exports.getOne = (req, res, next) => {
    Item.findById({_id: req.params.id}, (err, item) => {
        if(!item) {
            res.json({message:'No item with that id'});
        } else {
            res.json(item);
        };
    });
};

exports.post = (req, res, next) => {
    const newItem = Item(req.body);
    newItem.save(newItem, (err, item) => {
        if(err) {
            next(err);
        } else {
            res.json({
                success: true,
                message: 'Item saved',
                item: item
            });
        };
    });
};

exports.put = (req, res, next) => {
    Item.findByIdAndUpdate({_id: req.params.id}, req.body, (err, item) => {
        if(err) {
            next(err);
        } else {
            res.json({
                success: true,
                message: 'Item updated'
            });
        };
    });
};


exports.delete = (req, res, next) => {
    Item.findByIdAndRemove({_id: req.params.id}, (err, item) => {
        if(err) {
            next(err);
        } else {
            res.json({
                success: true,
                message: 'Item deleted'
            });
        };
    });
};