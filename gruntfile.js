module.exports = function(grunt) {

  "use strict";

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    uglify : {
      target : {
        options : {
          banner: '/**\n * @name <%= pkg.name %>\n * @version <%= pkg.version %>\n * @author Ben Ceglowski\n * @url http://phuse.ca\n * @date <%= grunt.template.today("yyyy-mm-dd") %>\n * @license MIT\n */;',
          report : 'gzip'
        },
        files : {
          "dist/vanilla-modal.js" : ["src/vanilla-modal.js"]
        }
      }
    }
    
  });
    
  grunt.registerTask("minify", ["uglify"]);

};