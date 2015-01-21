module.exports = function(grunt) {

  "use strict";

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({

    uglify : {

      options : {
        mangle : true,
        compress : true
      },
      
      target : {
        files : {
          "dist/vanilla-modal.js" : ["src/vanilla-modal.js"]
        }
      }
      
    }
    
  });
    
  grunt.registerTask("minify", ["uglify"]);

};