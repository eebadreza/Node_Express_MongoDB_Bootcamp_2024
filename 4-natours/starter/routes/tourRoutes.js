const express = require('express');

const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  // checkID,
  // checkBody,
  aliasTopTours,
} = require(`${__dirname}/../controllers/tourController.js`);

const router = express.Router();

// router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
