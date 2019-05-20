/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
          chai.request(server)
              .post('/api/books')
              .send({title:"Great Expectations",author:"Charles Dickens"})
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.equal(res.body.title,"Great Expectations");
                  assert.equal(res.body.author,"Charles Dickens");
                  assert.property(res.body, '_id', 'response should contain _id');
                  done();
              });
      });
      
      test('Test POST /api/books with no title given', function(done) {
          chai.request(server)
              .post('/api/books')
              .send({title:null,author:"Charles Dickens"})
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.equal(res.body.msg,"Book Title Missing");
                  assert.equal(res.body.author,null);
                  done();
              });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
            .get('/api/books')
            .end(function (err,res) {
                assert.equal(res.status,200);
                assert.isArray(res.body,'shpuld be an array');
                assert.property(res.body[0],'title');
                assert.property(res.body[0],'_id');
                assert.property(res.body[0],'author');
                assert.isArray(res.body[0].comments,'Comments should be an array');
                done();
            });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
              .get('/api/books/X5cdeb43fa4fa472a8c6ab800')
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.equal(res.body.title, null);
                  assert.equal(res.body.msg, 'Unknown BookId', 'Book id not found in db');
                  assert.equal(res.body.author, null, 'Book should not have a valid author name');
                  done();
              });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
              .get('/api/books/5ce06d1c2e764a3380c7992d')
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.equal(res.body.title, 'Great Expectations');
                  assert.equal(res.body.author, 'Charles Dickens', 'Book should have a valid author name');
                  done();
              });

      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
          chai.request(server)
              .post('/api/books/5ce06d1c2e764a3380c7992d')
              .send({comment:"Great Book, I enjoyed it when I red it."})
              .end(function(err, res){
                  console.log("Result of Comments=="+JSON.stringify(res.body));
                  assert.equal(res.status, 200);
                  assert.equal(res.body.title,'Great Expectations');
                  assert.property(res.body,'_id');
                  assert.isArray(res.body.comments,'Should have an array of comments');
                  done();
              });
      });
      
    });

  });

});
