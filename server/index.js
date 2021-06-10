const Koa = require('koa');
const server = new Koa();
const PORT = 3002;

let DB = require('./data.json')
let COMMENTS = require('./comments.json')

const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');//правила доступа к серверу
const serve = require('koa-static');//библиотека для открытия области видимости файлов
const router = new Router();

const fs = require('fs');

server.use(serve('./category'));//открытие доступа к картинкам в папке категорий
server.use(serve('./products'));

server.use(
  cors({
    origin: '*',
    allowHeaders: 'X-Requested-With, Content-Type, Origin',
    credentials: true,
  }),
);

server.use(bodyParser());//для отображения информации в теле запроса к серверу
server.use(router.routes());//подключение для получения путей path in Router

//category list
router.get('/category',(ctx) => {
  const category = DB.products.reduce((arr,category) => {
    arr.push({ id: category.id,title:category.category_title, path: category.category_path,pictchure: category.category_picture})
    return arr
  },[]);
  ctx.response.body = category; // тело ответа

})

router.get('/products',(ctx) => {
  const products = DB.products.reduce((productList,category) => {
    productList = [...productList,...category.items];
    return productList
  }, [] )
  ctx.response.body = products;
})

// list items by category
router.get('/category/:categoryTitle',(ctx) => {
  const products = DB.products.find(category => category.category_path === ctx.params.categoryTitle)
    ctx.response.body = products.items; // тело ответа
})

router.post('/history', (ctx) => {
  const { id } = ctx.request.body;
  let index = 0;
  let findUser = false;
  for(let i = 0; i < DB.buy_history.length; i++) {
    if(DB.buy_history[i].user_id === id) {
      index = i;
      findUser = true;
    }
  }
  if(findUser && DB.buy_history[index].buy_history.length != 0) {
    ctx.body = DB.buy_history[index].buy_history;
  } else {
    ctx.body = null;
  }
})

router.get('/fillters/:fillterCategory',(ctx) => {
  const  fillters  = DB.products.reduce((filltersArr, category) => {
    if(category.category_path == ctx.params.fillterCategory) {
      filltersArr = [...category.fillters];
    }
    return filltersArr;
  }, [])
  //const products = DB.products.find(fillter => category.category_path === ctx.params.fillterCategory)
    ctx.response.body = fillters;//products.items; // тело ответа
})

router.post('/auth', (ctx) => {

  //регистрация)), требуется дписать проверки входящего объекта
  let { users } = DB;
  let { action, phone, password} = ctx.request.body;
  let findUser = null;
  let haveUser = false;
  for(let i = 0; i < users.length; i++)  {
    if(users[i].phone == phone) {
      haveUser = true;
      findUser = users[i];
      break
    }
  } 
  if(haveUser && action === "signIn" && findUser.password === password) {
    ctx.body = {login: true, answer: {...findUser}};
  }
  if(haveUser && action === "signIn" && findUser.password !== password) {
    ctx.body = {login: false, answer: "Введён не верный пароль"}
  }
  if(haveUser === false && action === "signIn") {
    ctx.body = {logiin: false, answer: "Такого пользователя не найдено, зарегистрируйтесь"}
  }
  if(haveUser && action === "registry") { 
    ctx.body = "Пользователь уже существует";
  } 
  if(haveUser === false && action === "registry") {
    let { phone, password, name, surname, email } = ctx.request.body;
    const correctPass = /^[A-Z]+[a-z]+[0-9]+/g.test(password);
    if(phone && password && name && surname && email) {
      if(phone.length !== 13 || phone[0] !== '+') {
        ctx.body = "неправильно введён номер телефона"
      }
      if(!correctPass) {
        ctx.body = "Пароль должен содержать цифры, заглавные и строчные буквы"
      }
      if(correctPass && phone.length === 13 && phone[0] === '+') {
        let newUser = { id: users.length, phone, password, name, surname, email,  role: 'user' };
        users.push(newUser);
        ctx.body = 'Регистрация завершена, теперь войдите в систему';
        fs.writeFileSync('data.json', JSON.stringify(DB, null, '\t'));// такая формулировка json оставляет читаемый вид файла
      }
    } else {
      ctx.body = "Не все поля заполнены";
    }
  }
})

router.post('/buyItem', (ctx) => {
  const {id, products, date, total_price, delivery, adress_delivery} = ctx.request.body;
  //const userBasketCount = DB.buy_history
  let findUserBasketIndex = 0; 
  let userHaveBasket = false;
  DB.buy_history.map((item,index) => {
    if(item.user_id === id && DB.buy_history.length > 0) {
      findUserBasketIndex = index ;
      userHaveBasket = true;
      console.log(findUserBasketIndex);
    }
  })
  if(userHaveBasket) {
    let newBasketItem = {
      id: DB.buy_history[findUserBasketIndex].buy_history.length,
      products,
      date, 
      total_price, 
      delivery, 
      adress_delivery
    }
    DB.buy_history[findUserBasketIndex].buy_history.push(newBasketItem);
    ctx.body = "данные получены";
    fs.writeFileSync('data.json', JSON.stringify(DB, null, '\t'));
  } else {
    let newUserBasket = {
      user_id: id,
      buy_history: [ 
        {
          id: 0,
          products,
          date, 
          total_price, 
          delivery, 
          adress_delivery 
        }
      ]
    }
    DB.buy_history.push(newUserBasket);
    ctx.body = "данные получены";
    fs.writeFileSync('data.json', JSON.stringify(DB, null, '\t'));
  }
 /* const userBasketItem = {
    user_id: id,
    buy_history: [
      
    ]
  }*/
})

//get comments for item

router.post('/getComments', (ctx) => {
  const {id, category} = ctx.request.body;
  const getComment = COMMENTS[category].reduce( (findComments, item) => {
    if(item.product_id === id){
      findComments.push(item)
    }
    return findComments
  }, [])
  ctx.body = getComment;
})

router.post('/sendComment', (ctx) => {
  const { product_category} = ctx.request.body;
  COMMENTS[product_category].unshift(ctx.request.body);
  fs.writeFileSync('comments.json', JSON.stringify(COMMENTS, null, '\t'));
  ctx.body = 'Комментарий добавлен';
})

// logger

server.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  });
  
  // x-response-time
  
  server.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });
  
  // response
server.use(async ctx => {
  ctx.body = 'SERVER RUN!!!';
});




server.listen(PORT, () => console.log(`server run ${PORT}`));