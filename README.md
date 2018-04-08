# IKEA price comparison magic button

A customizable magic button (bookmarklet) to compare IKEA prices across
countries.

See http://mnazarov.github.io/ikeaprices

![](demo.gif)


# Idea

Living in a small country like Belgium, sometimes it pays to drive over the
border to get a good deal. Depending on the location in Belgium Within 1-2 hours
it is possible to reach IKEA in the Netherlands, Germany and France. Out of
desire to save and curiosity this tool was born.

# Implementation

Since most of the IKEA country websites are located at the same www.ikea.com
domain, we can use AJAX requests to other country websites. The product URLs
also have a straightforward structure:

  `www.ikea.com/**xx**/**yy**/catalog/products/**zzzzzzzz**`

where **xx** is the country code (like "be" or "gb"), **yy** is the language
code ("nl" or "en"), and **zzzzzzzz** is the article number (like 50313131).
Note that in the catalog and on the webiste the article number contains dots for
clarity (503.131.31) which are ignored in the URL. 

Note: websites for some country websites were recently updated (like UK
and Belgium) and now use different URL-naming, but the above 'canonical' links
still work.  
 
For each country from the list, we need to:

1. Find current item's article number:
   `document.querySelector("span[itemprop=productID]").innerText.replace(/\./g, "");`
2. Request the corresponding website:
   `jQuery.get("https://www.ikea.com/" + country + "/catalog/products/" + id + "/", ...)`
3. Parse it to find the price:
   `new DOMParser().parseFromString(data, "text/html").evaluate("//span[@itemprop='price']/text()", doc, null, 0, null).iterateNext();`
4. Show it on the current page by creating an element (linking to the
   country page) and appending it to the currently shown price which can be
   found with:
   `document.getElementById("prodPrice") || document.querySelector("p[itemprop=priceSpecification]")` 

The full code is below:

```
// countryList - list of selected countries to compare
(function() {
    var id = document.querySelector("span[itemprop=productID]").innerText.replace(/\./g, "");
    var cnt = window.location.pathname.slice(1, 6);       // current country
    var countries = countryList.filter(el => el != cnt);  // remove current country from the list
    countries.forEach(function(cnt) {
        var href = "http://www.ikea.com/" + cnt + "/catalog/products/" + id + "/";
        jQuery.get(href, function(data) {
            var price = new DOMParser().parseFromString(data, "text/html")
              .evaluate("//span[@itemprop='price']/text()", doc, null, 0, null).iterateNext();
            var text = cnt.substr(0, 2) + ": " + (price === null ? "-" : price.textContent);
            var priceDiv = document.createElement("div");
            var priceA = document.createElement("a");
            priceA.setAttribute("href", href);
            priceA.appendChild(document.createTextNode(text));
            priceDiv.appendChild(priceA);
            var priceEl = document.getElementById("prodPrice") || document.querySelector("p[itemprop=priceSpecification]");
            priceEl.parentElement.appendChild(priceDiv);
        });
    })
})();
```