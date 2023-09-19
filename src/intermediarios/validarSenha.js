const jwt = require('jsonwebtoken')
const pool = require('../conexao')
const senhaJwt = require('../senhacriptografadajwt')

const verificaLogin = async (req, res, next) => {
const { authorization } = req.headers