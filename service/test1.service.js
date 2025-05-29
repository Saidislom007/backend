const TestModel = require("../models/test.model")

class TestService {
    async createTest (testData){
        return await TestModel.create(testData)
    }
    async getAllTests(){
        return await TestModel.find().sort({createdAt: -1})
    }
    async getTestById (id){
        return await TestModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
    }
    async updateTest (id, updatedData){
        return await TestModel.findByIdAndUpdate(id, updatedData, { new: true })
    }
    async deleteTest (id){
        return await TestModel.findByIdAndDelete(id);
    }

}



module.exports = new TestService()