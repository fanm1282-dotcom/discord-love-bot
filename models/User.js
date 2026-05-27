const mongoose =
  require('mongoose');

const userSchema =
  new mongoose.Schema({

    // 👤 user
    userId: {

      type: String,

      required: true,

      unique: true

    },

    // 💰 เงินหลัก
    money: {

      type: Number,

      default: 1000

    },

    // =========================
    // 🎁 DAILY
    // =========================

    lastDaily: {

      type: Number,

      default: 0

    },

    // =========================
    // 💼 WORK
    // =========================

    workLevel: {

      type: Number,

      default: 1

    },

    workXp: {

      type: Number,

      default: 0

    },

    lastWork: {

      type: Number,

      default: 0

    },

    // =========================
    // 🎰 CASINO
    // =========================

    // 🎮 เล่นทั้งหมด
    casinoPlayed: {

      type: Number,

      default: 0

    },

    // 🎉 ชนะ
    casinoWin: {

      type: Number,

      default: 0

    },

    // 💀 แพ้
    casinoLose: {

      type: Number,

      default: 0

    },

    // =========================
    // 🔥 STREAK
    // =========================

    // 👑 ชนะติด
    winStreak: {

      type: Number,

      default: 0

    },

    // ☠️ แพ้ติด
    loseStreak: {

      type: Number,

      default: 0

    },

    // =========================
    // 💰 MONEY STATS
    // =========================

    // 💸 เดิมพันรวม
    totalBet: {

      type: Number,

      default: 0

    },

    // 🎉 เงินชนะรวม
    totalWin: {

      type: Number,

      default: 0

    },

    // 💀 เงินเสียรวม
    totalLose: {

      type: Number,

      default: 0

    },

    // =========================
    // 🏆 RECORD
    // =========================

    // 👑 ชนะสูงสุด
    biggestWin: {

      type: Number,

      default: 0

    },

    // ☠️ แพ้สูงสุด
    biggestLose: {

      type: Number,

      default: 0

    },

    // =========================
    // 👑 CASINO RANK
    // =========================

    casinoRank: {

      type: String,

      default: '🪙 มือใหม่'

    },

    // =========================
    // 🌌 SPECIAL
    // =========================

    // 🔥 high roller
    highRollerPlayed: {

      type: Number,

      default: 0

    },

    // 👑 jackpot
    jackpotWin: {

      type: Number,

      default: 0

    },

    // 😈 ไพ่ปีศาจ
    demonWin: {

      type: Number,

      default: 0

    }

  });

module.exports =

  mongoose.model(
    'User',
    userSchema
  );
