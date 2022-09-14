function bookmarklet(countryList) {
  
  var priceElClass = "pip-price-module-price-module__price";
  
	if (/ikea\.com$/.test(window.location.hostname)) {
		var url = window.location.pathname;
		var urlProd = url.slice(6, );
		var cnt = url.slice(1, 6);
		var countries = countryList.split(",").filter(el => el != cnt);
		countries.forEach(function(cnt) {
			var href = "https://www.ikea.com/" + cnt + urlProd;
			fetch(href).then(response => response.text()).then(data => {
				var doc = new DOMParser().parseFromString(data, "text/html");
				var price = doc.evaluate("//div[@class='"+priceElClass+"']", doc, null, 4, null).iterateNext();
				var text = cnt.substr(0, 2) + ': ' + (price === null ? "-" : price.textContent);
				var priceDiv = document.createElement("div");
				var priceA = document.createElement("a");
				priceA.setAttribute("href", href);
				priceA.appendChild(document.createTextNode(text));
				priceDiv.appendChild(priceA);
				(document.querySelector("div."+priceElClass)).appendChild(priceDiv);
			});
		})
	}
};

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
		var text = [...chosen].map((el) => el.firstChild.href.slice(-6, -1)).join(",");
		button.href = encodeURI("javascript:("+bookmarklet+")(\""+text+"\")");
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
