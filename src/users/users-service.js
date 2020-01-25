const xss = require('xss')
const bcrypt = require('bcryptjs')

const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    hasUserWithUserName(db, user_name){
        return db('thingful_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },

    validatePassword(password){
        if(password.length < 8){
            return 'Password must be longer than eight characters.'
        }
        if(password.length > 72){
            return 'Password must be shorter than 72 characters.'
        }
        if(password[0] === " " || password[password.length - 1] === " "){
            return 'Password must not start or end with spaces.'
        }
        if(!regex.test(password)){
            return 'Password must contain one uppercase letter, one lowercase letter, one number, and one special character.'
        }
    },

    insertUser(db, newUser){
        return db
            .insert(newUser)
            .into('thingful_users')
            .returning('*')
            .then(([user]) => user)
    },

    hashPassword(password){
        return bcrypt.hash(password, 12)
    },
    serializeUser(user){
        return{
            id: user.id,
            full_name: xss(user.full_name),
            user_name: xss(user.user_name),
            nickname: xss(user.nick_name),
            date_created: new Date(user.date_created)
        }
    }
}

module.exports = UsersService