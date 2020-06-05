const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const request = require("supertest");
const expect = require("chai").expect;
const app = require("../server");
const jwt = require('jsonwebtoken');


describe("api/v1/auth", () => {
    beforeEach(async() => {
        await User.deleteMany({});
        await Course.deleteMany({});
        
        let user1 = {
            name: "test1",
            email: "test1@gmail.com",
            role: "instructor",
            password: "123456"
        };

        let user2 = {
            name: "test2",
            email: "test2@gmail.com",
            role: "user",
            password: "123456"
        }

        await User.create(user1, user2);

        const instructorRes = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: "test1@gmail.com", password: "123456" });
        
        const userRes = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: "test2@gmail.com", password: "123456" });
        
        request.instructorToken = instructorRes.body.token;
        request.userToken = userRes.body.token;
    });


    describe("POST /", () => {
        it("[Success] create a course", async () => {
            const token = request.instructorToken; 

            // It is req.body to be sent postCreateCourse
            const course = {
                name: "course1",
                description: "desc",
                // user: user.id
            }

            const res = await request(app)
                .post('/api/v1/course/create')
                .set('Authorization', `Bearer ${token}`)
                .send(course)
                .expect(201);      //
            expect(res.body.data.name).to.be.equal('course1');
        });

        it("[Fail] create a course", async () => {
            const token = request.userToken; 

            // It is req.body to be sent postCreateCourse
            const course = {
                name: "course2",
                description: "desc",
                // user: user.id
            }

            const res = await request(app)
                .post('/api/v1/course/create')
                .set('Authorization', `Bearer ${token}`)
                .send(course);
            expect(res.status).to.be.equal(403);
            expect(res.body.error).to.be.equal('only instructor can create course');
        });
    })

    describe("GET /", async () => {
        it("[Success] get course list", async () => {
            const token = request.instructorToken; 

            // It is req.body to be sent postCreateCourse
            const course = {
                name: "course1",
                description: "desc",
                // user: user.id
            }

            const createRes = await request(app)
                .post('/api/v1/course/create')
                .set('Authorization', `Bearer ${token}`)
                .send(course)
                .expect(201);
            
            const res = await request(app)
                .get("/api/v1/course");
            expect(res.status).to.be.equal(200);
            //console.log(res.body.data[0]._id);
        })
    })

    describe("GET /:id", async () => {
        it("[Success] get a course detail", async () => {
            const token = request.instructorToken; 

            // It is req.body to be sent postCreateCourse
            const course = {
                name: "course1",
                description: "desc",
                // user: user.id
            }

            const createRes = await request(app)
                .post('/api/v1/course/create')
                .set('Authorization', `Bearer ${token}`)
                .send(course)
                .expect(201);

            const id = createRes.body.data._id;
            
            const res = await request(app)
                .get(`/api/v1/course/${id}`);
            expect(res.status).to.be.equal(200);
            console.log(res.body);
        
        });
    })

    describe("PUT /:id", async() => {
        it("[Success] update a course", async () => {
            const token = request.instructorToken; 

            // It is req.body to be sent postCreateCourse
            const course = {
                name: "course1",
                description: "desc",
                // user: user.id
            }

            const createRes = await request(app)
                .post('/api/v1/course/create')
                .set('Authorization', `Bearer ${token}`)
                .send(course)
                .expect(201);
                        
            const id = createRes.body.data._id;
            const changingData = {
                name: "changedName"
            };

            const res = await request(app)
                .put('/api/v1/course/'+id)
                .set('Authorization', `Bearer ${token}`)
                .send(changingData);
            expect(res.status).to.be.equal(200);
        })
    })

    describe("DELETE /:id", async() => {
        it("[Success] delete a course", async () => {
            const token = request.instructorToken; 

            // It is req.body to be sent postCreateCourse
            const course = {
                name: "course1",
                description: "desc",
                // user: user.id
            }

            const createRes = await request(app)
                .post('/api/v1/course/create')
                .set('Authorization', `Bearer ${token}`)
                .send(course)
                .expect(201);
                        
            const id = createRes.body.data._id;

            const res = await request(app)
                .delete('/api/v1/course/'+id)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.be.equal(200);
        })
    })
}) 
