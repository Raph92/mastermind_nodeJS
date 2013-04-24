"use strict";
var mand = {};

mand.gameSettings = function (size, dim, max) {
	return {
		getSize: function () { return parseInt(size, 10); },
		getDim: function () { return parseInt(dim, 10); },
		getMax: function () { return parseInt(max, 10); },
		nextMove: function() {
			var i = 0;
			return {	
				inc: function() {
					i += 1;
				},
				get: function() {
					return i;
				}
			}
		}()
	};
};

mand.popup = function (text, height, width, delay, id) {						 
	if ($('body').find('#myPopup').html() !== undefined) {
		$('#myPopup').remove();	
	};				
	$('body').append('<div id="myPopup" style="display : none; ">' + text + '<button type="button">X</button></div>');		
	
	$('#myPopup').css({
		'background-color': '#555555',
		'border': '3px solid #20202F',
		'padding-top' : '5px',
		'padding-left' : '5px',
		'padding-bottom' : '5px',
		'padding-right' : '30px',
		'position':'absolute',
		'top':  '20%',		
		'left': '25%',
		'height': height + 'px',
		'width': width + 'px',
		'box-shadow' : '5px 5px 10px 5px #000000'
	});		
	$('#myPopup button').css({ 
		'position':'absolute',
		'border-radius' : '20px',
		'right': '5px',
		'top': '5px',
		'width' : '25px',
		'height' : '25px'
	}).click(function () {
		$('#myPopup').remove();			
	});		
	$('#myPopup').fadeIn(delay);

	$('.popupDIV').click(function () {		
		var hex = '#' + mand.rgbToHex($(this).css('background-color'));
		$('#' + id).css('background-color', hex);
	});
};

mand.rgbToHex = function (rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function toHex(x) {
		return ('0' + parseInt(x).toString(16)).slice(-2);
	}
	return toHex(rgb[1]) + toHex(rgb[2]) + toHex(rgb[3]);
};

mand.rowWriter = function (size) {
	var i, sRow = '<tr>';
	var colorDIVs = '';			 
	var color = ['#000000', '#C0C0C0', '#808080', '#FFFFFF',
				 '#800000', '#FF0000', '#800080', '#FF00FF',
				 '#008000', '#00FF00', '#808000', '#FFFF00',
				 '#000080', '#0000FF', '#008080', '#00FFFF'];
				 
	
	
	for (i = 0; i < size; i += 1) {
		sRow += '<td><div id="answer' + i + '" class="inputs" style="box-shadow: 2px 2px #131304; border-radius: 20px;"></div></td>';	}
	sRow += '<td class="pointsNow"></td></tr>';
	$('#results').append(sRow);
	
	for (i = 0; i < color.length; i +=1) {
		colorDIVs += '<div class="popupDIV" style="background-color:' + color[i] + '; box-shadow: 2px 2px #131304; border-radius: 20px;"></div>';
	};
	
	$('.inputs').click(function () {
		mand.popup(colorDIVs, 120, 140, 100, $(this).attr('id'));
	});
};

mand.nextMove = function (pointsTab) {
	var i, print = '';
	for (i = 0; i < pointsTab[0]; i += 1) { print += ' ● '; }
	for (i = 0; i < pointsTab[1]; i += 1) { print += ' ○ '; }
	
	if (pointsTab[0] !== mand.gameSettings.getSize()) {
		$('.pointsNow').append(print).hide().fadeIn(1000);
		$('.inputs').off('click');
		$('.inputs').attr('id', '').attr('class', 'inputsHist');
		$('.pointsNow').attr('class', 'pointsHistory');
		if ( mand.gameSettings.nextMove.get() === mand.gameSettings.getDim() && mand.gameSettings.getDim() !== 0 ) {
			mand.popup('<h1>PRZEGRAŁEŚ!</h1>', 70, 200, 500);
			$('#mark').attr('disabled', 'disabled');
		} else {
			mand.rowWriter(mand.gameSettings.getSize());
		};
	} else {
		mand.popup('<h1>WYGRAŁEŚ!</h1>', 70, 170, 500);
		$('#mark').attr('disabled', 'disabled');
	}
};

$(document).ready(function () {
	mand.start = $('#start').click(function () {
		mand.gameSettings = mand.gameSettings( $('#setSize').val(), $('#setMax').val(), $('#setDim').val() );	
				
		var playGet = '/play/size/' + mand.gameSettings.getSize() + '/dim/' +
		mand.gameSettings.getDim() + '/max/' + mand.gameSettings.getMax() + '/';			
		
		$.getJSON(playGet, function(data) { 
			$.each(data, function(key, val) { 
				$('#game').prepend(val);
			});			 
		});			
		$(this).attr("autocomplete", "off");			//Bug firefoxa z blokowaniem buttona
		$('select').attr("autocomplete", "off");
		$(this).attr('disabled', 'disable'); 
		$('select').attr('disabled', 'disable');
		mand.rowWriter(mand.gameSettings.getSize());	//Rysujemy pierwszy wiersz na odpowiedzi					
	});	
	
	mand.mark = $('#mark').click(function() {
		$(this).attr("autocomplete", "off");
		mand.gameSettings.nextMove.inc();

		console.log(mand.gameSettings.nextMove.get());
		console.log(mand.gameSettings.getDim());
		
		
		var markGet = '/mark/';
						
		$('.inputs').each(function () {
			markGet += (mand.rgbToHex($(this).css('background-color'))) + '/';
		});
		
		$.getJSON(markGet, function(data) { 
			var points = [];	
			$.each(data, function(key, val) { 
				points.push(val);					
			});	
			mand.nextMove(points); //Funkcja obrazująca wyniki w postaci kropek			
		});	
	});
});

