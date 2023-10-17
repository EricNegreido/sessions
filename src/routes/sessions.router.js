import { Router } from "express";
import usersModel from "../dao/models/users.models.js";

const router = Router()

router.post('/register', async (req, res) => {

    try {
        const {first_name, last_name, email, age, password} = req.body;
        
        const exists = await usersModel.findOne({email});
        if(exists){
            return res.status(400).send({status: 'error', message: error.message});
            
        }
        if(!first_name || !last_name || !email || !age ){
            return res.status(400).send({status: 'error', message: 'unfilled fields '});

        }
        const rol = (email !== "adminCoder@coder.com" && password == "adminCod3r123" ) ? 'User' : 'Admin';//no me deja chequea password
        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password,
            rol: rol

        });
        res.status(201).send({status: 'sucess', message: 'user register'});
        
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message});

    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await usersModel.findOne({ email, password});

        if(!user){
            return res.status(400).send({status: 'error', message: 'incorrect data'})
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: user.rol
        }

        res.send({status: 'success', message: 'login success'});
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message});
        console.log(error); 
    }
});

router.get('/logout', (req, res) =>{
    req.session.destroy(error => {
        if(error) return res.status(500).send({status:'error', error});
        res.redirect('/');
    })
})

export default router;