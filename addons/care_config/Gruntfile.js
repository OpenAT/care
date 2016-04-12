module.exports = function(grunt) {

    //needed plugins
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    //project configuration 
    grunt.initConfig({

        //clean
        clean: {
            css: {
                src: ['static/src/css/care.css']
            },
        },

        //compile sass files
        sass: {
            dist: {
                files: {
                    'static/src/css/care.css' : 'static/src/css/care.scss'
                }
            }
        },

        //autoprefix css styles
        autoprefixer: {
            options: {
                browsers: ['last 300 versions', '> 1%', 'ie 9', 'ie 8'],
                map: true
            },
            dist: {
                files: {
                    'static/src/css/care.css': 'static/src/css/care.css'
                }
            }
        },
    });

    grunt.registerTask('cleancss', ['clean:css']);
    grunt.registerTask( 'default', '', ['cleancss', 'sass', 'autoprefixer']);
};