const TestService = require("../service/test1.service")



class TestController {
    async createTest (req,res){
        try {
            const test = await TestService.createTest(req.body)
            res.status(201).json(test);
        } catch (error) {
            res.status(500).json({ message: 'Error creating test', error });
        }
    }
    async getAllTests (req,res) {
        try {
            const tests = await TestService.getAllTests()
            res.json(tests);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tests', error });
        }
        
    }
    async getTestById (req, res) {
        try {
            const test = await TestService.getTestById(req.params.id);
            if (!test) return res.status(404).json({ message: 'Test not found' });
            res.json(test);
          } catch (error) {
            res.status(500).json({ message: 'Error fetching test', error });
          }
    }
    async updateTest (req,res){
        try {
            const test = await TestService.updateTest(req.params.id, req.body);
            if (!test) return res.status(404).json({ message: 'Test not found' });
            res.json(test);
          } catch (error) {
            res.status(500).json({ message: 'Error updating test', error });
          }
    }
    async deleteTest (req,res){
        try {
            const test = await TestService.deleteTest(req.params.id);
            if (!test) return res.status(404).json({ message: 'Test not found' });
            res.json({ message: 'Test deleted successfully' });
          } catch (error) {
            res.status(500).json({ message: 'Error deleting test', error });
          }
    }
}


module.exports = new TestController()