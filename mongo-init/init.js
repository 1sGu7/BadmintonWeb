db = db.getSiblingDB('badminton-shop');

// Tạo user cho ứng dụng
db.createUser({
  user: 'shop_user',
  pwd: 'shop_password',
  roles: [{
    role: 'readWrite',
    db: 'badminton-shop'
  }]
});

// Tạo collection products
db.createCollection('products');