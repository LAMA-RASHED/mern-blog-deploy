const Model = require('../models/user.model')


// @URL     GET /api/users
exports.list = async(req, res)=>{
    res.status(200).json(res.results)
}

// @URL     GET /api/users/:id
exports.read = async(req, res)=>{
    const data = await Model.findById(req.params.id)
    res.status(200).json({success: true, data})
    
}

// @URL     POST /api/users
exports.create = async(req, res)=>{
    const data = await Model.create(req.body)
    res.status(201).json({success: true, data})
}
// @URL     PUT /api/users/:id
exports.update = async(req, res)=>{
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    res.status(202).json({success: true, data})  
}

// @URL     DELETE /api/users/:id
exports.delete = async(req, res)=>{
    const data = await Model.findById(req.params.id)
    await data.deleteOne()
    res.status(204).json({success: true, data:{}})
}