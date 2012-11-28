//Augment String object to have function that removes white space that is more than 1 character long
String.prototype.reduceWhiteSpace = function() {
    return this.replace(/\s+/g, ' ');
};

var fs = require('fs');
var Crawler = require('simplecrawler').Crawler;

var myCrawler = new Crawler('allrecipes.com', '/Recipe/Premier-Cheesecake-Cranberry-Bars/Detail.aspx', 80);

myCrawler.interval = 3000;				//Retrieve every 3 seconds
myCrawler.maxConcurrency = 1;
myCrawler.discoverResources = false;	//Retrieve all contents only - don't auto-parse and download page components

myCrawler.on("fetchcomplete",function(queueItem, responseBuffer, response) {
    //console.log("I just received %s (%d bytes)",queueItem.url,responseBuffer.length);
    //console.log("It was a resource of type %s",response.headers['content-type']);

    // Do something with the data in responseBuffer
    //console.log(responseBuffer.toString());
    
    //Write the source data to file
    fs.writeFile('source.html', responseBuffer, function (err) {
  		if (err) throw err;
  		console.log('It\'s saved!');
  	
  	/* mySource = responseBuffer.toString();
  	TitleStart = mySource.indexOf("<title>");
  	TitleEnd = mySource.indexOf("</title>");
  	PageTitle = mySource.slice(TitleStart+7,TitleEnd).reduceWhiteSpace();  //! This still leaves me with one space at the beginning (and maybe at the end)
  	console.log("Page Title: " + PageTitle);
  	*/
  	
	
	});
});

//Start crawling site
myCrawler.start();

//var source = fs.readFileSync('source.txt');
//console.log(source.toString());

//<span id="lblIngAmount" class="ingredient-amount">1 1/2 cups</span>
//<span id="lblIngName" class="ingredient-name">quick or old-fashioned oats</span>