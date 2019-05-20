/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var DBApp = require('./DBApp.js');


module.exports = function (app) {

  const commentCount= (data)=>{
    var count =0;
    data.forEach(function (element) {
      count += element.comments.length;
    });
  }
  app.route('/api/books')
    .get(function (req, res){
      var bookId= req.query._id;
      var author = req.query.author;
      var red = req.query.red;
      var borrowed = req.query.borrowed;
      var created_on = req.query.created_on;
      var updated_on = req.query.updated_on;
      DBApp.queryBook(bookId,null,null,null,null,null,null,function (err,data) {
        if(err)
          res.json({msg:"Error retrieving your books",status:500});
        res.json(data);
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if(title==null)
      {
        res.json({msg:"Book Title Missing",status:500});
      }
      else {
        DBApp.createNewBook({title:title,author:req.body.author},function (err,data) {
          if(err)
          {
            res.json({msg:"Book Creation Failed",status:500});
          }
          else {
            res.json({_id:data._id,title:data.title,author:data.author,commentcount: data.commentcount,status:200});
          }
        });
      }
      //response will contain new book object including atleast _id and title

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      DBApp.deleteAllBooks(function (err,data) {
        if(err)
          res.json({msg:"complete delete failed",status:500});
        res.json({msg:"complete delete successful",status:500});
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookId = req.params.id;
        console.log("The Id===="+bookId);
      if(bookId==null)
        res.json({msg:"Book Id Missing",status:500});
      else {
        DBApp.queryBookById(bookId,function (err,data) {
          if(err)
          {
            res.json({msg:"Unknown BookId",status:500});
          }
          else {
              res.json(data);
          }
        });
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookId = req.params.id;
      var comment = req.body.comment;
      if(bookId==null)
        res.json({msg:"Book Id Missing",status:500});
      DBApp.queryBookById(bookId,function (err,data) {
        if(err)
          res.json({msg:"Unknown BookId ",status:500});
        DBApp.createNewBookComment(bookId,comment,function (err,data) {
          if(err)
            res.json({msg:"Failed to save comment ",status:500});
          res.json(data);
        })
      });
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookId = req.params.id;
      //if successful response will be 'delete successful'
      if(bookId==null)
        res.json({msg:"Book Id Missing",status:500});
      DBApp.queryBookById(bookId,function (err,data) {
        if(err)
          res.json({msg:"Unknown BookId",status:500});
        DBApp.deleteBookById(bookId,function (err,data) {
          if(err)
            res.json({msg:"Failed to delete book ",status:500});
          res.json({msg:"delete successful",status:200});
        })
      });
    });
  
};
