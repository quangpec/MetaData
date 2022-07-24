const Project = require('../models/project');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');
const {mailNotification} = require('../util/sendmail');
const ITEMS_PER_PAGE =5;

exports.getFilter = (req,res,next)=>{

  res.render('admin/filter', {
    pageTitle: 'Bộ lọc tùy chỉnh',
    path: '/admin/filter',
  })
}

exports.getAddProject = (req, res, next) => {
  res.render('admin/edit-project', {
    pageTitle: 'Add Project',
    path: '/admin/add-Project',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProject = (req, res, next) => {
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
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
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
        try{
          fileHelper.deleteFile(project.imageUrl);
        }catch(err){
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
  const keyWord= req.query.keyWord||'';
  const status = req.query.status||['waiting','runing','stop'];
  const target = req.query.target||'';
  const target_min = req.query.target_min||'';
  const target_max = req.query.target_max||'';
  var tgMin;
  var tgMax; 

    if(target ==''||target =="0"){
      tgMin = 0;
      tgMax = 100000000000;
    } else if (target=="1"){
      tgMin = 0;
      tgMax = 100000000;
    }else if (target=="2"){
      tgMin = 100000000;
      tgMax = 200000000;
    }else if (target=="3"){
      tgMin = 200000000;
      tgMax = 500000000;
    }else{
      tgMin = 500000000;
      tgMax = 100000000000;
    }
    if(target_min !== ''){
        tgMin = +target_min+0;
    }
    if (target_max !== ''){
      tgMax =+target_max+0;
    }
    console.log(target, tgMin ,tgMax);

  const startDate = new Date(req.query.startDate||'2000-01-01');
  const endDate = new Date(req.query.endDate|| '2100-01-01');
  const del = req.flash('delele')[0];
    const page = +req.query.page||1;
    const stt = (page-1)*ITEMS_PER_PAGE;
    let totalItems;
    Project.find({$and:[{status: status}, {target: {$gte:tgMin , $lt: tgMax}} ,{startDate: {$gt:startDate}},{endDate: {$lt:endDate}},{  $or: [{title:{ $regex: keyWord , $options: 'i'}},{description:{ $regex: keyWord , $options: 'i'}}]}]})  
      .countDocuments()
      .then(numProjects => {
        totalItems = numProjects;
        return Project.find({$and:[{status: status}, {target: {$gte:tgMin , $lt: tgMax}} ,{startDate: {$gt:startDate}},{endDate: {$lt:endDate}},{  $or: [{title:{ $regex: keyWord , $options: 'i'}},{description:{ $regex: keyWord , $options: 'i'}}]}]}) 
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
    .then(projects => {
      console.log(projects);
      res.render('admin/projects', {
        del: del,
        prods: projects,
        pageTitle: 'Admin Projects',
        path: '/admin/project',
        totalProjects: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        page: page,
        stt:stt
      });
      req.flash('delele',null);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postDelManyProject = (req,res,next)=>{
  const listId = req.body.listId;
  if(!listId){
    return res.redirect('/admin/projects'); // không thể xóa vì chưa chọn
  }
  console.log(listId);
  const arrId = listId.split(',');
  Project.find({'_id':arrId})
    .then(projects => {
      if (!projects) {
        return next(new Error('Project not found.'));
      }
      try{
        for(const project of projects){
        fileHelper.deleteFile(project.imageUrl);
        }
        }
        catch(err){
          console.log('err');
        }
      return Project.deleteMany({ _id: arrId});
    })
    .then(() => {
      console.log('DESTROYED PROJECT');
      req.flash('delele','đã xóa thành công');
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
      try{
      fileHelper.deleteFile(project.imageUrl);
      }
      catch(err){
        console.log('err');
      }
      return Project.deleteOne({ _id: prodId});
    })
    .then(() => {
      console.log('DESTROYED PROJECT');
      req.flash('delele','đã xóa thành công');
      res.redirect('/admin/projects'); // cần chuyển về trang thông báo 
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getUsers = (req,res,next)=>{
  const keyWord = req.query.keyWord||''.trim();
  const del = req.flash('delele')[0];
  User.find({$or:[{email:{$regex: keyWord,$options: 'i'}},{name:{$regex:keyWord,$options: 'i'}}]})
  .then(users => {
    res.render('admin/users', {
      pageTitle: 'Quản lý users',
      path: '/admin/users',
      users: users,
      stt: 0,
      previousPage:0,
      page:1,
      nextPage:2,
      lastPage:1,
      del: del
    })
  })
  .catch(err => console.log(err));
 
}
exports.postDelUser = (req,res,next)=>{
  const userId = req.body.userId;
  let mailUser ='';
  User.findById(userId)
  .then(user =>{
    mailUser = user.email;
  })
  .catch(err => {
    console.log('xóa user ko thành công ');
    req.flash('delele','ko thành công');
    return  res.redirect('/admin/users');  
  })
  User.findOneAndDelete( {_id : userId})
  .then(() => {
    console.log('DESTROYED PROJECT');
    req.flash('delele','đã xóa thành công');
    mailNotification(mailUser,'Chúng tôi đã xóa bạn khỏi hệ thống')
    res.redirect('/admin/users'); // cần chuyển về trang thông báo 
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}