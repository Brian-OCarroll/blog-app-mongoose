"use strict";
//change url to something for my database
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/blogPosts';
exports.PORT = process.env.PORT || 8080;