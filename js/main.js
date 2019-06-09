$(document).ready(function(){
	var options = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		timezone: 'UTC'
	};

	var item = ""; // просмотр одного элемента
	var list = []; // сохранение json в массив
	var searchList = []; // сохранение найденых (в поиске) элементов

	var itemsList = "https://cdn.sozvezdie-tour.ru/demo_offers.json";

// получение и парсинг json
	function getItemsList(){
		return new Promise((resolve, rejected) => {
			$.getJSON( itemsList, {
				format: "json"
			}).done(function(data){
				resolve(data);
			})
		})
	}
// шаблонизатор
	function constructor(obj){
		var source   = $("#data-template").html();
		var template = Handlebars.compile(source); 
		var context = obj;
		context.map(function(elem){
		if (elem.photoCard && elem.photoCard["thumbnail"]) {
			elem.url = elem.photoCard["thumbnail"];
		};
			elem.startDate = new Date(elem.periodStart).toLocaleString("ru", options);
		});
		$("#goods").html(template(context));
	}

	function readfile(){
		$("#goods").html("");
		$("#goods").css("display", "grid");
		$("#show_item").css("display", 'none');
		getItemsList()
			.then(
			response => {
				constructor(response);
				list = response;
			})
			.then(
				response => {
					$(".hidden-box").on('click', function(e){
						e.preventDefault();
						let needElemID = e.target.closest(".hidden-box").id;
						list.map(function(q){
							if(q.id == needElemID){
								item = q;
							}
						})
						showItemBlock();						
					});
					$('.search').on('input', function(e){
						e.preventDefault();
						search();
					})
				},
				error => console.log(`${error}`)
				);
	}
	readfile()
// готовим полное описание
	function showItemBlock(){
		if(item){
			$(".item_img").attr('src', item.photoCard['photo']);
			$('.item_description').html(item.description);
			for(var key in item.photoAlbum){
				$('.item_photos').append("<img src="+item.photoAlbum[key].thumbnail+">");
			}
			$('.return').on('click', function(e){
				e.preventDefault();
				readfile();
			})
			
			$("#show_item").css("display", 'block');
			$("#goods").css("display", "none");
		}
	}
// поиск
	function search(value){
		var searchValue = $('.input_value').val().trim();
		if(searchValue == ''){
			readfile();
		}else{
			searchList = [];
			list.map(function(q){
				var titleMap = q.title.indexOf(searchValue);
				if(titleMap != -1){
					searchList.push(q);
				}
			})
			$("#goods").html("");
			constructor(searchList);
		}


	}

});