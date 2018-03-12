var Card = require('./models/card');

module.exports = function (app) {

    app.disable('etag');

    // api ---------------------------------------------------------------------
    // get a card by name
    app.get('/api/cards/:name', function (req, res) {
        var name = '^' + req.params.name + '$';

        Card.findOne({
            'name': {'$regex': name,$options:'i'}
        }, function (err, card) {
            if (err) {
                res.send(err);
            }

            res.json(card);
        })
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};