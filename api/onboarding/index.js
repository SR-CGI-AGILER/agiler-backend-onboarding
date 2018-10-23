const router = require('express').Router();
const onboardingController = require('./onboarding.controller');

router.post('/auth/google',onboardingController.loginWithGoogle);

router.post('/auth/github/:code?', onboardingController.loginWithGithub);

router.get('/api/users/:id', onboardingController.getUsers);

router.get('/api/users', onboardingController.getAllUsersController);

router.get('/api/teams/:teamId', onboardingController.getTeam);

router.get('/api/teams/:teamId/members', onboardingController.getTeamMembers);

module.exports = router;