import { Router } from "express";
import usersModel from "../models/users.models.js";

const router = Router()

router.post('/register', async (req, res) => {

    try {
        const {first_name, last_name, email, age, password} = req.body;
        
        const exists = await usersModel.findOne({email});

        if(exists){
            return res.status(400).send({status: 'error', message: error.message});
            
        }

        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        });
        res.status(201).send({status: 'sucess', message: 'user register'});
        
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message});
        console.log(error)

    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await usersModel.findOne({ email, password});

        if(!user){
            return res.status(400).send({status: 'error', message: 'incorrect data'})
        }
        console.log(user)

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age
        }

        console.log(req.session.user)
        res.send({status: 'success', message: 'login success'});
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message});
        console.log(error)
        
    }
});

router.get('/logout', (req, res) =>{
    req.session.destroy(error => {
        if(error) return res.status(500).send({status:'error', error});
        res.redirect('/');
    })
})

export default router;