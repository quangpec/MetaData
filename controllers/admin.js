const Project = require('../models/project');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');
const { mailNotification } = require('../util/sendmail');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const ITEMS_PER_PAGE = 5;

exports.getFilter = (req, res, next) => {

  res.render('admin/filter', {
    pageTitle: 'Bộ lọc tùy chỉnh',
    path: '/admin/filter',
  })
}
exports.postUploadfile = (req, res, next) => {
  console.log(req.file);

  // try {
  //   fs.readFile(req.files.upload.path, function (err, data) {
  //       var newPath = __dirname + '/public/images/' + req.files.upload.name;
  //       fs.writeFile(newPath, data, function (err) {
  //           if (err) console.log({err: err});
  //           else {
  //               console.log(req.files.upload.originalFilename);
  //           //     imgl = '/images/req.files.upload.originalFilename';
  //           //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
  //           //    res.status(201).send(img);

  let url = '/images/' + req.file.filename;
  let msg = 'Upload successfully';
  let funcNum = req.query.CKEditorFuncNum;
  //               console.log({url,msg,funcNum});
  res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
  //           }
  //       });
  //   });
  //  } catch (error) {
  //      console.log(error.message);
  //  }

}
exports.getAddProject = (req, res, next) => {
  res.render('admin/edit-project', {
    pageTitle: 'Add Project',
    path: '/admin/add-project',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProject = (req, res, next) => {
  const errors = validationResult(req);
  console.log('lỗi',!errors.isEmpty());
  const title = req.body.title;
  const image = req.file;
  const target = req.body.target;
  const description = req.body.description;
  const endDate = req.body.endDate;
  const startDate = req.body.startDate;
  if (!image) {
    return res.status(422).render('admin/edit-project', {
      pageTitle: 'Add Project',
      path: '/admin/add-project',
      editing: false,
      hasError: true,
      project: {
        title: title,
        target: target,
        description: description,
        endDate: endDate,
        startDate: startDate
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  // const errors = validationResult(req);
  // console.log(errors);

  if (!errors.isEmpty()) {
    console.log(endDate)

    return res.status(422).render('admin/edit-project', {
      pageTitle: 'Add Project',
      path: '/admin/add-project',
      errorMessage: errors.array()[0].msg,
      editing: false,
      hasError: true,
      project: {
        title: title,
        imageUrl: image.path,
        target: target,
        description: description,
        endDate: endDate,
        startDate: startDate
      },
      validationErrors: errors.array(),
    });
  }
  const project = new Project({
    title: title,
    target: target,
    description: description,
    imageUrl: image.path,
    totalAmountRaised: 0,
    status: 'waiting',
    endDate: endDate,
    startDate: startDate,
    luotQuyengop: 0
  });
  project
    .save()
    .then(result => {
      console.log('Created Project');
      res.redirect('/admin/projects');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

};

exports.getEditProject = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.projectId;
  Project.findById(prodId)
    .then(project => {
      if (!project) {
        return res.redirect('/');
      }
      res.render('admin/edit-project', {
        pageTitle: 'Edit project',
        path: '/admin/edit-project',
        editing: editMode,
        hasError: false,
        errorMessage: null,
        project: project,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProject = (req, res, next) => {
  const prodId = req.body.projectId;
  const updatedTitle = req.body.title;
  const updatedTarget = req.body.target;
  const image = req.file;
  const updatedDesc = req.body.description;
  const updatendDate = req.body.endDate;
  const updateStdate = req.body.startDate;
  const updateStatus = req.body.status;

  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-project', {
      pageTitle: 'Edit project',
      path: '/admin/edit-project',
      editing: true,
      hasError: true,
      project: {
        title: updatedTitle,
        target: updatedTarget,
        description: updatedDesc,
        _id: prodId,
        endDate: updatendDate,
        startDate: updateStdate,
        status: updateStatus
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Project.findById(prodId)
    .then(project => {
      project.title = updatedTitle;
      project.target = updatedTarget;
      project.description = updatedDesc;
      project.endDate = updatendDate;
      project.startDate = updateStdate;
      project.status = updateStatus;
      if (image) {
        try {
          fileHelper.deleteFile(project.imageUrl);
        } catch (err) {
          console.log(err)
        }
        project.imageUrl = image.path;
      }
      return project.save().then(result => {
        console.log('UPDATED Project!');
        res.redirect('/admin/projects');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProjects = (req, res, next) => {
  const ITEMS_PER_PAGE = 5;
  const keyWord = req.query.keyWord || '';
  const status = req.query.status || ['waiting', 'runing', 'stop'];
  const target = req.query.target || '';
  const target_min = req.query.target_min || '';
  const target_max = req.query.target_max || '';
  var tgMin;
  var tgMax;

  if (target == '' || target == "0") {
    tgMin = 0;
    tgMax = 100000000000;
  } else if (target == "1") {
    tgMin = 0;
    tgMax = 100000000;
  } else if (target == "2") {
    tgMin = 100000000;
    tgMax = 200000000;
  } else if (target == "3") {
    tgMin = 200000000;
    tgMax = 500000000;
  } else {
    tgMin = 500000000;
    tgMax = 100000000000;
  }
  if (target_min !== '') {
    tgMin = +target_min + 0;
  }
  if (target_max !== '') {
    tgMax = +target_max + 0;
  }
  const startDate = new Date(req.query.startDate || '2000-01-01');
  const endDate = new Date(req.query.endDate || '2100-01-01');
  const del = req.flash('delele')[0];
  const page = +req.query.page || 1;
  const stt = (page - 1) * ITEMS_PER_PAGE;
  let totalItems;
  Project.find({ $and: [{ status: status }, { target: { $gte: tgMin, $lt: tgMax } }, { startDate: { $gt: startDate } }, { endDate: { $lt: endDate } }, { $or: [{ title: { $regex: keyWord, $options: 'i' } }, { description: { $regex: keyWord, $options: 'i' } }] }] })
    .countDocuments()
    .then(numProjects => {
      totalItems = numProjects;
      return Project.find({ $and: [{ status: status }, { target: { $gte: tgMin, $lt: tgMax } }, { startDate: { $gt: startDate } }, { endDate: { $lt: endDate } }, { $or: [{ title: { $regex: keyWord, $options: 'i' } }, { description: { $regex: keyWord, $options: 'i' } }] }] })
        .sort({ startDate: 1 })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(projects => {
      res.render('admin/projects', {
        del: del,
        prods: projects,
        pageTitle: 'Admin Projects',
        path: '/admin/projects',
        totalProjects: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        page: page,
        stt: stt
      });
      req.flash('delele', null);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postDelManyProject = (req, res, next) => {
  const listId = req.body.listId;
  if (!listId) {
    return res.redirect('/admin/projects'); // không thể xóa vì chưa chọn
  }
  const arrId = listId.split(',');
  Project.find({ '_id': arrId })
    .then(projects => {
      if (!projects) {
        return next(new Error('Project not found.'));
      }
      try {
        for (const project of projects) {
          fileHelper.deleteFile(project.imageUrl);
        }
      }
      catch (err) {
        console.log('err');
      }
      return Project.deleteMany({ _id: arrId });
    })
    .then(() => {
      console.log('DESTROYED PROJECT');
      req.flash('delele', 'đã xóa thành công');
      res.redirect('/admin/projects'); // cần chuyển về trang thông báo 
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
exports.postDeleteProject = (req, res, next) => {
  const prodId = req.body.projectId;
  Project.findById(prodId)
    .then(project => {
      if (!project) {
        return next(new Error('Project not found.'));
      }
      try {
        fileHelper.deleteFile(project.imageUrl);
      }
      catch (err) {
        console.log('err');
      }
      return Project.deleteOne({ _id: prodId });
    })
    .then(() => {
      console.log('DESTROYED PROJECT');
      req.flash('delele', 'đã xóa thành công');
      res.redirect('/admin/projects'); // cần chuyển về trang thông báo 
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getUsers = (req, res, next) => {
  const message = req.flash('message')[0];
  const ITEMS_PER_PAGE = 30;
  const keyWord = req.query.keyWord || ''.trim();
  const status = req.query.status || '';
  const startDate = req.query.startDate || 0;
  const page = +req.query.page || 1;
  const stt = (page - 1) * ITEMS_PER_PAGE;
  let totalItems;

  const del = req.flash('delele')[0];
  const upd = req.flash('update')[0];
  User.find({ $and: [{ status: { $regex: status, $options: 'i' } }, { startDate: { $gte: startDate } }, { $or: [{ email: { $regex: keyWord, $options: 'i' } }, { name: { $regex: keyWord, $options: 'i' } }] }] })
    .countDocuments()
    .then(numProjects => {
      totalItems = numProjects;
      return User.find({ $and: [{ status: { $regex: status, $options: 'i' } }, { startDate: { $gte: startDate } }, { $or: [{ email: { $regex: keyWord, $options: 'i' } }, { name: { $regex: keyWord, $options: 'i' } }] }] })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(users => {
      res.render('admin/users', {
        pageTitle: 'Quản lý users',
        path: '/admin/users',
        users: users,
        del: del,
        upd: upd,
        message: message,
        totalProjects: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + +1,
        previousPage: page - +1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        page: page,
        stt: stt,
        validationErrors:[],
        oldInput:{
          email:'',
        }
      })
    })
    .catch(err => console.log(err));

}
exports.postDelUser = (req, res, next) => {
  const userId = req.body.userId;
  let mailUser = '';
  User.findById(userId)
    .then(user => {
      mailUser = user.email;
    })
    .catch(err => {
      console.log('xóa user ko thành công ');
      req.flash('delele', 'ko thành công');
      return res.redirect('/admin/users');
    })
  User.findOneAndDelete({ _id: userId })
    .then(() => {
      console.log('DESTROYED PROJECT');
      req.flash('delele', 'đã xóa thành công');
      mailNotification(mailUser, 'Thông báo tài khoản của bạn bị xóa vào lúc ' + new Date() + ' trân trọng thông báo');
      res.redirect('/admin/users'); // cần chuyển về trang thông báo 
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
exports.postUpdateUser = async (req, res, next) => {
  const status = req.body.status;
  const userId = req.body.userId;
  const sendmail = req.body.sendmail;
  const permission = req.body.permission;
  const user = await User.findById(userId);
  const mailUser = user.email;
  user.status = status;
  if (permission) {
    user.permission = true;
  }
  await user.save();
  req.flash('update', 'Cập nhật user thành công');
  if (sendmail) {
    mailNotification(mailUser, 'Thông báo trạng thái tài khoản của bạn được cập nhật vào lúc ' + new Date() + ' hiện trạng thái mới của tài khoản này là:' + status + ' trân trọng thông báo');
  }
  res.redirect('/admin/users');
}
exports.postdelManyusers = (req, res, next) => {
  const listId = req.body.listId;
  if (!listId) {
    return res.redirect('/admin/users'); // không thể xóa vì chưa chọn
  }
  const arrId = listId.split(',');
  User.find({ '_id': arrId })
    .then(users => {
      for (let user of users) {
        mailNotification(user.email, 'Thông báo tài khoản của bạn bị xóa vào lúc ' + new Date() + ' trân trọng thông báo');
      }
      return User.deleteMany({ _id: arrId });
    })
    .then(() => {
      console.log('DESTROYED PROJECT');
      req.flash('delele', 'đã xóa thành công');
      res.redirect('/admin/users'); // cần chuyển về trang thông báo 
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

}
exports.postAddusers = (req, res, next) => {
  const email = req.body.email;
  const name = email;
  const password = Math.floor(Math.random() * (99999 - 10000) + 100000).toString();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    req.flash('message',errors.array()[0].msg);
    return res.status(422).redirect('/admin/users');
  }
  return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        avatar: '',
        permission: false,
        startDate: new Date(),
        status: 'verified',
        confirmDate: new Date(),
        otp: null,
        tokenResetpass: {
          token: null,
          expires: null
        }
      });
      return user.save();
    })
    .then(result => {
      mailNotification(email, 'Chào mừng bạn đến với abc.com tài khoản của bạn là email :' + email + ', password:' + password + ' link đăng nhập : <a>https://myprojectnodejsx.herokuapp.com/login</a>');
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      req.flash('message', 'Thêm người dùng thành công!');
      // Preview only available when sending through an Ethereal account
      res.redirect('/admin/users');
      // return transporter.sendMail({
      //   to: email,
      //   from: 'shop@node-complete.com',
      //   subject: 'Signup succeeded!',
      //   html: '<h1>You successfully signed up!</h1>'
      // });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postlistAddusers = (req, res, next) => {
  const listMail = req.file.path;

   fs.readFile(listMail, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const list = data.split(/\r?\n/);
    for(const email of  list){
      if(email == ''){
        continue;
      }
      const name = email;
      const password = Math.floor(Math.random() * (99999 - 10000) + 100000).toString();
       bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          name: name,
          avatar: '',
          permission: false,
          startDate: new Date(),
          status: 'verified',
          confirmDate: new Date(),
          otp: null,
          tokenResetpass: {
            token: null,
            expires: null
          }
        });
        user.save()
        .then( result =>{
          mailNotification(email,'Chào mừng bạn đến với abc.com tài khoản của bạn là email :' + email +', password:' + password + ' link đăng nhập : <a>https://myprojectnodejsx.herokuapp.com/login</a>' );
        })
      })  
    }
   })
   req.flash('message', 'Thêm người dùng thành công!');
   res.redirect('/admin/users');
}