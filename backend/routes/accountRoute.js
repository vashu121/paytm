// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth')
const { Account } = require('../db');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        // Fetch account balance for the authenticated user
        const account = await Account.findOne({ userId: req.userId });
        if (account) {
            res.json({ balance: account.balance });
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;