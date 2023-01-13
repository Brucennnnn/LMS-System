"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssignment = exports.createCourseVideo = exports.updateAssignment = exports.updateCourseVideo = exports.updateDescCourse = exports.getDetailedDashboard = void 0;
const prisma_1 = require("../common/prisma");
const CourseValidator_1 = require("../common/CourseValidator");
const getDetailedDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(404).send({ message: "invalid ID" });
        return;
    }
    const course = yield prisma_1.prisma.course.findUnique({
        where: { id },
        include: {
            studentUser: true,
            assignment: true,
            courseVideo: true,
        },
    });
    if (course === null) {
        res.status(404).send({ message: "not found" });
        return;
    }
    const instructorDetailedDashboardDto = {
        students_in_course: course.studentUser.map((student) => ({
            first_name: student.first_name,
            last_name: student.last_name,
        })),
        videos_in_course: course.courseVideo.map((video) => ({
            id: video.id,
            name: video.name,
            video_url: video.video_url,
        })),
        assignments_in_course: course.assignment.map((assignment) => ({
            id: assignment.id,
            name: assignment.name,
            description: assignment.description,
            aj_file_url: assignment.aj_file_url,
            max_score: assignment.max_score,
        })),
        course_desc: course.course_desc,
        course_detail: course.course_detail,
    };
    res.status(200).json(instructorDetailedDashboardDto);
});
exports.getDetailedDashboard = getDetailedDashboard;
const updateDescCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const newCourseDto = req.body;
    const check = CourseValidator_1.updateDescCourseSchema.safeParse(newCourseDto);
    if (check.success) {
        const course = yield prisma_1.prisma.course.update({
            where: { id },
            data: {
                course_desc: newCourseDto.course_desc,
                course_detail: newCourseDto.course_detail,
            },
        });
        res.status(200).json(course);
    }
    else {
        res.status(400).json({ message: "something went wrong" });
    }
});
exports.updateDescCourse = updateDescCourse;
const updateCourseVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const newVideoDto = req.body;
    const check = CourseValidator_1.updateCourseVideoSchema.safeParse(newVideoDto);
    if (check.success) {
        const courseVideo = yield prisma_1.prisma.courseVideo.update({
            where: { id },
            data: {
                name: newVideoDto.name,
                video_url: newVideoDto.video_url,
            },
        });
        res.status(200).json(courseVideo);
    }
    else {
        res.status(400).json({ message: "something went wrong" });
    }
});
exports.updateCourseVideo = updateCourseVideo;
const updateAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const newAssignment = req.body;
    const check = CourseValidator_1.updateAssignmentSchema.safeParse(newAssignment);
    if (check.success) {
        const assignment = yield prisma_1.prisma.assignment.update({
            where: { id },
            data: {
                name: newAssignment.name,
                description: newAssignment.description,
                aj_file_url: newAssignment.aj_file_url,
                max_score: newAssignment.max_score,
            },
        });
        res.status(200).json(assignment);
    }
    else {
        res.status(400).json({ message: "something went wrong" });
    }
});
exports.updateAssignment = updateAssignment;
const createCourseVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseVideo = req.body;
    const check = CourseValidator_1.createCourseVideoSchema.safeParse(courseVideo);
    if (check.success) {
        try {
            const result = yield prisma_1.prisma.courseVideo.create({
                data: {
                    name: courseVideo.name,
                    video_url: courseVideo.video_url,
                    course_id: courseVideo.course_id,
                },
            });
            console.log(result);
            res.status(201).json(result);
        }
        catch (e) {
            console.log(e);
            res.status(400).json({ message: "something wents wrong" });
        }
    }
    else {
        res.status(400).json({ message: "something went wrong" });
    }
});
exports.createCourseVideo = createCourseVideo;
const createAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = req.body;
    const check = CourseValidator_1.createAssignmentSchema.safeParse(assignment);
    if (check.success) {
        try {
            const result = yield prisma_1.prisma.assignment.create({
                data: {
                    name: assignment.name,
                    description: assignment.description,
                    aj_file_url: assignment.aj_file_url,
                    max_score: assignment.max_score,
                    course_id: assignment.course_id,
                },
            });
            console.log(result);
            res.status(201).json(result);
        }
        catch (e) {
            console.log(e);
            res.status(400).json({ message: "something wents wrong" });
        }
    }
    else {
        res.status(400).json({ message: "something went wrong" });
    }
});
exports.createAssignment = createAssignment;
