exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    var newGame = function () {
        var i, data = [], puzzle = req.session.puzzle;
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }
			req.session.puzzle.data = data;
			
        return {
            'retMsg': 'Zaczynamy'
        };
    };
    // poniższa linijka jest zbędna (przy założeniu, że
    // play zawsze uzywany będzie po index) – w końcowym
    // rozwiązaniu można ją usunąć.
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
   
    if (req.params[2]) {
        req.session.puzzle.size = req.params[2];
    }
	if (req.params[4]) {
        req.session.puzzle.dim = req.params[4];
    }
	if (req.params[6]) {
        req.session.puzzle.max = req.params[6];
    }
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf8'});
    res.end(JSON.stringify(newGame()));
};

//Wyniki tylko po stronie serwera!!!
// var correctNumber = function(){
	// tab = [];
	// return{
		// setTab: function(rand){
			// tab = rand;
		// },
		// getTab: function(){
			// return tab;
		// }
	// }
// }();

exports.mark = function (req, res) {
    var markAnswer = function () {
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);
		// console.log(req.session.puzzle.data);
		
		
		
        return {
            'retVal': 'tutaj – zamiast tego napisu – ocena',
            'retMsg': 'coś o ocenie – np „Brawo” albo „Buuu”'
        };
    };
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf8'});
    res.end(JSON.stringify(markAnswer()));
};
