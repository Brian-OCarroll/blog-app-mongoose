"use strict";
//change url to something for my database
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/blog-app';
                     // 'mongodb://localhost/blog-posts';
exports.PORT = process.env.PORT || 8080;