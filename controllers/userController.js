const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const userController = {
    createUser: async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = {
                username: req.body.username,
                password: hashedPassword,
                role: req.body.role,
            };

            User.create(newUser, (err) => {
                if (err) return res.status(500).json({ error: err });
                res.redirect('/users');
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    },
getUserById: (req, res) => {
    const userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err });
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        // renderiza uma view, tipo users/show.ejs
        res.render('users/show', { user });
    });
},

    getAllUsers: (req, res) => {
        User.getAll((err, users) => {
            if (err) return res.status(500).json({ error: err });
            res.render('users/index', { users });
        });
    },

    renderCreateForm: (req, res) => {
        res.render('users/create');
    },

    renderEditForm: (req, res) => {
        const userId = req.params.id;
        User.findById(userId, (err, user) => {
            if (err) return res.status(500).json({ error: err });
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
            res.render('users/edit', { user });
        });
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const updatedUser = {
                username: req.body.username,
                password: hashedPassword,
                role: req.body.role,
            };

            User.update(userId, updatedUser, (err) => {
                if (err) return res.status(500).json({ error: err });
                res.redirect('/users');
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    },

    deleteUser: (req, res) => {
        const userId = req.params.id;
        User.delete(userId, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.redirect('/users');
        });
    },
};

module.exports = userController;
