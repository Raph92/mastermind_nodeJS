var mand = {};

mand.gameSettings = function(size, dim, max) {
	return {
		getSize: function() { return size; },
		getDim: function() { return dim; },
		getMax: function() { return max; }
	}
};

mand.rowWriter = function(size) {
	var sRow = '<tr>';
	for(var i = 0; i < size; i += 1) {
		sRow += '<td><input type="text" class="inputsNow"/></td>'
	} sRow += '<td class="pointsNow"></td></tr>';
	
	$('#results').append(sRow);
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
				$.each(data, function(key, val) { 
					$('.pointsNow').append(val);
				});			
			});

			$('.inputsNow').attr('disabled', 'disabled').attr('class', 'inputsHist');

			



			
		} else {
			alert("Proszę poprawić dane w polach odpowiedzi, są błędne!");
		}
		
	});

});


//○○○●●●