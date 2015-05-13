var express = require('express');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var Movie = require('./model/movie');
var _ = require('underscore');
var path = require("path");
var bodyParser = require('body-parser');
var app = express();

mongoose.connect('mongodb://localhost/imovie');

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "bower_components")));
app.listen(port);

console.log('imovie started on port' + port);

app.get('/', function (req, res) {
    Movie.fetch(function (err, movie) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            movies: movie
        })
    })
});

app.get('/movie/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: movie.title,
            movie: movie
        })
    });
});

app.get('/admin', function (req, res) {
    res.render('admin', {
        title: '后台',
        movie: {
            id: '',
            doctor: '',
            title: '',
            language: '',
            country: '',
            summary: '',
            flash: '',
            poster: '',
            year: ''
        }
    })
});

app.get('/admin/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('admin', {
            title: movie.title,
            movie: movie
        })
    });
});

app.post('/admin/new', function (req, res) {
    var movieObj = req.body.movie,
        id = movieObj._id,
        _movie;

    var saveMovie = function () {
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        });
    }

    if (id != undefined) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj);
            saveMovie();
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            poster: movieObj.poster,
            year: movieObj.year
        });
        saveMovie();
    }
});

app.get('/list', function (req, res) {
    Movie.fetch(function (err, movie) {
        if (err) {
            console.log(err);
        }

        res.render('list', {
            title: '列表页',
            movies: movie
        })
    })
});