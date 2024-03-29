const axios = require("axios");
const express = require("express");
const router = express.Router();
require('dotenv').config()

router.get("/",(req,res)=>{
	res.send({
		status:"Working auth!"
	})
})

router.get("/socketCheck",(req,res)=>{
	console.log('poggers');
	req.io.emit('message', "data");
	// req.app.io.emit('message', "data");
})

router.get("/callback",(req,res)=>{
	const clientId = "194ec52f484b36d8451e";
	const clientSecret = process.env.CLIENT_SECRET;
	const code = req.query.code;
	axios.post("https://github.com/login/oauth/access_token",{
		client_id:clientId,
		client_secret:clientSecret,
		code:code,
	},{
		headers:{
			Accept:"application/json",
		}
	})
	.then(response=>{
		axios.get("https://api.github.com/user",{
			headers:{
				'Authorization':`token ${response.data.access_token}`
			}
		})
		.then((result=>{
			req.io.emit('auth', result.data);
		}))
	})
})


module.exports = router;