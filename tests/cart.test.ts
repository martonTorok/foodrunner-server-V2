import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
const serverURL = 'http://localhost:3000'

const testUserCredentials = {
    email: 'test123@test123.com',
    password: 'test123'
}
let token: string = null;

//get valid token for unit tests
before(function (done) {
    chai.request(serverURL)
        .post('/users/login')
        .send(testUserCredentials)
        .then(res => {
            token = res.body.token;
            done();
        });
})

//empty cart before unit tests
before(function (done) {
    chai.request(serverURL)
        .delete('/cart/empty')
        .set('x-auth', token)
        .then(res => {
            done();
        })
})

describe('GET /cart', () => {
    it('should return 200 status code is the user is logged in', (done) => {
        chai.request(serverURL)
            .get('/cart')
            .set('x-auth', token)
            .then(res => {
                expect(200);
                done();
            })
    })
})

describe('POST /add-to-cart/:id', () => {
    it('should add item (with id 1) to cart', (done) => {
        chai.request(serverURL)
            .post('/cart/add/1')
            .set('x-auth', token)
            .then(res => {
                expect(200)
                expect(res.body).to.have.property('totalQuantity', 1);
                expect(res.body).to.have.property('cartItems').with.length(1);
                done();
            })
    })
})

describe('POST /remove-from-cart/:id', () => {
    it('should remove 1 piece of cart item (with id 1) from cart', (done) => {
        chai.request(serverURL)
            .post('/cart/remove/1')
            .set('x-auth', token)
            .then(res => {
                expect(200)
                expect(res.body).to.have.property('totalQuantity', 0);
                expect(res.body).to.have.property('cartItems').with.length(0);
                done();
            })
    })
})
