const pupp = require('puppeteer');
const cheerioMain = require('cheerio');


const service = {}



service.getAllReviews = async(url) => {
	
	if(!url)
	{
		let err = new Error('No url provided');
		err.status = 406;
		throw err;
	}
	let revNodes = [];
	let revObjs = [];

	let browser = await pupp.launch();
	let page = await browser.newPage();

	for(; url;) {
		await page.goto(url);
		let htmlC = await page.content();
		let cheerio = cheerioMain.load(htmlC);
		revNodes = cheerio('#customerReviews');
		
		if(revNodes.length == 0)
		{
			let err = new Error('Either No reviews yet for the product OR Invalid Review Page URL');
			err.status = 406;
			throw err;
		}
		revNodes = revNodes[0].childNodes;
		for(let revNode of revNodes)
		{
			if(cheerio(revNode).attr('class') == 'reviewsPagination') continue;
			if(cheerio(revNode).html()) {
				// console.debug('\n from here',cheerio(revNode).html());
				let revObj = {};
				revObj.rating = cheerio('div.review div.leftCol dl.itemReview dd strong', revNode).text();
				revObj.reviewerName = cheerio(cheerio('div.review div.leftCol dl.reviewer dd', revNode)[0]).text();
				revObj.reviewDate = cheerio(cheerio('div.review div.leftCol dl.reviewer dd', revNode)[1]).text();
				revObj.title = cheerio('div.rightCol h6', revNode).text();
				revObj.reviewComment = cheerio('div.rightCol p', revNode).text();
				revObjs.push(revObj);

			}
		}
		let nextL = cheerio('div.reviewsPagination dl.reviewPage dd a[title=Next]').attr('href');
		if(!nextL)
		{
			url = null;
			continue;
		}
		cheerio = cheerioMain.load(htmlC);
		url = "https://www.tigerdirect.com" + nextL.trim();
	}
	return revObjs;


}

module.exports = service;