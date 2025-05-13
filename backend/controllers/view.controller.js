const Model = require('../models/view.model')



exports.getUserViews = async(req, res)=>{
    const views = await Model.find({userId: req.user._id}).populate('postId', 'title')
    res.status(200).json({
        success: true, 
        views: views.length, 
        views
    })
}
