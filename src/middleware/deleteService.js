const Service = require('../models/service')

const deleteService = async (req, res, next) => {
    var service = await Service.find()
    var deletedService = service.find((e) => e.deleteTime - new Date() < 0)

    if (deletedService) {
        refreshComponent(req, res)
        await Service.findOneAndDelete({ _id: deletedService._id })
    }
    next()
}
module.exports = deleteService;