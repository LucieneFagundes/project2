const express = require("express");
const app = express();
const connection = require('./database/database');
const session = require('express-session')

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require('./user/UsersController')

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require('./user/User')

//Session
app.use(session({
    secret: '@qualquercoisa', cookie: {maxAge: 60000}
}))


// VIEW ENGINE
app.set('view engine', 'ejs');

//STATIC
app.use(express.static('public'));

//BODY PARSER EM DESUSO
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//DATABASE
connection
    .authenticate()
    .then(() =>{
        console.log("CONEXÃO COM O BANCO REALIZADA");
    }).catch((msgErro) => {
        console.log("FALHA NA CONEXÃO: " + msgErro);
    }) 

//ROTAS
    //Rotas externas
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

    //Rota raiz
app.get("/", (req,res)=> {
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories:categories});
        })
    })
});

//ROTA DE UM ARTIGO ESPECÍFICO
app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {slug: slug}
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories:categories});
            })
        }else{
            res.redirect('/');
        }
    }).catch(error => {
        res.redirect('/', console.log(error));
    });
});

//ROTAS DE ARTIGOS FILTRADAS PELA CATEGORIA
app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {slug:slug},
    //    order: [['id', 'DESC']],
        include: [{model: Article}]
    }).then( category => {
        if (category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            });
        }else{
            res.redirect('/');
        }
    }).catch( err => {
        res.redirect('/');   
    })
})



app.listen(8091, () =>{
    console.log("O servidor está funcionando. Para interromper, aperte CTRL + C.");
})