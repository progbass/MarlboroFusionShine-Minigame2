'use strict';
var config = require('./config.json');
var _ = require('underscore');
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());


module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  grunt.initConfig({

    // WATCH
    watch: {
      dev:{
        files : [
          'scss/**/*.scss',
          'css/**/*.css',
          'game/**/*.js'
        ],
        tasks : [ 'build'],
        option: {}
      }  
    },


    // BROWSER SYNC
    browserSync: {
      bsFiles: {
        src : [
          'dist/fonts/**/*',
          'dist/css/**/*.css',
          'dist/js/**/*.js',
          'dist/*.html',
        ]
      },

      options: {
        server: [".", "dist"],
        watchTask: true,
        open: true,
      }
    },

    // OPEN
    open: {
      server: {
        path: 'http://localhost'
      }
    },


    // COPY
    copy: {
      dist: {
        files: [
          // includes files within path and its sub-directories
          { expand: true, src: ['css/**'], dest: 'dist/' },
          { expand: true, src: ['index.html'], dest: 'dist/' },
          { expand: true, src: ['fonts/**'], dest: 'dist/' },
        ]
      }
    },


    // BROWSERIFY
    browserify: {
      build: {
        src: ['game/main.js'],
        dest: 'dist/js/game.js'
      }
    },



    // UGLIFY
    uglify: {
      options: {
        banner: '/*! Grunt Uglify <%= grunt.template.today("yyyy-mm-dd") %> */ '
      },
      build: {
        src: 'dist/js/game.js',
        dest: 'dist/js/game.js'
      } 
    }
  });
  


  grunt.registerTask('build', ['browserify', 'copy']);
  grunt.registerTask('serve', ['build', 'browserSync', 'watch']);
  grunt.registerTask('prod', ['build', 'uglify']);
  grunt.registerTask('default', ['serve']);

  grunt.registerTask('buildBootstrapper', 'builds the bootstrapper file correctly', function() {
    var stateFiles = grunt.file.expand('game/states/*.js');
    var gameStates = [];
    var statePattern = new RegExp(/(\w+).js$/);
    stateFiles.forEach(function(file) {
      var state = file.match(statePattern)[1];
      if (!!state) {
        gameStates.push({shortName: state, stateName: _.capitalize(state) + 'State'});
      }
    });
    config.gameStates = gameStates;
    console.log(config);
    var bootstrapper = grunt.file.read('templates/_main.js.tpl');
    bootstrapper = grunt.template.process(bootstrapper,{data: config});
    grunt.file.write('game/main.js', bootstrapper);
  });
};