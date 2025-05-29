const userModel = require('../models/auth.model');
const bcrypt = require('bcrypt');
const tokenService = require('./token.service');
const UserDto = require('../dtos/user.dto');
const mongoose = require("mongoose");
const BaseError = require('../errors/base.error');

class AuthService {

    // 1. Barcha foydalanuvchilarni olish
    async getAll() {
        try {
            const allStudents = await userModel.find();
            if (!allStudents || allStudents.length === 0) {
                return []; // Bo'sh massiv qaytadi
            }
            return allStudents;
        } catch (error) {
            console.error("Foydalanuvchilarni olishda xatolik:", error);
            throw new Error("Foydalanuvchilarni olishda muammo yuz berdi");
        }
    }

    // 2. Foydalanuvchini ro'yxatdan o'tkazish
    async register(email, password, fullname) {
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            throw BaseError.BadRequest(`User with email ${email} is already registered`);
        }
    
        const existFullname = await userModel.findOne({ fullname });
        if (existFullname) {
            throw BaseError.BadRequest(`User with fullname ${fullname} is already taken`);
        }
    
        const hashPassword = await bcrypt.hash(password, 10); // Parolni xesh qilish
    
        const newUser = await userModel.create({
            email,
            password: hashPassword,
            fullname,
            skills: { reading: 0, listening: 0, writing: 0, speaking: 0 }
        });
    
        const userDto = new UserDto(newUser);
        const tokens = tokenService.generateToken({ ...userDto });
    
        await tokenService.saveToken(newUser.id, tokens.refreshToken); // Tokenni saqlash
    
        return { user: userDto, ...tokens };
    }

    // 3. Foydalanuvchini aktivlashtirish
    async activation(userId) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw BaseError.BadRequest('User not found');
        }

        user.isActivated = true;
        await user.save();
        
        return user;
    }

    // 4. Foydalanuvchini tahrirlash
    async edit(userId, updateData) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw BaseError.BadRequest("User not found");
        }

        Object.assign(user, updateData); // Foydalanuvchini yangilash (ism, email, parol va h.k.)
        await user.save();
        
        return user;
    }

    // 5. Foydalanuvchini tizimga kirishini tekshirish
    async login(email, password) {
        const user = await userModel.findOne({ email });
        if (!user) {
            throw BaseError.BadRequest('User not found');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw BaseError.BadRequest('Incorrect password');
        }
    
        const userDto = new UserDto(user); // User DTO yaratish
        const tokens = tokenService.generateToken({ ...userDto });
    
        await tokenService.saveToken(user.id, tokens.refreshToken); // Tokenni saqlash
    
        return { user: userDto, ...tokens };
    }

    // 6. Tizimdan chiqish
    async logout(refreshToken) {
        if (!refreshToken) {
            throw BaseError.BadRequest('No refresh token provided');
        }

        await tokenService.removeToken(refreshToken); // Tokenni o'chirish
        return { message: "Logged out successfully" };
    }

    // 7. Foydalanuvchining profilini olish
    async getProfile(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw BaseError.BadRequest("Invalid user ID format");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw BaseError.BadRequest("User not found");
        }
        return user;
    }

    // 8. Foydalanuvchining ingliz tili skillarini yangilash
    async updateSkill(reading, listening, writing, speaking, userId) {
        const student = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "skills.reading": reading,
                    "skills.listening": listening,
                    "skills.writing": writing,
                    "skills.speaking": speaking
                }
            },
            { new: true } // Yangilangan studentni qaytarish
        );

        if (!student) {
            throw BaseError.BadRequest("Student not found!");
        }

        return student;
    }
    

    // 9. Leaderboard (Yetakchilar ro'yhati)
    async getLeaderboard() {
        const users = await userModel.find();

        const sortedUsers = users
            .map((user) => {
            const totalScore =
                user.skills.reading +
                user.skills.listening +
                user.skills.writing +
                user.skills.speaking;

            return {
                id: user._id,
                fullname: user.fullname,
                skills: user.skills,
                totalScore,
            };
            })
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10); // Faqat eng yuqori 10 ta foydalanuvchini olish

        return sortedUsers;
    }

    // 10. Foydalanuvchini o'chirish
    async delete(id) {
        return userModel.findByIdAndDelete(id);
    }
    async updateReadingTest(userId, score, correctAnswers, incorrectAnswers, answers) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw BaseError.BadRequest("User not found");
        }

        const readingTest = user.tests.readingTest;
        readingTest.totalScore += score;
        readingTest.correctAnswers += correctAnswers;
        readingTest.incorrectAnswers += incorrectAnswers;

        // Historyga testni qo'shish
        readingTest.testHistory.push({
            score,
            date: new Date(),
            answers: answers.map((answer) => ({
                question: answer.question,
                correctAnswer: answer.correctAnswer,
                userAnswer: answer.userAnswer,
                isCorrect: answer.isCorrect
            }))
        });

        await user.save();
        return user;
    }

    // 2. Vocabulary test natijalarini yangilash
    async updateVocabTest(userId, score, correctAnswers, incorrectAnswers, answers) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw BaseError.BadRequest("User not found");
        }

        const vocabTest = user.tests.vocabTest;
        vocabTest.totalScore += score;
        vocabTest.correctAnswers += correctAnswers;
        vocabTest.incorrectAnswers += incorrectAnswers;

        // Historyga testni qo'shish
        vocabTest.testHistory.push({
            score,
            date: new Date(),
            answers: answers.map((answer) => ({
                word: answer.word,
                correctTranslation: answer.correctTranslation,
                userTranslation: answer.userTranslation,
                isCorrect: answer.isCorrect
            }))
        });

        await user.save();
        return user;
    }

    // 3. Writing test natijalarini yangilash
    async updateWritingTest(userId, score, correctAnswers, incorrectAnswers, userAnswer) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw BaseError.BadRequest("User not found");
        }

        const writingTest = user.tests.writingTest;
        writingTest.totalScore += score;
        writingTest.correctAnswers += correctAnswers;
        writingTest.incorrectAnswers += incorrectAnswers;

        // Historyga testni qo'shish
        writingTest.testHistory.push({
            score,
            date: new Date(),
            userAnswer,
            isCorrect: score > 0 // Assuming score > 0 means the answer is correct
        });

        await user.save();
        return user;
    }

    // 4. Speaking test natijalarini yangilash
    async updateSpeakingTest(userId, score, correctAnswers, incorrectAnswers, userAnswer) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw BaseError.BadRequest("User not found");
        }

        const speakingTest = user.tests.speakingTest;
        speakingTest.totalScore += score;
        speakingTest.correctAnswers += correctAnswers;
        speakingTest.incorrectAnswers += incorrectAnswers;

        // Historyga testni qo'shish
        speakingTest.testHistory.push({
            score,
            date: new Date(),
            userAnswer,
            isCorrect: score > 0 // Assuming score > 0 means the answer is correct
        });

        await user.save();
        return user;
    }
}

module.exports = new AuthService();
