var express = require('express');
const StatusCodes = require('http-status-codes');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/api/createUser', async(req,res,next) => {
   const salt = await bcrypt.genSalt(10);
   if (req.email == undefined || req.username == undefined || req.password == undefined) {
      res.status(StatusCodes.BAD_REQUEST).json({message: "Bad request"})
    }
   var usr = {
      email: req.body.email,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, salt),
      emailVerified: false,
      // TODO: know which role to assign
      idRole: 1
   }
    createdUser = user.create(usr)
    res.status(StatusCodes.CREATED).json({createdUser})
});

module.exports = router;