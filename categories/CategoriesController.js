const express = require("express");
const Category = require("./Category");
const router = express.Router();
const Slugify = require("slugify");
const { default: slugify } = require("slugify");


router.get('/categories', (req, res) =>{
    res.send("ROTA DE CATEGORIAS")
});

router.get('/admin/categories/new', (req, res) => {
    res.render("admin/categories/new")
});

router.post('/categories/save', (req,res) => {
    var title = req.body.title;
    if((title != undefined) && (title != " ") && (title != "")){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories/index');
        })
    }else{
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories/index', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {
            categories: categories
        });
    });
});

router.post('/categories/delete', (req, res) =>{
    var id = req.body.id;
    if(id!=undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() =>{
                res.redirect('/admin/categories/index');
            });
        }else{
            res.redirect('/admin/categories/index');
        }
    }else{
        res.redirect('/admin/categories/index');
    }
});

router.get('/admin/categories/edit/:id' , (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/categories/index');
    }

    Category.findByPk(id).then(categories => {
        if(categories != undefined){
            res.render('admin/categories/edit', {categories: categories});
        }else{
            res.redirect('/admin/categories/index');
        }
    }).catch(erro => {
        res.redirect('/admin/categories/index');
    })
})

router.post('/categories/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories/index');
    })
});

module.exports = router;