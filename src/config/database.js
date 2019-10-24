module.exports = {
    dialect: 'postgres',
    host: '10.8.0.10',
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
    define:
    {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};