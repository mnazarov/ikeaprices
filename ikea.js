/* TODO:
 * sometimes adding "S" to the article No. may help -> check jQuery.get for failure => redo with S+... 
 */

var hrefStart = "javascript:(function()%7Bvar%20id%20%3D%20document.querySelector(%22span%5Bitemprop%3DproductID%5D%22).innerText.replace(%2F%5C.%2Fg%2C'')%3Bvar%20cnt%20%3D%20window.location.pathname.slice(1,6)%3Bvar%20countries%20%3D%20%5B";
var hrefEnd = "%5D.filter(el%3D%3Eel!%3Dcnt)%3Bcountries.forEach(function(cnt)%20%7Bvar%20href%20%3D%20%22https%3A%2F%2Fwww.ikea.com%2F%22%2Bcnt%2B%22%2Fcatalog%2Fproducts%2F%22%2Bid%2B%22%2F%22%3BjQuery.get(href%2C%20function%20(data)%20%7Bvar%20doc%20%3D%20new%20DOMParser().parseFromString(data%2C%20%22text%2Fhtml%22)%3Bvar%20price%20%3D%20doc.evaluate(%22%2f%2fspan%5b%40itemprop%3d%27price%27%5d%2ftext()%22%2C%20doc%2C%20null%2C%200%2C%20null).iterateNext()%3Bvar%20text%20%3D%20cnt.substr(0%2C2)%2B'%3A%20'%2B(price%20%3D%3D%3D%20null%20%3F%20%22-%22%20%3A%20price.textContent)%3Bvar%20priceDiv%20%3D%20document.createElement(%22div%22)%3Bvar%20priceA%20%3D%20document.createElement(%22a%22)%3BpriceA.setAttribute(%22href%22%2C%20href)%3BpriceA.appendChild(document.createTextNode(text))%3BpriceDiv.appendChild(priceA)%3B(document.getElementById(%22prodPrice%22)%7C%7Cdocument.querySelector(%22p%5Bitemprop%3DpriceSpecification%5D%22)).appendChild(priceDiv)%3B%7D)%3B%7D)%7D)()";

var chosen = document.getElementsByClassName('selected');
var button = document.getElementById('bookmarklet');

function checkChosen() {
	if (chosen.length == 0) {
		button.style.backgroundColor = 'lightgray';
	} else {
		button.style.backgroundColor = '#0051ba';
	}
}
checkChosen();

function updateButton() {
	// modify actual js code for the bookmarklet
	if (chosen.length > 0) {
		var text = "'" + [...chosen].map((el) => el.firstChild.href.slice(-6, -1)).join("','") + "'";
		button.href = hrefStart + encodeURIComponent(text) + hrefEnd;
	} else {
		button.href = "";
	}
}

function refreshScript() {
	checkChosen();

	var text = " (" + [...chosen].map((el) => el.firstChild.href.slice(-6, -4)).join(", ") + ")";
	button.innerText = "check price" + (chosen.length > 0 ? text : "");

	updateButton();
}

function toggleSelection(e) {
	e.classList.toggle('selected');
	refreshScript();
}

var items = document.getElementsByTagName('li');

[...items].forEach(elem => elem.addEventListener("click", function(el) {
	el.preventDefault(); 
	toggleSelection(this);
}));

var regions = document.getElementsByTagName('h3');

[...regions].forEach(elem => elem.addEventListener("click", function(el) {
	el.preventDefault();
	[...this.nextElementSibling.children].forEach(li => toggleSelection(li));
}));
