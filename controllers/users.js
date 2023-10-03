const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

const renderRegisterFrom = (req,res)=>{
    res.render("users/register")
};

const renderLoginFrom = (req,res)=>{
    res.render("users/login")
};

const addUser = catchAsync(async (req,res)=>{
    try{
        const {email,username,password} = req.body;
        const user = new User({username,email});
        const regUser = await User.register(user,password);
        req.login(regUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash('success','Welcome to Yelp Camp')
            res.redirect('/campgrounds');
        });
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register')
    }
  
});

const login = (req,res)=>{
    req.flash('success','Welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
    req.logout((err)=> {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};


module.exports = {renderRegisterFrom,addUser,renderLoginFrom,login,logout}