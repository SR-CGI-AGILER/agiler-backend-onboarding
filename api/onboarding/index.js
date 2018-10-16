const router = require('express').Router();
const onboardingController = require('./onboarding.controller');

router.post('/auth/google',onboardingController.getGoogleToken);

router.post('/auth/github', onboardingController.getGithubToken);


module.exports = router;