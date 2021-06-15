const express= require('express')
const mongoose= require('mongoose')
const cors= require('cors')
const jwt= require('jsonwebtoken')
const {OAuth2Client,}= require('google-auth-library')
const Users= require('./models/userModels')

const app= express()

const client= new OAuth2Client("513469776532-aquu38i7vf7m52g5qr8224s8t61e8re8.apps.googleusercontent.com")

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('hi')
})

app.post('/api/google', async(req, res)=>{
    try {   
        const {tokenId}= await req.body
        client.verifyIdToken({idToken: tokenId, audience: '513469776532-aquu38i7vf7m52g5qr8224s8t61e8re8.apps.googleusercontent.com'}).then((response)=>{
            const {email_verified, name, email}= response.payload;
            if(email_verified){
                const existUser= Users.findOne({email}).exec((err, data)=>{
                    if(err){
                        res.status(400)
                        throw new Error(err)
                    }
                    if(data){
                        const token= jwt.sign({_id: data._id}, "secretkey", {expiresIn: '1d'})
                        const {_id, name, email}= data
                        res.json({
                            token,
                            user: {_id, name, email}
                        })
                        console.log('user logged')
                    }else{
                        let password= email+ "secretKey"
                        let newUser= new Users({name, email, password})
                        newUser.save((err, data)=>{
                            if(err){
                                res.status(400)
                                throw new Error(err)
                            }
                            if(data){
                                const token= jwt.sign({_id: data._id}, "secretkey", {expiresIn: '1d'})
                                const {_id, name, email}= data
                                res.json({
                                    token,
                                    user: {_id, name, email}
                                })
                                console.log('user created')
                            }
                        })

                    }
                })
            }
        })
    } catch (error) {
        throw new Error(error)
    }
})

mongoose.connect('mongodb://localhost:27017/googleauth', {
    useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true
}).then(()=> console.log('connection to database')).catch((e)=> console.log(e))

app.listen(5000, ()=>{
    console.log(`LISTENING`)
})