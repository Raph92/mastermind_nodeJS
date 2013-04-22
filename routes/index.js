exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    var newGame = function () {
        var color = ['000000', 'c0c0c0', '808080', 'ffffff',
					 '800000', 'ff0000', '800080', 'ff00ff',
					 '008000', '00ff00', '808000', 'ffff00',
					 '000080', '0000ff', '008080', '00ffff'];		

		
		var i, data = [], puzzle = req.session.puzzle;
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(color[Math.floor(Math.random() * puzzle.dim)]);
        }
			req.session.puzzle.data = data;
		
		
		console.log("Pula wygrywająca: " + data);
        return {
            'retMsg': 'Mastermind'
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

exports.mark = function (req, res) {
    var markAnswer = function () {
		var winTab = req.session.puzzle.data;
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);	
		var points = { 'black' : 0,	'white' : 0	};
		var founds = [];
		
		var inTab = function( tab, item ) {
			var found = false;
			for(var i = 0; i < tab.length; i += 1) {
				if ( tab[i] === item ) found = true;
			};
			return found;
		};
			
		for ( var i = 0; i < move.length; i += 1 ) {
			for( var j = 0; j < winTab.length; j += 1 ) {
				if ( winTab[j] === move[i] ) {
					if( j === i) {
						points.black += 1;
					} else {
						if ( winTab[j] !== move[j] ) {
							if ( inTab(founds, move[i]) === false ) {
								points.white += 1;
								founds.push(move[i]);
							}
						}
					}
				}
			}		
		};
			
        return points;
    };
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf8'});
    res.end(JSON.stringify(markAnswer()));
};
