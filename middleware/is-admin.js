module.exports = (req, res, next) => {
    if (!req.user.permission) {
        return res.redirect('/');
    }
    next();
}
 // nếu không phải admin truy cập vào các đường dẫn quản trị sẽ tự động điều hướng về home page '/'