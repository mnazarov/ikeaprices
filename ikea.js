/* TODO:
 * sometimes adding "S" to the article No. may help -> check jQuery.get for failure => redo with S+... 
 */

var hrefStart = "javascript:(function()%20%7B%0A%09var%20url%20%3D%20window.location.pathname%3B%0A%09var%20urlProd%20%3D%20url.slice(6%2C%20)%3B%0A%09var%20cnt%20%3D%20url.slice(1%2C%206)%3B%0A%09var%20countries%20%3D%20%5B";
var hrefEnd = "%5D.filter(el%20%3D%3E%20el%20!%3D%20cnt)%3B%0A%09countries.forEach(function(cnt)%20%7B%0A%09%09var%20href%20%3D%20%22https%3A%2F%2Fwww.ikea.com%2F%22%20%2B%20cnt%20%2B%20urlProd%3B%0A%09%09fetch(href).then(response%20%3D%3E%20response.text()).then(data%20%3D%3E%20%7B%0A%09%09%09var%20doc%20%3D%20new%20DOMParser().parseFromString(data%2C%20%22text%2Fhtml%22)%3B%0A%09%09%09var%20price%20%3D%20doc.evaluate(%22//div[@class='range-revamp-pip-price-package__main-price']%22,%20doc%2C%20null%2C%204%2C%20null).iterateNext()%3B%0A%09%09%09var%20text%20%3D%20cnt.substr(0%2C%202)%20%2B%20'%3A%20'%20%2B%20(price%20%3D%3D%3D%20null%20%3F%20%22-%22%20%3A%20price.textContent)%3B%0A%09%09%09var%20priceDiv%20%3D%20document.createElement(%22div%22)%3B%0A%09%09%09var%20priceA%20%3D%20document.createElement(%22a%22)%3B%0A%09%09%09priceA.setAttribute(%22href%22%2C%20href)%3B%0A%09%09%09priceA.appendChild(document.createTextNode(text))%3B%0A%09%09%09priceDiv.appendChild(priceA)%3B%0A%09%09%09(document.querySelector(%22div.range-revamp-pip-price-package__main-price%22)).appendChild(priceDiv)%3B%0A%09%09%7D)%3B%0A%09%7D)%0A%7D)()";

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
