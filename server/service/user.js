var bcrypt = require('bcrypt');

var db = require('../data/db');

exports.get = function(account, next){
	if(!account){
		next(new Error('Missing parameter account'));
		return;
	}

	db.User.findOne({'account': account}, function(err, user){	
		if(err) {
			next(err);
			return;
		}

		if(user == null){
			next(null,null);
			return;
		}	
		next(null, user);
	});
};


exports.list = function(next){
	db.User.find({}, function(err, users){
		if(err){
			next(err);
			return;
		}
		next(null, users);
	});
}


exports.create = function(userObj, next){
	if(!userObj){
		next(new Error('Missing parameter userObj'));
		return;
	}

	var user = new db.User();
	user.account = userObj.account;

	//Hash password with bcrypt
	bcrypt.genSalt(10, function(err, salt) {
		if(err){
			next(err);
			return;
		}

	  bcrypt.hash(userObj.password, salt, function(err, hash) {
	  	if(err){
	  		next(err);
	  		return;
	  	}

     	user.password = hash;
     	user.save(function(err){
				if(err){
					next(err);
					return;
				}
				next(null, user);
			});
	  });
	});
}


exports.delete = function(user, next){
	if(!user){
		next(new Error('Missing parameter user'));
		return;
	}

	db.User.remove({'account': user.account}, function(err){
		if(err){
			next(err);
			return;
		}

		next(null, user);
	});
}


exports.clean = function(next){
	db.AdminRole.remove({}, function(err){
		if(err){
			next(err);
			return;
		}
		db.DeveloperRole.remove({}, function(err){
			if(err){
				next(err);
				return;
			}
			db.User.remove({}, function(err){
				if(err){
					next(err);
					return;
				}
				next();
			});
		});
	});
}


exports.assignToAdmin = function(user, next){
	if(!user){
		next(new Error('Missing parameter user'));
		return;
	}

	var admin = new db.AdminRole();
	admin.user = user;
	admin.save(function(err){
		if(err){
			next(err);
			return;
		} 

		next(null, user);
	});
};


exports.revokeFromAdmin = function(req, res, next){
	if(!user){
		next(new Error('Missing parameter user'));
		return;
	}

	db.AdminRole.remove({'user': user}, function(err){
		if(err){
			next(err);
			return;
		}

		next(null, user);
	});
}