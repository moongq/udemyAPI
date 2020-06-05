const mongoose = require('mongoose');
const User = require('../models/User');
const request = require("supertest");
const expect = require("chai").expect;
const app = require("../server");

describe("api/v1/auth", () => {
    beforeEach(async() => {
        await User.deleteMany({});

        const user = { 
            email: "test5@gmail.com",
            name: "test",
            password: "123456",
            role: "user"
        };
        
        await User.create(user);

        const tem_res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: "test5@gmail.com",
                    password: "123456" })
            .expect(200);
        expect(tem_res.body).to.have.property("token");
        
        // We can use "request" to pass variable to it from beforeEach
        request.token = tem_res.body.token;
    });

// ----------
    describe("POST /", () => {
        // success register
        it("[Success] register/create a user", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "test",
                    email: "test@gmail.com",
                    password: "1234566",
                    role: "user"
                });
            expect(res.status).to.be.equal(200);
            expect(res.body).to.have.property("token");

        });

        it("[Fail] invalid input", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "test",
                    email: "testgmailcom", // wrong email
                    password: "1234455",
                    role: "user"
                });
            expect(res.status).to.be.equal(400);
            expect(res.body.error).to.be.equal('Invalid data inputed');
        });

        it("[Fail] duplicated error", async () => {
            const user = {
                name: "test", email: "test@gmail.com", password: "1234566", role: "user"
            };

            await User.insertMany(user);

            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "test",
                    email: "test@gmail.com",
                    password: "1234566",
                    role: "user"
                });
            expect(res.status).to.be.equal(409);
            expect(res.body.error).to.be.equal('Duplicate field value entered');
        });
    })

    describe("POST /login", async () => {
        it("[Success] login", async () => {
            const user = {
                name: "test", email: "test@gmail.com", password: "1234566", role: "user"
            };

            await User.create(user);

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "test@gmail.com",
                    password:"1234566"
            });
            expect(res.status).to.be.equal(200);
            expect(res.body).to.have.property("token");

        })

        it("[Fail] Incorrect email or passwrod", async () => {
            const user = {
                name: "test", email: "test@gmail.com", password: "1234566", role: "user"
            };

            await User.create(user);

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "test@gmail.com",
                    password: "1231231"
                });

            expect(res.status).to.be.equal(401);
            expect(res.body.error).to.be.equal('Invalid credentials');
        });
    });

    describe("GET /logout", async () => {
        it("[Success] logout", async () => {
            const user = {
                name: "test", email: "test@gmail.com", password: "1234566", role: "user"
            };
            await User.create(user);

            const res = await request(app)
                .get("/api/v1/auth/logout")
                .expect(200);
            
            // expect(res.status).to.be.equal(200);
            expect(res.body.token).to.be.equal('none');
    });
});

    describe("GET /getMe", async () => {                
        it("[Success] getMe", async () => {
            var token = request.token;
            
            const res = await request(app)
                .get('/api/v1/auth/getMe')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });

        it("[Fail] passed wrong token", async () => {
            var token = request.token;
            const res = await request(app)
                .get("/api/v1/auth/getMe")
                .set('authorization', `Bearer ${token}plusSomeString`)
                .expect(401);
        });
    });
// -------------------
    describe("POST /updateDetail", async () => {
        it("[Success] updated input datas", async () => {
            token = request.token;

            const changingData = {
                name: "changeName"
            };

            const res = await request(app)
                .put('/api/v1/auth/updateDetails')
                .set('Authorization', `Bearer ${token}`)
                .send(changingData)
                .expect(200);

            expect(res.body).to.have.property('name');
            expect(res.body.name).to.be.equal('changeName');
        });
    })
})