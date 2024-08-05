const express = require('express');

const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require(`${__dirname}/../controllers/tourController.js`);

const router = express.Router();

router.param('id', checkID);

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
