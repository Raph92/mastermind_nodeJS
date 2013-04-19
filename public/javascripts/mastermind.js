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
	mand.start = $('#start').click(function () { //Zapisywanie ustawień		
		mand.gameSettings = mand.gameSettings( $('#setSize').val(), $('#setDim').val(), $('#setMax').val() );	
		
		var playGet = '/play/size/' + mand.gameSettings.getSize() + '/dim/' +
		mand.gameSettings.getDim() + '/max/' + mand.gameSettings.getMax() + '/';			
		 
		$.getJSON(playGet, function(data) { 
			$.each(data, function(key, val) { 
				$('#game').prepend(val);
			});			 
		});			
		mand.rowWriter(mand.gameSettings.getSize());					
	});	

	mand.mark = $('#mark').click(function() {
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

		
	});

});


//○○○●●●