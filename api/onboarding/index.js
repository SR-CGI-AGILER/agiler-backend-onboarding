const router = require('express').Router();
const onboardingController = require('./onboarding.controller');

router.post('/auth/google',onboardingController.getGoogleToken);

router.post('/auth/github/:code?', onboardingController.abc);


module.exports = router;