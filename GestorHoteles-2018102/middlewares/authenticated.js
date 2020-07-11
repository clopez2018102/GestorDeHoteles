'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'CONTRA456';
var keyh = 'CONTRA123';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Petición sin autenticación'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try{
            var payload = jwt.decode(token, key);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'});
            }
        }catch(ex){
            return res.status(404).send({message: 'Token no valido'})
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Petición sin autenticación'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try{
            var payload = jwt.decode(token, key);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'});
            }else if(payload.role != 'ADMIN'){
                return res.status(401).send({message: 'No tienes permiso para esta ruta'});
            }
        }catch(ex){
            return res.status(404).send({message: 'Token no valido'})
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthHotel = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Petición sin autenticación'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try{
            var payload = jwt.decode(token, keyh);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'});
            }if(!payload.num){
                return res.status(401).send({message: 'No tienes permiso para esta ruta'});  
            }
        }catch(ex){
            return res.status(404).send({message: 'Token no valido, sin permiso para esta ruta'})
        }

        req.hotel = payload;
        next();
    }
}
