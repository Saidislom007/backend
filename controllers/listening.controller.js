const ListeningTestService = require("../service/listening.service")




class ListeningTestController{
      async addListeningTest(req, res) {
        try {
          const {  correct_answer, difficulty, category, content } = req.body;
      
          const newListeningdata = await ListeningTestService.createListeningTest({
            correct_answer,
            difficulty,
            category,
            content  // ✅ content qo‘shildi
          });
      
          res.status(201).json({
            message: 'Listening Test added successfully',
            data: newListeningdata
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            message: "Error adding Listening Test",
            error: err.message
          });
        }
      }
        async addBulkListeningTest(req, res) {
          try {
            const ListeningTestList = req.body;
        
            if (!Array.isArray(ListeningTestList) || ListeningTestList.length === 0) {
              return res.status(400).json({ message: 'Please send a non-empty array of grammar items.' });
            }
        
            // Har bir itemda content ham bo‘lishi mumkin
            const inserted = await ListeningTestService.addBulkListeningTest(ListeningTestList);
        
            res.status(201).json({
              message: 'Bulk listening test  added successfully',
              count: inserted.length,
              data: inserted
            });
          } catch (error) {
            res.status(500).json({ message: 'Error adding bulk listening test', error: error.message });
          }
        }
        async updateListeningTest(req, res) {
            try {
            const { number_of_solvers, correct_count, wrong_count } = req.body;
            const updatedListeningTest = await ListeningTestService.updateListeningTest(
                req.params.id, 
                number_of_solvers, 
                correct_count, 
                wrong_count
            );
            res.status(200).json({ message: 'Listening Test updated successfully', data: updatedListeningTest });
            } catch (error) {
            res.status(500).json({ message: 'Error updating Listening Test', error });
            }
        }

        // Delete grammar test
            async deleteListeningTest(req, res) {
                try {
                await ListeningTestService.delete(req.params.id);
                res.status(200).json({ message: 'Listening Test deleted successfully' });
                } catch (error) {
                res.status(500).json({ message: 'Error deleting Listening Test', error });
                }
            }
            async getAllListeningTests(req, res) {
                try {
                  const grammars = await ListeningTestService.getAll();
                  res.status(200).json({ message: 'Listening Tests fetched successfully', data: grammars });
                } catch (error) {
                  res.status(500).json({ message: 'Error fetching Listening Tests', error });
                }
            }
            


}




module.exports = new ListeningTestController()