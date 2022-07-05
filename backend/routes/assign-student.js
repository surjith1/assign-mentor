import express from 'express';
import {client} from '../index.js'

const router =express.Router();
router.get('/', async (req, res) => {
    const mentor = await client.db("AssignMentor").collection("student").find({}).toArray();
res.send(mentor);
})
router.post('/', async (req, res) => {
    const data = req.body;
    const result = await client.db("AssignMentor").collection("student").insertMany(data);
    res.send(result);
})
router.get('/:id', async (req, res) => {
    const {id} =req.params;
    console.log(id);
    const movie = await client.db("AssignMentor").collection("student").findOne({id:id});
    //const movie = movies.find((mv)=>mv.id===id)
    movie ? res.send(movie) : res.status(401).send({msg:"No Such Student Found"});
})
// router.put('/:id', async (req, res) => {
//     const data = req.body;
//     const {id} = req.params;
//     const result = await client.db("AssignMentor").collection("student").updateOne({id:id},{$set:data});
//     result ?  res.send(result) :  res.send({msg:"No Updation Found"})
//     //const result = mentor.find((mv)=>mv.id===id)
//     //res.send(result);
// })


export const assignStudentRouter = router;