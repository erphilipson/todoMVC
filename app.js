const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Todo = require('./todos.js');
mongoose.connect('mongodb://localhost:27017/todos');

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/static/index.html");
})

// put routes here
app.get('/api/todos', function(req, res){
  Todo.find().then(function(todos){
    res.json(todos);
  })

})

app.post('/api/todos', function(req, res){
  let todo = new Todo ({title: req.body.title, completed: req.body.completed})
  todo.save().then(function(){
    console.log('Saved')
  }).catch(function(){
    console.log('Not saved');
  })
})

app.get('/api/todos/:id', function (req, res){
  Todo.find({_id: req.params.id}).then(function(todos){
    res.json(todos);
  })
})

app.put('/api/todos/:id', function (req, res){
  Todo.updateOne({_id: req.params.id},
    {$push: {title: req.body.title, completed: req.body.completed}})

})

app.patch('/api/todos/:id', function (req, res){


})

app.delete('/api/todos/:id', function (req, res){
  Todo.delete({_id:req.params.id}).then(function(deleted){
    console.log('Deleted');
    res.json(deleted);
  })

})

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
