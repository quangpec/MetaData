const RootSchema = require('../models/rootCollection');
const TypeTable = require('../models/typeOfcol')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getTypeByString = (typeName) => {
  switch (typeName) {
    case 'String': return String
    case 'Number': return Number
    case 'Boolean': return Boolean
    case 'Date': return Date
    case 'Object': return Object
  }
}
exports.postNewrow = async (req, res, next) => {
  const nameTable = req.body.idTable;
  const newRow = req.body.data;
  if (Object.keys(newRow).length>0) {
    const table = await RootSchema.find({name_Collection: nameTable }).exec();
    const schema = table[0].schema;
    const schemaObject = {};
    for (const col of schema) {
      schemaObject[col.colName] = {
        type: getTypeByString(col.colStyle),
      }
    }
    const DatabaseSchema = new mongoose.Schema(schemaObject);
    const DatabaseModel = mongoose.model(nameTable, DatabaseSchema);
    await new DatabaseModel(newRow).save();
    const newData = await DatabaseModel.find().exec();
    delete mongoose.connection.models[nameTable];
    res.json({ done: true, data:newData[newData.length-1]})
  } else {
    res.json({ done: false })
  }
}
exports.getDataTable = async (req, res, next) => {
  const keyTable = req.params.tableId;
  const tableData = await RootSchema.findOne({ name_Collection: keyTable }).exec()
  const DatabaseModel = mongoose.model(keyTable, new Schema({}, { strict: false }));
  const dataSchema = await DatabaseModel.find({});
  delete mongoose.connection.models[keyTable];
  res.status(200).json({
    message: 'post data table' + keyTable,
    post: {
      name: tableData.name_CollectionView,
      idTbale: tableData.name_Collection,
      heading: tableData.schema.map(el => el.colView), // lấy từ rootTalbe
      data: dataSchema,// [] -> is a row [[]]
      colName: tableData.schema.map(el => el.colName)
    }
  })
}
exports.postNewTable = async (req, res, next) => {
 
  const nameTable = req.body.nameTable;
  const numOfcol = req.body.numOfcol;
  const name_CollectionView = req.body.nameTableview;
  const schema = req.body.schema;
  const num = await RootSchema.find({ name_Collection: nameTable }).countDocuments().exec();
  if (num === 1) {
    return res.json({ done: false })
  }
  else {
    console.log(num);
    const newRow = new RootSchema(
      {
        heading: 'Nhom 1',
        name_Collection: nameTable,
        name_CollectionView: name_CollectionView,
        numCol: numOfcol,
        schema,
      })
    newRow.save();
    const schemaObject = {};
    for (const col of schema) {
      schemaObject[col.colName] = {
        type: getTypeByString(col.colStyle),
      }
    }
    const DatabaseSchema = new Schema(schemaObject);
    const DatabaseModel = mongoose.model(nameTable, DatabaseSchema);
    const newRowtb = {};
    schema.map(e => e.colName).map(e => newRowtb[e] = "");
    new DatabaseModel(newRowtb).save();
    delete mongoose.connection.models[nameTable];
    res.json({ done: true })
  }
}
exports.getIndex = (req, res, next) => {
  RootSchema.find()
    .countDocuments()
    .then(numProject => {
      totalItems = numProject;
      return RootSchema.find()
    })
    .then(tableArray => {
      res.status(200).json({
        message: 'post data',
        post: {
          table: tableArray.map(el => ({
            heading: el.heading,
            name_Collection: el.name_Collection,
            name_CollectionView: el.name_CollectionView,
            NameCol: el.schema.map(col => col.colName),
            NameColview: el.schema.map(col => col.colView),
          })),
          total: totalItems,
          typeCol: [
            {
              view: "String",
              value: "String"
            },
            {
              view: "Number",
              value: "Number"
            },
            {
              view: "Date",
              value: "Date"
            },
            {
              view: "Boolean",
              value: "Boolean"

            },
            {
              view: "Object",
              value: "Object"
            }
          ]
        }
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};