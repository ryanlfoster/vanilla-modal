module.exports = function(grunt) {

  "use strict";

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-6to5');

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    
    "jshint" : {
      options: {
        esnext : true,
        browser : true,
        globals : {
          define : true,
          module : true
        },
      },
      files: {
        src: ['src/vanilla-modal.js']
      }
    },
    
    "6to5" : {
      options : {
        sourceMap: true
      },
      dist : {
        files : {
          "dist/vanilla-modal.js" : "src/vanilla-modal.js"
        }
      }
    },
    
    "uglify" : {
      target : {
        options : {
          banner: '/**\n * @name <%= pkg.name %>\n * @version <%= pkg.version %>\n * @author Ben Ceglowski\n * @url http://phuse.ca\n * @date <%= grunt.template.today("yyyy-mm-dd") %>\n * @license MIT\n */;',
          report : 'gzip'
        },
        files : {
          "dist/vanilla-modal.min.js" : ["dist/vanilla-modal.js"]
        }
      }
    },
    
    "watch" : {
      scripts: {
        files: ["src/vanilla-modal.js"],
        tasks: ["build"],
        options: {
          spawn: false,
        }
      }
    }
    
  });
    
  grunt.registerTask("default", ["6to5", "uglify", "watch"]);
  grunt.registerTask("build", ["jshint", "6to5", "uglify"]);
  grunt.registerTask("minify", ["uglify"]);

};