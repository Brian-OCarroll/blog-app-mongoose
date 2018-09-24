const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, require: true},
    created: {type: Date, default: Date.now},
    author: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        }
    }
});

blogSchema.virtual('fullName')
    .get(function() {
        const auth = this.author;
        return `${auth.firstName} ${auth.lastName}`.trim();
    });

blogSchema.methods.serialize = function() {
   return {
       id: this._id,
       title: this.title,
       content: this.content,
       author: this.fullName,
       created: this.created
   };
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = {Blog}