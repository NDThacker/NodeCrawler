const router = require('express').Router();
const service = require('../services/service');

/* get all review comments of a review page
in json format, req.body requires valid review page url
*/

router.post('/getreviews', (req, res, next) => {
	// console.debug(req.body.url)
	service.getListofReviews(req.body.url).then(revList => {
		res.json(revList);
	}).catch(err => next(err))
})

module.exports = router
