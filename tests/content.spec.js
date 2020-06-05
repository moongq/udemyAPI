const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Content = require('../models/Content');
const request = require("supertest");
const expect = require("chai").expect;
const app = require("../server");

describe('/api/v1/content', () => {
    beforeEach(async () => {
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
            role: "instructor",
            password: "123456"
        }

        await User.create(user1);
        await User.create(user2);

        console.log('user created');

        const courseOwnerRes = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: "test1@gmail.com", password: "123456" })
            .expect(200);

        token = courseOwnerRes.body.token;

        const notOwnerRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: "test2@gmail.com", password: "123456" })
        .expect(200);



        const courseRes = await request(app)
            .post('/api/v1/course/create')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: "course1", description: "desc course1"})
            .expect(201);

        console.log('course created');

        request.token = token;
        request.courseId = courseRes.body.data._id;
        request.notOnwerToken = notOwnerRes.body.token;
        
    })
    // POST /api/v1/course/:courseId/content
    describe("POST /", () => {
        it("[Sucess] create content", async () => {
            // request.body.course = request.courseId;
            
            const res = await request(app)
                .post(`/api/v1/course/${request.courseId}/content`)
                .set('Authorization', `Bearer ${request.token}`)
                .send({ title: "content1", description: "this is content1" })
                .expect(201);
            
        })   

        it("[Fail] only owner of course can make content", async () => {
            await request(app)
                .post(`/api/v1/course/${request.courseId}/content`)
                .set('Authorization', `Bearer ${request.notOnwerToken}`)
                .send({ title: "content111111111111111", description: "this is content2"})
                .expect(401);
        
            })
    })
    
    
    describe("GET /", () => {
        // GET /api/v1/course/:courseId/contents
        it("[Success] get contents relating this Course",  async () => {
            const res = await request(app)
                .post(`/api/v1/course/${request.courseId}/content`)
                .set('Authorization', `Bearer ${request.token}`)
                .send({ title: "content1", description: "this is content1" })
                .expect(201);
            console.log(res.body);
            
            const contentsRes = await request(app)
                .get(`/api/v1/course/${request.courseId}/contents`)
                .expect(200);
            console.log(contentsRes.body);
            
        })
        // GET /api/v1/content/:id
        it("[Success] get a content detail", async () => {
            const createContentRes = await request(app)
                .post(`/api/v1/course/${request.courseId}/content`)
                .set('Authorization', `Bearer ${request.token}`)
                .send({ title: "content2", description: "this is content2" })
                .expect(201);

            request.contentId = createContentRes.body.data._id;

            const contentRes = await request(app)
                .get(`/api/v1/content/${request.contentId}`)
                .expect(200);
            console.log(contentRes.body);
        })
    })
    describe("PUT /", () => {
        it("[Success] update a content", async () => {
            const createContentRes = await request(app)
                .post(`/api/v1/course/${request.courseId}/content`)
                .set('Authorization', `Bearer ${request.token}`)
                .send({ title: "content2", description: "this is content2" })
                .expect(201);
            
            request.contentId = createContentRes.body.data._id;
            console.log(createContentRes.body);

            const res = await request(app)
                .put(`/api/v1/content/${request.contentId}`)
                .set('Authorization', `Bearer ${request.token}`)
                .send({ title: "changedTitle", description: "this is content2" })
                .expect(200);
            expect(res.body.data.title).to.be.equal("changedTitle");
        })
    })

    describe("DELETE /", () => {
        it("[Success] delete a content", async () => {
            const createContentRes = await request(app)
                .post(`/api/v1/course/${request.courseId}/content`)
                .set('Authorization', `Bearer ${request.token}`)
                .send({ title: "content2", description: "this is content2" })
                .expect(201);
            
            request.contentId = createContentRes.body.data._id;

            const res = await request(app)
                .delete(`/api/v1/content/${request.contentId}`)
                .set('Authorization', `Bearer ${request.token}`)
                .expect(200);

        })
    })
})