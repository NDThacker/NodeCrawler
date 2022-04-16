const pupp = require('puppeteer');
const cheerioMain = require('cheerio');


const service = {}


service.getListofReviews = (url) => {
	
	// console.debug(url)
	if(!url)
	{
		let err = new Error('No url provided');
		err.status = 406;
		throw err;
	}
	let revNodes = [];
	let revObjs = []
	return pupp.launch().then(browser => {
		return browser.newPage();
	})
	.then(page => {
		return page.goto(url).then(() => {
			return page.content();
		})
	})
	.then(html => {
		let cheerio = cheerioMain.load(html);
		revNodes = cheerio('#customerReviews');
		// console.debug(revNodes);
		
		if(revNodes.length == 0)
		{
			let err = new Error('Either No reviews yet for the product OR Invalid Review Page');
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
		return revObjs;
	})
	

}


module.exports = service;