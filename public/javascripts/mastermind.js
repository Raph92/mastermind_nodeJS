var mand = {};

mand.gameSettings = function(size, dim, max) {
	return {
		getSize: function() { return parseInt(size); },
		getDim: function() { return parseInt(dim); },
		getMax: function() { return parseInt(max); }
	}
};

mand.rowWriter = function(size) {
	var sRow = '<tr>';
	for(var i = 0; i < size; i += 1) {
		sRow += '<td><input type="text" class="inputsNow"/></td>'
	} sRow += '<td class="pointsNow"></td></tr>';	
	$('#results').append(sRow);
};

mand.nextMove = function(pointsTab) {
	var i, print = '';
	for( i = 0; i < pointsTab[0]; i += 1) print += ' ● ';
	for( i = 0; i < pointsTab[1]; i += 1) print += ' ○ ';
	if ( pointsTab[0] !== mand.gameSettings.getSize() ) {
		$('.pointsNow').append(print).hide().fadeIn(1000);
		
		$('.inputsNow').attr('disabled', 'disabled').attr('class', 'inputsHist');
		$('.pointsNow').attr('class', 'pointsHistory');
		mand.rowWriter(mand.gameSettings.getSize());
	} else {
		alert('WYGRAŁEŚ!');
		$('#mark').attr('disabled', 'disabled');
	}
};

$(document).ready(function() {
	mand.start = $('#start').click(function () { 		
		mand.gameSettings = mand.gameSettings( $('#setSize').val(), $('#setDim').val(), $('#setMax').val() );	
		
		var playGet = '/play/size/' + mand.gameSettings.getSize() + '/dim/' +
		mand.gameSettings.getDim() + '/max/' + mand.gameSettings.getMax() + '/';			
		 
		$.getJSON(playGet, function(data) { 
			$.each(data, function(key, val) { 
				$('#game').prepend(val);
			});			 
		});			
		$(this).attr('disabled', 'disable'); 
		$('select').attr('disabled', 'disable');
		mand.rowWriter(mand.gameSettings.getSize());	//Rysujemy pierwszy wiersz na odpowiedzi					
	});	

	mand.mark = $('#mark').click(function() {
		//Sprawdzenie poprawności udzielonych odpowiedzi	
		var isCorrect = true;			
					
		$('.inputsNow').each(function(index) {			
			if( isCorrect === true ) {
				isCorrect = /^\d+$/.test( $(this).val() );	
				if ( parseInt( $(this).val() ) > mand.gameSettings.getDim() ) isCorrect = false; //Ujemne nie przejda w regex
			}			
		});	
		
		//Dane poprawne, wysyłamy requesta
		if( isCorrect ) {
			var markGet = '/mark/';			
			$('.inputsNow').each(function(index){
				markGet += $(this).val() + '/';
			});
			
			$.getJSON(markGet, function(data) { 
				var points = [];	
				$.each(data, function(key, val) { 
					points.push(val);					
				});	
				mand.nextMove(points); //Funkcja obrazująca wyniki w postaci kropek			
			});
			
		} else {
			alert("Proszę poprawić dane w polach odpowiedzi, są błędne!");
		}
	});
});

