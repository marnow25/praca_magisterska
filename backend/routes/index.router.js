const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const ctrlFavourite = require('../controllers/favourite.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/favourite', jwtHelper.verifyJwtToken, ctrlFavourite.saveFavourite);
router.post('/favouriteList', jwtHelper.verifyJwtToken, ctrlFavourite.getFavouritesList);
router.post('/delete-favourite-item-on-user', jwtHelper.verifyJwtToken, ctrlFavourite.deleteFromFavouritesListDepeningOnUser);
router.post('/delete-favourite-item', jwtHelper.verifyJwtToken, ctrlFavourite.deleteFromFavouritesList);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile); // private route (only with JWT)

module.exports = router;