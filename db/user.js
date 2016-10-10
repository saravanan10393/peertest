var db = require('./schema/index');

module.exports = {
    register : function(data,callback){
        db.User.findOne({email : data.email},function(err,isExist){
            if(isExist){callback({error:true,message:'User already exists'}); return};
             var user = db.User(data);
            user.save(function(err,data){
                if(err){
                    callback({error:true});
                    return;
                }
                callback(data);
            });
        });
    },
    login : function(data, callback){
        db.User.findOne({email : data.email, password : data.password},function(err,data){
            if(err || !data){
                callback({error:true,message:'Invalid credential'});
                return;
            }
            callback(data);
        });
    },
    updateStatus : function(data){
        db.User.findOneAndUpdate({_id:data.id},{status : data.status},function(err,result){
            if(err){
                console.error('failed up update user status ',err);
            }else{
                console.log('user status updated to ',data.status);
            }
        });
    },
    getOnlineUsers : function(callback){
        db.User.find({status:true}, function(err,users){
            callback( users || []);
        });
    }
}