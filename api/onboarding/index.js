const router = require('express').Router();
const onboardingController = require('./onboarding.controller');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/test', (req,res)=>{
    res.cookie('cook2',"BLABLA");
    res.send('HEYHEY');
});

router.post('/auth/google',onboardingController.loginWithGoogle);

router.post('/auth/github/:code?', onboardingController.loginWithGithub);

router.get('/api/users/:id', onboardingController.getUsers);

router.get('/api/users', onboardingController.getAllUsersController);

router.get('/api/teams/:teamId', onboardingController.getTeam);

router.get('/api/teams/:teamId/members', onboardingController.getTeamMembers);

router.get('/api/getUserId/:email', onboardingController.getUserIdResponse);

module.exports = router;