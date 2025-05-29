const AuthService = require('../service/auth.service');
const BaseError = require('../errors/base.error');

class AuthController {

    // 1. Foydalanuvchini ro'yxatdan o'tkazish
    async register(req, res, next) {
        try {
            const { email, password, fullname } = req.body;
            const userData = await AuthService.register(email, password, fullname);

            // Refresh tokenni cookie-ga saqlash
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 kun
            });

            res.status(201).json(userData);
        } catch (error) {
            next(error); // Xatoni error-handling middleware'ga uzatish
        }
    }

    // 2. Barcha foydalanuvchilarni olish
    async getAll(req, res, next) {
        try {
            const allStudents = await AuthService.getAll();

            if (!allStudents || allStudents.length === 0) {
                return res.status(404).json({ message: "No students found" });
            }

            res.status(200).json(allStudents);
        } catch (error) {
            next(error); // Xatoni error-handling middleware'ga uzatish
        }
    }

    // 3. Foydalanuvchini tahrirlash
    async edit(req, res, next) {
        try {
            const userId = req.params.id;
            const { fullname, email, password } = req.body;

            const updatedUser = await AuthService.edit(userId, { fullname, email, password });

            return res.json({ message: "User updated successfully", user: updatedUser });
        } catch (error) {
            next(error); // Xatoni error-handling middleware'ga uzatish
        }
    }

    // 4. Foydalanuvchini aktivlashtirish
    async activation(req, res, next) {
        try {
            const userId = req.params.id;
            await AuthService.activation(userId);
            return res.json({ message: "User is activated" });
        } catch (error) {
            next(error); // Xatoni error-handling middleware'ga uzatish
        }
    }

    // 5. Foydalanuvchini tizimga kirishini tekshirish
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await AuthService.login(email, password);

            // Refresh tokenni cookie-ga saqlash
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 kun
            });

            return res.json(userData);
        } catch (error) {
            next(error); // Xatoni error-handling middleware'ga uzatish
        }
    }

    // 6. Foydalanuvchining profilini olish
    async getProfile(req, res, next) {
        try {
            const userId = req.params.id;

            const student = await AuthService.getProfile(userId);

            if (!student) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(student);
        } catch (error) {
            next(error); // Xatoni error-handling middleware'ga uzatish
        }
    }

    // 7. Foydalanuvchining ingliz tili skilllarini yangilash
    async updateSkills(req, res, next) {
        try {
            const { reading, listening, writing, speaking } = req.body;
            const userId = req.params.id;

            const student = await AuthService.updateSkill(reading, listening, writing, speaking, userId);

            res.json(student);
        } catch (error) {
            next(error); // Xatoni error-handling middleware'ga uzatish
        }
    }

    // 8. Tizimdan chiqish
    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(400).json({ message: "Refresh token not provided" });
            }

            const result = await AuthService.logout(refreshToken);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // 9. Leaderboardni olish
    async getLeaderboard(req, res, next) {
        try {
            const leaderboard = await AuthService.getLeaderboard();
            res.json(leaderboard);
        } catch (error) {
            console.error("Leaderboard controller error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // 10. Foydalanuvchini o'chirish
    async delete(req, res, next) {
        try {
            const user = await AuthService.delete(req.params.id);
            res.status(201).json(user);
        } catch (error) {
            console.log("User is not deleted:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
    async updateReadingTest(req, res) {
        const { userId, score, correctAnswers, incorrectAnswers, answers } = req.body;
        try {
            const updatedUser = await AuthService.updateReadingTest(userId, score, correctAnswers, incorrectAnswers, answers);
            return res.json(updatedUser);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // 2. Vocabulary test natijalarini yangilash
    async updateVocabTest(req, res) {
        const { userId, score, correctAnswers, incorrectAnswers, answers } = req.body;
        try {
            const updatedUser = await AuthService.updateVocabTest(userId, score, correctAnswers, incorrectAnswers, answers);
            return res.json(updatedUser);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // 3. Writing test natijalarini yangilash
    async updateWritingTest(req, res) {
        const { userId, score, correctAnswers, incorrectAnswers, userAnswer } = req.body;
        try {
            const updatedUser = await AuthService.updateWritingTest(userId, score, correctAnswers, incorrectAnswers, userAnswer);
            return res.json(updatedUser);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // 4. Speaking test natijalarini yangilash
    async updateSpeakingTest(req, res) {
        const { userId, score, correctAnswers, incorrectAnswers, userAnswer } = req.body;
        try {
            const updatedUser = await AuthService.updateSpeakingTest(userId, score, correctAnswers, incorrectAnswers, userAnswer);
            return res.json(updatedUser);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
