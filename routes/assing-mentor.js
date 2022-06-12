import express from 'express';
import {client} from '../index.js'

const router =express.Router();
router.get('', async (req, res) => {
    const mentor = await client.db("AssignMentor").collection("mentor").find({}).toArray();
res.send(mentor);
})
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const result = await client.db("AssignMentor").collection("mentor").findOne({name:name});
    //const result = mentor.find((mv)=>mv.name===name)
    result ?  res.send(result) :  res.send({msg:"No Updation Found"})
    
});

router.post('/', async (req, res) => {
    const data = req.body;
    const result = await client.db("AssignMentor").collection("mentor").insertMany(data);
    //result ? res.send(result) : res.status(401).send({msg:"No Such Etery Found"});
res.send(result);    

})



// router.get('/:id', async (req, res) => {
//     const {id} =req.params;
//     //const movie = await client.db("Movies").collection("moviesList").findOne({id:id});
//     const movie = movies.find((mv)=>mv.id===id)
//     movie ? res.send(movie) : res.status(401).send({msg:"No Such Movie Found"});
// })

// router.delete('/:id', async (req, res) => {
//     const {id} =req.params;
//     const movie = await client.db("Movies").collection("moviesList").deleteOne({id:id});
//     //const movie = movies.find((mv)=>mv.id===id)
//     movie.deletedCount > 0 ? res.send(movie) : res.status(401).send({msg:"No Such Movie Found"});
// })
// router.put('/:id', async (req, res) => {
//     const data = req.body;
//     const {id} = req.params;
//     const result = await client.db("AssignMentor").collection("mentor").updateOne({id:id},{$set:data});
//     result ?  res.send(result) :  res.send({msg:"No Updation Found"})
//     //const result = mentor.find((mv)=>mv.id===id)
//     //res.send(result);
// })

export const assignMentorRouter = router;