const express = require('express');
const Sequelize = require('sequelize')
var app = express();
const bloodDonor = require('./db').bloodDonor
const bloodCamp = require('./db').bloodCamp
const bodyParser = require('body-parser');
const hospital = require('./db').hospital
const { Op } = require("sequelize");
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/', express.static('./public') );
app.post('/insertRowDonor',async (req,res)=>{

  await bloodDonor.create({
    Donor_id: req.body.Donor_id,
    BloodCampId:req.body.BloodCampId,
    BloodGrp: req.body.BloodGrp,
    Age: req.body.Age,
    Gender: req.body.Gender,
    MonthsLastDon: req.body.MonthsLastDon,
    TotDon: req.body.TotDon,
    VolDon: req.body.VolDon,
    MonthsFirstDon: req.body.MonthsFirstDon,
    BloodDonNxt: req.body.BloodDonNxt
  })
  res.sendStatus(200)

})
app.post('/insertRowCamp',async(req,res)=>{
    await bloodCamp.create({
        BloodCampId: req.body.BloodCampId,
        Name:req.body.Name,
        Area: req.body.Area,
        zipCode :req.body.zipCode
      })
    res.sendStatus(200);
})
app.post('/insertRow',async(req,res)=>{
    await hospital.create({
        hospitalId: req.body.hospitalId,
        Name:req.body.Name,
        Area: req.body.Area,
        Contact: req.body.Contact,
        zipCode: req.body.zipCode
      })
    res.sendStatus(200)
})
app.get('/Display/display',async(req,res)=>{
     var result = await bloodDonor.findAll()
    res.send(result)
})
app.get('/Query/getall',async(req,res)=>{
    var result = await bloodCamp.findAll()
    res.send(result)
})
app.get('/Analysis/getall',async(req,res)=>{
  var result = await bloodCamp.findAll()
  res.send(result)
})
app.post('/getResult',async (req,res)=>{
  // console.log(req.body.hospitalId)
  var result =  await hospital.findAll({
    attributes: ['zipCode'],
    where:{
      [Op.and]:{
        hospitalId:req.body.hospitalId,
        Name:req.body.Name
      }
    }
    })
    console.log(result)
    if(result == 0)
      res.sendStatus(400)
     res.send(result)
})
app.listen(5000, function(){
    console.log('Server is listening on 5000');
})