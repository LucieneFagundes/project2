const express = require('express');
const { default: slugify } = require('slugify');
const Article = require('./Article');
const router = express.Router();
const Category = require('../categories/Category');

router.get('/articles', (req, res) =>{
    res.send('ROTA DE ARTIGOS')
});

router.get('/admin/articles/index', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles =>{
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    })
});

router.post('/articles/save', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    if( title != undefined){

        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect("/admin/articles/index");
        })
    }else{
        res.redirect('admin/articles/new');
    }
});

router.post('/articles/delete', (req, res) =>{
    var id = req.body.id;
    if(id!=undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() =>{
                res.redirect('/admin/articles/index');
            });
        }else{
            res.redirect('/admin/articles/index');
        }
    }else{
        res.redirect('/admin/articles/index');
    }
});

router.get('/admin/articles/edit/:id', (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/articles/index');
    }

    Article.findByPk(
        id, 
        {include: [{model: Category}]  
    })
    .then(articles => {
            if(articles != undefined){
                Category.findAll().then(categories => {
                    res.render('admin/articles/edit', {articles: articles, categories: categories})
                })
        }else{
            res.redirect('admin/articles/index')
        }
    })
    .catch(erro => {
        res.redirect('admin/articles/index')
    })
});

router.post('/articles/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update(
        {title: title, slug: slugify(title), body: body, categoryId: category},
        {where: {id: id}}
    ).then(()=> {
        res.redirect('/admin/articles/index');
    })
})

module.exports = router;

