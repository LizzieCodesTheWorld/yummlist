var shoppingApp = {};

shoppingApp.apiKey = '58c4ec16abb8bc536b83d95dbb8c80b2';
shoppingApp.apiId = '4180c144';
shoppingApp.numRecipes = 0; //RECIPE NUMBER LIST STARTS ON
var recipeDisplayNumber = 0


$(function(){
  shoppingApp.init();  
});

shoppingApp.init = function(){
 	$('#cuisine').on('change', function(){
 		var cuisine = $(this).val();
 		shoppingApp.cuisine = cuisine;
 	});

 	$('#course').on('change', function(){
 		var course = $(this).val();
 		shoppingApp.course = course;
 		shoppingApp.searchRecipe('recipe'); 
 	}); 
 };

shoppingApp.searchRecipe = function(){
	shoppingApp.numRecipes = recipeDisplayNumber + 3;
	recipeDisplayNumber = recipeDisplayNumber + 3;
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipes?',
		dataType:'jsonp',
		method: 'GET',
		data:{
			_app_id: shoppingApp.apiId,
			_app_key:shoppingApp.apiKey,
			format: 'jsonp',
			maxResult: 3,
			start: shoppingApp.numRecipes,
			requirePictures:true,
			allowedCourse:"course^course-" + shoppingApp.course,
			allowedCuisine: "cuisine^cuisine-" + shoppingApp.cuisine
		}
	}).then(function(res){ 	
			shoppingApp.displayFood(res);

			// shoppingApp.maxResult = shoppingApp.maxResult +1;
			console.log(res);
			$('.getRecipes').one('click', function() {
			   $('.getShoppingList').removeClass('hide');
			   $('main').removeClass('hide');
			   $('footer').removeClass('hide');
			   $('a').smoothScroll({
			   		 offset: 25,
			   		 speed: 500
			   	});	
			 });
});

//----------displays recipe cards-------------------//

shoppingApp.displayFood = function(res) {
	$.each(res.matches, function(i, value) {
			//creates variables for recipe card info
			var recipeTitle = $('<h2>').addClass('recipeTitle').text(value.recipeName);
			var time = $('<h4>').addClass('time').text('Preparation time: ' + value.totalTimeInSeconds/60 + ' minutes');
	        var image = $('<img>').addClass('image').attr('src', value.imageUrlsBySize[90].replace(/s90/g,'s300'));
	        var ingredientsList = $('<h3>').addClass('ingredientTitle').text('List of Ingredients:');
	        var ingredients = $('<p>').addClass('ingredientTitle').text(value.ingredients);
	        var checkboxLabel = $('<label for="checkBox" class="checkboxLabel">').html('&#10003');
	        var checkbox = $('<input type="checkbox" class="userSelectedRecipe hide" id="checkBox">').val(value.id).addClass('selectedRecipes')
	        ;
	        var checkboxText = $('<p>').addClass('addToList').text('Add to Shopping list:').append(checkbox)
	        ;
	        var selectRecipeBox = $('<div>').addClass('selectRecipeBox').append(checkboxText, checkbox);
	        var recipeContainer = $('<div>').addClass('displayedRecipe').append(recipeTitle, checkboxLabel, time, selectRecipeBox, image, ingredientsList, ingredients );
	        
	        //appends recipe info to recipe cards
	        $('#selectedRecipes').append(recipeContainer); 
		});
};
};

//----------END DISPLAY RECIPE-------------------//

// //----------GET INGREDIENTS LIST-------------------//

//runs ajax call to get recipes with ingredients
shoppingApp.getRecipeId = function(recipeId) {
	$.ajax({
		url: `http://api.yummly.com/v1/api/recipe/${recipeId}?`,
		dataType:'jsonp',
		method: 'GET',
		data:{
			_app_id: shoppingApp.apiId,
			_app_key:shoppingApp.apiKey,
			format: 'jsonp',
			requirePictures:true,
		}
	}).then(function(res){   
		console.log(res);
		shoppingApp.displaySelectedIngredients(res);
	});
};

//add ingredients to ingredients list
shoppingApp.displaySelectedIngredients = function(res) {
	$.each(res.ingredientLines, function(i, value) {
			var value = (value);
			var shoppingList = $('<li>').html('<input type="checkbox" class="userSelectedRecipe"> ' + value);
	        $('.paper').append(shoppingList); 
		});
};

//shows ingredients list
$('.getShoppingList').on('click', function () {
	$('.shoppingListSection').removeClass('hide');
	$recipeIdInputs = $('input:checked.userSelectedRecipe');
	$recipeIdInputs.each(function (key, input){
	shoppingApp.getRecipeId(input.value);
	});
});
// //----------GET INGREDIENTS LIST END-------------------//

//------------LOAD MORE -------------------//

$('.loadMore').on('click', function(){
	shoppingApp.searchRecipe ();
});

//------------ END LOAD MORE -------------------//


//strikethrough ingredients on ingredient list 
$('label').on('click', function() {
  $('.checkboxLabel').addClass('checkboxLabelSelected');
});


$('.fa-times-circle').on('click', function(){
	 $('.shoppingListSection').addClass('hide');
});






