const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Content = require('../models/Content');
const Review = require('../models/Review');
const request = require("supertest");
const expect = require("chai").expect;
const app = require("../server");

describe("/api/v1/review ", () => {
    beforeEach(async () => {
    await User.deleteMany({});
        await Course.deleteMany({});

        let instructor1 = {
            name: "testInstructor",
            email: "testinstructor@gmail.com",
            role: "instructor",
            password: "123456"
        };

        let user2 = {
            name: "testUser",
            email: "testuser@gmail.com",
            role: "user",
            password: "123456"
        }

        let user3 = {
            name: "testUser2",
            email: "testuser3@gmail.com",
            role: "user",
            password: "123456"
        }

        await User.create(instructor1, user2, user3);
        console.log('users created');

        const instructorLogined = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: "testinstructor@gmail.com", password: "123456" })
            .expect(200);

        const user2Logined = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: "testuser@gmail.com", password: "123456" })
            .expect(200);
        
        const user3Logined = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: "testuser3@gmail.com", password: "123456" })
            .expect(200);

        console.log('users and instructor logined');


        const courseRes = await request(app)
            .post('/api/v1/course/create')
            .set('Authorization', `Bearer ${instructorLogined.body.token}`)
            .send({ name: "test course", description: "this is  test course"})
            .expect(201);
        console.log('course created');

        const reviewRes = await request(app)
            .post(`/api/v1/course/${courseRes.body.data._id}/review`)
            .set('Authorization', `Bearer ${user2Logined.body.token}`)
            .send({ text: "test review1", rating: '5'})
            .expect(201);
        console.log('review created');

        request.instructorToken = instructorLogined.body.token;
        request.user2Token = user2Logined.body.token;
        request.user3Token = user3Logined.body.token;
        request.courseId = courseRes.body.data._id;
        request.reviewId = reviewRes.body.data._id;
    })

    // POST /api/v1/course/:courseId/review
    describe("POST /", () => {
        it("[Success] create a review", async () => {
            const res = await request(app)
                    .post(`/api/v1/course/${request.courseId}/review`)
                    .set('Authorization', `Bearer ${request.user3Token}`)
                    .send({ text: "test review1", rating: '5'})
                    .expect(201);
            console.log(res.body);
        })

        it("[Fail] each user can create 1 review per course", async () => {
            const res = await request(app)
                .post(`/api/v1/course/${request.courseId}/review`)
                .set('Authorization', `Bearer ${request.user2Token}`)
                .send({ text: "test review1", rating: '5'});
            expect(res.status).to.be.equal(409);
        })

        it("[Fail] only user can create review", async () => {
            const res = await request(app)
                .post(`/api/v1/course/${request.courseId}/review`)
                .set('Authorization', `Bearer ${request.instructorToken}`)
                .send({ text: "test review2", rating: '5'})
                .expect(403);
        })
        // need more test and functionality. +only registered user can review.
    })

    describe("GET /", () => {
        it("[Success] get reviews", async () => {
            const res = await request(app)
                .get(`/api/v1/course/${request.courseId}/reviews`)
                .expect(200);
            console.log(res.body);
        })
    })

    describe("GET /:id", () => {
        it("[Success] get a review", async () => {
            const res = await request(app)
                .get(`/api/v1/review/${request.reviewId}`)
                .expect(200);
            console.log(res.body);
        })
    })

    describe("PUT /:id", () => {
        it("[Success] update a review", async () => {
            const res = await request(app)
                .put(`/api/v1/review/${request.reviewId}`)
                .set('Authorization', `Bearer ${request.user2Token}`)
                .send({ text: "text changed"})
                .expect(200);
            expect(res.body.data.text).to.be.equal("text changed")
        })
        
        it("[Fail] only owner of this review can update", async () => {
            const res = await request(app)
                .put(`/api/v1/review/${request.reviewId}`)
                .set('Authorization', `Bearer ${request.user3Token}`)
                .send({ text: "text changed"})
                .expect(401);
        })
    })
    
    describe("DELETE /:id", () => {
        it("[Success] delete a review", async () => {
            const res = await request(app)
                .delete(`/api/v1/review/${request.reviewId}`)
                .set('Authorization', `Bearer ${request.user2Token}`)
                .expect(200);
            console.log(res.body);
        })
    })
})