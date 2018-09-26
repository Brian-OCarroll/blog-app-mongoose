//order is important in the code below
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
    firstName: 'string',
    lastName: 'string',
    userName: {
        type:String,
        unique: true
    }
});

const commentSchema = mongoose.Schema({content: String});

const blogSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, require: true},
    created: {type: Date, default: Date.now},
    //will need to call .populate('author') to pull in the author model
    //when referencing this in the /get endpoints
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
    comments: [commentSchema]
});

blogSchema.pre('find', function(next){
    this.populate('author');
    next();
});
//this middleware allows the author collection data to be populated before
// the virtual is called, since the author key in the blogSchema 
//above only stores the _id of an author in the authors collection
blogSchema.pre('findOne', function(next) {
    this.populate('author');
    next();
});

blogSchema.virtual('fullName')
    .get(function() {
        const auth = this.author;
        return `${auth.firstName} ${auth.lastName}`.trim();
    });
//return only the info you want users to be able to see from api
blogSchema.methods.serialize = function() {
   return {
       id: this._id,
       title: this.title,
       content: this.content,
       author: this.fullName,
       comments: this.comments
   };
};
// "Blog" is the same name as the collection name established in mlab

const blogPost = mongoose.model("blogposts", blogSchema);
const Author = mongoose.model('authors', authorSchema);

module.exports = {blogPost, Author};