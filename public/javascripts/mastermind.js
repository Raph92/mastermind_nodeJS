var mand = {};

mand.gameSettings = function(size, dim, max) {
	return {
		getSize: function() { return size; },
		getDim: function() { return dim; },
		getMax: function() { return max; }
	}
};
mand.rowWriter = function() {
	
};
mand.gaming = $(document).ready(function() { 
	$('#play').click(function () {		
		if(typeof mand.gameSettings === 'function'){ //Jeśli jest funkcją to jeszcze nie zapisano danych, gra nie zaczęta			
			mand.gameSettings = mand.gameSettings( $('#setSize').val(), $('#setDim').val(), $('#setMax').val() ); // Ustawienia w domknięciu		
			var toGet = '/play/size/' + mand.gameSettings.getSize() + '/dim/' + 	//Tworzenie zapytania z odpowiednimi ustawieniami
			mand.gameSettings.getDim() + '/max/' + mand.gameSettings.getMax() + '/';			
			
			$.getJSON(toGet, function(data) { 
				$.each(data, function(key, val) { 
					$('#game').prepend(val);
				}); $('#play').text("Sprawdź"); 			
			});
		} else {
			
			
		};		
	});	
});


