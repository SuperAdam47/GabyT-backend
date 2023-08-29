module.exports = (cfg) => {
    const { Sequelize, Op } = require('sequelize')

    const sequelize = new Sequelize(cfg.dbName, cfg.dbUser, cfg.dbPwd, {
        host: cfg.dbHost,
        dialect: cfg.dbDialect,
        logging: false,
        raw: true,
        dialectOptions: {
            warnings: false
          }
    })

    const users = sequelize.define('users', {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING(96)
        },
        email: {
            type: Sequelize.STRING(96),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(128)
        },
        "2FATempPwd": {
            type: Sequelize.STRING(6)
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
            type: Sequelize.INTEGER
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
            type: Sequelize.STRING(256)
        },
        title: {
            type: Sequelize.STRING(96)
        },
        avatar: {
            type: Sequelize.STRING(256)
        },
        companyName: {
            type: Sequelize.STRING(96)
        },
        role: {
            type: Sequelize.STRING(24)
        },
        address: {
            type: Sequelize.STRING(256)
        },
        city: {
            type: Sequelize.STRING(256)
        },
        state: {
            type: Sequelize.STRING(11)
        },
        zip: {
            type: Sequelize.STRING(11)
        },
        country: {
            type: Sequelize.STRING(11)
        },
        telnumber: {
            type: Sequelize.STRING(11)
        },
        about: {
            type: Sequelize.TEXT
        },
        notif_optin: {
            type: Sequelize.INTEGER
        },
        plan: {
            type: Sequelize.STRING(10)
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