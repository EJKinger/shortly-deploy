module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: ['public/client/app.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linkView.js',
              'public/client/linksView.js', 'public/client/createLinkView.js', 'public/client/router.js'],
        dest: 'public/dist/<%= pkg.name %>-<%= pkg.version %>.js',
      },
      lib: {
        src: ["public/lib/jquery.js", "public/lib/underscore.js", "public/lib/backbone.js", "public/lib/handlebars.js"],
        dest: 'public/dist/lib-<%= pkg.version %>.js'
      }

    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        sourceMap: function(path) { return path.replace(/.js/,".map")}
      },
      target: {
        files: {
          'public/dist/<%= pkg.name %>-<%= pkg.version %>.min.js': ['public/dist/<%= pkg.name %>-<%= pkg.version %>.js'],
          'public/dist/lib-<%= pkg.version %>.min.js': ['public/dist/lib-<%= pkg.version %>.js']
        }
      }
    },

    jshint: {
      files: {
        src: ['app/**/*.js', 'lib/**/*.js', 'public/client/*.js', 'server-config.js', 'server.js']
        // Add filespec list here
      },
      options: {
        //force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {

      options: {
        
      },
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'mochaTest',
    'concat',
    'uglify',
    'cssmin' ]);

  grunt.registerTask('upload', ['shell']);

  grunt.registerTask('deploy', function(){
    grunt.task.run(['build']);

    if(grunt.option('prod')) {
      grunt.task.run(['upload']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });
    
};


// function(){
//   grunt.task.run([ 'server-dev']);
// }


















