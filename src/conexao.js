const { Pool } = require('pg')

const pool = new Pool({
host: 'localhost',
port: 5433,//larissa usando 5433 - MAS PORTA PADRAO É 5432
user: 'postgres',
password: 'batatinha', //senhaLarissa: batatinha
database: 'dindin', 
})

module.exports = pool