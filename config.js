"use strict";
//change url to something for my database
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://bocarroll36:cinnoman125@ds047095.mlab.com:47095/blog-app';
exports.PORT = process.env.PORT || 8080;