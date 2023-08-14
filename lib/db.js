module.exports = (cfg) => {
    const { Sequelize, Op } = require('sequelize')

    const sequelize = new Sequelize(cfg.dbName, cfg.dbUser, cfg.dbPwd, {
        host: cfg.dbHost,
        dialect: cfg.dbDialect,
        logging: false,
        raw: true
    })

    const users = sequelize.define('users', {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING(96),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(96),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(128),
            allowNull: false
        },
        "2FATempPwd": {
            type: Sequelize.STRING(6),
            allowNull: false
        },
        Timestamp: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        LastLogin: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: '0000-00-00 00:00:00'
        },
        blacklist: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'users',
        timestamps: false
    })

    const profiles = sequelize.define('userProfile', {
        ID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        title: {
            type: Sequelize.STRING(96),
            allowNull: false
        },
        avatar: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        companyName: {
            type: Sequelize.STRING(96),
            allowNull: false
        },
        role: {
            type: Sequelize.STRING(24),
            allowNull: false
        },
        address: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        city: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        state: {
            type: Sequelize.STRING(11),
            allowNull: false
        },
        zip: {
            type: Sequelize.STRING(11),
            allowNull: false
        },
        country: {
            type: Sequelize.STRING(11),
            allowNull: false
        },
        telnumber: {
            type: Sequelize.STRING(11),
            allowNull: false
        },
        about: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        notif_optin: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        plan: {
            type: Sequelize.STRING(10),
            allowNull: false
        }
    }, {
        tableName: 'userProfile',
        timestamps: false
    })

    const prompts = sequelize.define('gPrompts', {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        promptName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        persona: {
            type: Sequelize.TEXT
        },
        prompt: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        referencelink: {
            type: Sequelize.STRING
        },
        public: {
            type: Sequelize.INTEGER
        },
        active: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false
    })

    return {
        users, profiles, prompts,
        sync: () => sequelize.sync({ alter: true }), Op
    }
}