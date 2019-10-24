module.exports = {
  dialect: 'postgres',
  host: '10.8.0.10',
  port: '5431',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
