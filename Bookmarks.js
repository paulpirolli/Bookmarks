define( ["qlik", "text!./template.html"],
	function ( qlik, template ) {

		return {
			template: template,
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function () {
				return qlik.Promise.resolve();co
			},
			controller: ['$scope', function ( $scope ) {

				function creatDropValues(bookmarks){
					var vreturn = '';
					$.each(bookmarks,function(position,bookmark){
						vreturn += '<option id="bookmark'+position+'" value="'+bookmark.app.id+'|'+bookmark.engineObjectId+'"><strong>' +bookmark.app.name +'</strong> - '+bookmark.name +'</option>'
					});
					return vreturn;
				};
				function removeAllChildNodes(domElem) {
					var parent = document.getElementById(domElem);
					while (parent.children.length > 1) {
						if(parent.firstChild.selected === false || parent.firstChild.selected === undefined){
							parent.removeChild(parent.firstChild);
						}else{
							parent.removeChild(parent.children[1]);
						}
					}
				};

				var hRefMask = location.pathname.substring(0,location.pathname.indexOf('/sense/'));

				qlikExtBookmarks.onclick = function loadQlikBookmarks(){
					
					console.log(hRefMask);
					//clean up old bookmark dropdown
					removeAllChildNodes('qlikExtBookmarks')
					
					$.ajax({
						url: hRefMask + "/qps/user?xrfkey=GAMG717cpRsrx7xR",
						type: "GET",
						headers: {
							"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
						},
					success: function (user){

						$.ajax({ 	
							url: hRefMask + "/qrs/app/object/full?xrfkey=GAMG717cpRsrx7xR&filter=objectType eq 'bookmark' and app.published eq true and owner.userId eq '" + user.userId + "'",
							type: "GET",
							headers: {
								"X-Qlik-XrfKey":"GAMG717cpRsrx7xR",
								"X-Qlik-User": user.userId
							},
							success: function(bookmarks){
								$('#qlikExtBookmarks').append(creatDropValues(bookmarks));
							},
							error: function(err){
								console.log(err);
							}
						});
					},
					error: function (error){
						console.log(error)
						}
					});
				};
				//onchange handles when a value is selected in the dropdown
				qlikExtBookmarks.onchange = function navigateBookmark(){
				
					//get dropdown selection, split value to create array with [0] app ID & [1] Bookmark Engine ID
					var selectBox = document.getElementById("qlikExtBookmarks");
					var selectedValue = selectBox.options[selectBox.selectedIndex].value.split('|');
					
					//next series of commands is to retrieve a sheet from the app with the bookmark. Any sheet works; the referenced bookmark will force navigation to the appropriate sheet.
					$.ajax({
						url: hRefMask + "/qrs/app/object/full?xrfkey=GAMG717cpRsrx7xR&filter=objectType eq 'sheet' and published eq true and app.id eq "+selectedValue[0],
						type: "GET",
						headers: {
							"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
						},
					success: function (sheets){
					
						//build myRef url with random 1st sheet & navigate to URL in new tab
						var myRef = location.href.substring(0,location.href.indexOf('app/'));
						myRef += 'app/' + selectedValue[0] + '/sheet/' + sheets[0].engineObjectId + '/state/analysis/bookmark/' + selectedValue[1];
						window.open(myRef,'_blank');
					},
					error: function (error){
						console.log(error)
						}
					});//*/
					
				}
				//$scope.html = "Hello World";
			}]
		};

	} );

