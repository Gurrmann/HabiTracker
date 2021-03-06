var express = require('express');
var router = express.Router();
var Budget = require('../models/budget');



var moneyDistributer = (type, total) => {
    switch (type) {

        case 'savings':
            return (total * 0.25)
        
        case 'food':
            return (total * 0.20)

        case 'leisure':
            return (total * 0.25)

        case 'essentials':
            return (total * 0.2)

        case 'misc':
            return (total * 0.1)

    }

}

//GET all budgets.
router.get('/', function(req, res, next){
    Budget.find(function(err, budgets){
        if (err) {return next(err);}
        if (budgets.length === 0) {
            return res.status(404).json({'message': 'There is no existing budget!'});
        }
        res.status(200).json({'budgets': budgets});
    });
});

//GET budget by id.
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    Budget.findById(id, function(err, budgets) {
        if (err) { return next(err); }
        if (budgets === null) {
            return res.status(404).json({'message': 'Budget not found'});
        }
        res.status(200).json(budgets);
    });
});

//POST a budget.
router.post('/', function(req, res, next) {
    var budget = new Budget(req.body);
    budget.savings = moneyDistributer('savings',req.body.income)
    budget.save(function(err, budget) {
        if(err) { return next(err); }
        res.status(201).json(budget);
    });
});

//DELETE budget collection.
router.delete('/', function(req, res, next){
    Budget.db.dropCollection("budgets", function(err, budgets){
        if (err) {return next(err); }
        if (budgets === null){
            return res.status(404).json({'message': 'There is no budget to delete!'});
        };
        res.status(200).json({'message': 'All bugets have been deleted.'})
    });
});

//DELETE budget by id.
router.delete('/:id', function(req, res, next) {
    var id = req.params.id;
    Budget.findOneAndDelete({_id: id}, function(err, budget) {
        if (err) {return next(err); }
        if (budget === null){
            return res.status(404).json({'message': 'Budget not found'});
        }
        res.status(200).json({'message': 'Budget deleted.'})
    
        });
});

//PATCH a bucget by id.
router.patch('/:id', function(req, res, next) {
    var id = req.params.id;
    Budget.findById(id, function(err, budget){
        if(err) {return next(err);}
        if(budget == null){
            return res.status(404).json({"message": "Budget not found"});
        }
        budget.expenses = (req.body.expenses || budget.expenses),
        budget.name = (req.body.name || budget.name),
        budget.income = (req.body.income || budget.income),
        budget.food = (req.body.food || budget.food),
        budget.essentials = (req.body.essentials || budget.essentials),
        budget.misc = (req.body.misc || budget.misc),
        budget.leisure = (req.body.leisure || budget.leisure)
        budget.savings = (req.body.savings || budget.savings)
        budget.save();
        res.status(200).json(budget);
    });
});

//PUT budget by id.
router.put('/:id', function(req,res,next) {
    var id = req.params.id;
    Budget.findById(id, function(err, budget) {
        if (err) {return next(err);}
        if (budget == null) {
            return res.status(404).json({"message": "Budget not found"})
        }
        budget.name = req.body.name,
        budget.income = req.body.income,
        budget.expenses = req.body.expenses,
        budget.savings = req.body.savings
        budget.save();
        res.status(200).json(budget);

    })
})

module.exports = router;
module.exports.moneyDistributer = moneyDistributer;