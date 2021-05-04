let express = require('express');
let router = express.Router();

let tokenService = require('../../common/token')

router.post("/", (req, res) => {
    tokenService.setToken('aaaaaaaaa').then((token) => {
        // console.log(token);
        res.send({
            code: 0,
            msg: '',
            data: {
                token: token
            }
        })
    })
})

module.exports = router