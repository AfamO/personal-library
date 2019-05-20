const mongoose=require('mongoose');
const CONNECTION_STRING = process.env.DB;
console.log("Mongo Uri=="+CONNECTION_STRING);
mongoose.connect(CONNECTION_STRING,{useNewUrlParser:true});
var db= mongoose.connection;
db.on('error', console.error.bind(console, 'DB Connection error:'));
db.once('open', function() {
    console.log("We're connected to DB!");
});

let Schema = mongoose.Schema;

const bookSchema = new Schema({
  title:{type:String,default:"Chronicle Of Narnia", required:true},
  author:{type:String,default:"CS Lewis",required:true},
  comments:{type:[String],default:[]},
  commentcount:{type:Number,default:0},
  created_on:{type:Date,default:Date.now()},
  updated_on:{type:Date,default:Date.now()},
  red:{type:Boolean,default:false,},
  borrowed:{type:Boolean,default:false},

});


const Book = mongoose.model('books',bookSchema);

const createNewBook = (newBook,done) => {
  let book = new Book(newBook);
  book.save(function(err,data){
    if(err)
      return done(err);
    done(null,data);
  });
};
const createNewBookComment =(bookId,comment,done)=>{
    Book.findOne({_id:bookId},function(err,data){
        if(err)
            done(err);
        let comments=data.comments;
        comments.push(comment);
        data.comments=comments;
        data.commentcount=data.commentcount+1;
        data.save(function(err,data){
            if(err)
                return done(err);
            done(null,data);
        });
    });
};

const queryBook= (id,title,author,red,borrowed,created_on,updated_on,done)=>{
  let query= Book.find({});
  query.sort({issue_title:'asc'});
  query.select('-__v');
  if(id!=null)
      Book.findOne({_id:id});
  if(title!=null)
      query.where('title').equals(title);
  if(author!=null)
      query.where('author').equals(author);
  if(created_on!=null)
      query.where('created_on').equals(created_on);
  if(updated_on!=null)
        query.where('updated_on').equals(updated_on);
  if(red!=null)
      query.where('red').equals(red);
  if(borrowed!=null)
        query.where('borrowed').equals(borrowed);
  query.exec(function(err,data){
    if(err)
      return done(err);
    console.log(" Results of queryBook=="+JSON.stringify(data));
    done(null,data);
  });
};


const queryBookById =(bookId,done)=>{
    Book.findOne({_id:bookId},function(err,data){
      if(err)
            done(err);
        done(null,data);
    });
};

const deleteBookById =(bookId,done)=>{
    Book.deleteOne({_id:bookId},function(err,data){
      if(err)
            done(err);
        console.log(" Results of deleteBookById=="+JSON.stringify(data));
        done(null,data);
    });
};
const deleteAllBooks =(done)=>{
    Book.deleteMany({},function(err,data){
        if(err)
            done(err);
        console.log(" Results of deleteAllBooks==="+JSON.stringify(data));
        done(null,data);
    });
};

const updateBook = function(retrievedData,bookObject, done) {
        for(let key in bookObject){
            retrievedData[key]=bookObject[key];
        }
        retrievedData.save(function(err,data){
            if(err)
                done(err);
            done(null,data);

        });
      };

exports.createNewBook = createNewBook;
exports.deleteBookById = deleteBookById;
exports.queryBookById = queryBookById;
exports.queryBook=queryBook;
exports.updateBook=updateBook;
exports.createNewBookComment=createNewBookComment;
exports.deleteAllBooks= deleteAllBooks;