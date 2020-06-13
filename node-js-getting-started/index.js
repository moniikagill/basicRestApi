
 var express = require('express');
 var app = express(); //new instance of express
 var port = process.env.PORT || 8080; // port for environment
 var path = require ('path');

var MyTable = 'todo';
var pg = require('pg');

app.use(express.static("public"));
app.use(express.json());
app.use (function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});





/***********************************************************************************/
//     API FUNCTION
/***********************************************************************************/


 /***********************************************************************************/
 //     GET to get the whole todolist
/***********************************************************************************/

const { Pool } = require('pg'); const pool = new Pool({
connectionString: "postgres:axbnnyluwaxgoy:56f876a6193df4975a9e34bd75fc5a493d1b44f4dc1ab9509d07adb28bd4ad2a@ec2-174-129-227-146.compute-1.amazonaws.com:5432/d17f2jughunnn4",
ssl: true });

app.get('/api/todolist', async (req, res) => { let client;
  try {
client = await pool.connect()
var result = await client.query('SELECT * FROM '+ MyTable);
if (!result) {
return res.status(404).send('No data found'); }else{ result.rows.forEach(row=>{ console.log(row);

});
}
console.log("testing");
res.send(result.rows);


} catch (err) { console.error(err); res.send({});

}finally{client.release(); console.log("releasing")} });


app.listen(port, () => console.log('Listening on ',port));
 /***********************************************************************************/
 // deleting a task
 /***********************************************************************************/
app.delete('/api/delete', async (req, res)=>{ let client;
  try {

  client = await pool.connect();
  var result = await client.query(`DELETE FROM todo WHERE id = ${req.body.id}`);
  if (!result) {
  return res.status(500).send('No data found'); }else {console.log("Deleting item: " + req.body.id);
  res.send({success:"task deleted"});
       }

}catch (err) { console.error(err); res.status(404).send({success:"an error occured"} );
}finally{client.release(); console.log("releasing")} });

 /***********************************************************************************/
// post method to post a new task
 /***********************************************************************************/
app.post('/api/todolist/create', async(req, res)=> { let client;
  try {

  client = await pool.connect();
  var result = await client.query("INSERT into todo (taskname, taskowner) Values ('" + req.body.taskname +"' , '" + req.body.taskowner +"')");
  if (!result) {
  return res.status(500).send('No data found'); }else{console.log('creating new task:'); res.status(201).send({success:"Task created"});}
}catch (err) { console.error(err); res.status(400).send({success:"Error occured"});
}finally{client.release(); console.log("releasing")}

});
 /***********************************************************************************/

 //Put to update a task

 /***********************************************************************************/
app.put('/api/todolist/update', async(req, res)=> { let client;
  console.log("Called PUT");
  try {
  client = await pool.connect();
  var result = await client.query("UPDATE todo SET taskname = '" + req.body.taskname + "', taskowner = '" + req.body.taskowner+"' WHERE id = '" + req.body.id +"'");
  if (!result) {
  return res.status(500).send('No data found'); }else{ res.status(201).send({success: "task updated"});}
}catch (err) { console.error(err); res.status(400).send({success:"Error occured"});
}finally{client.release(); console.log("releasing")}

});

/*****************************************************/

 //Put to update completed attribute of the table

 /***********************************************************************************/

app.put('/api/todolist/update/:id', async(req, res)=> { let client;
    console.log("UPDATE todo SET completed = " + req.body.completed + " WHERE id = " + req.params.id);
  try {

  client = await pool.connect();
  var result = await client.query("UPDATE todo SET completed = " + req.body.completed + " WHERE id = " + req.params.id);
  console.log("UPDATE todo SET completed = " + req.body.completed + " WHERE id = " + req.params.id);
  if (!result) {
  return res.send('No data found'); }else{console.log('updating task:'); res.status(200).send({success: "task updated"});}
}catch (err) { console.error(err); res.status(400).send({success:"Error occured"});
}finally{client.release(); console.log("releasing")}

});
