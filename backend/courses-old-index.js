const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://danish:danish78@ds135798.mlab.com:35798/vidly',{useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('Connected ...'))
	.catch(err => console.log(err));
const courseSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true,
		minLength:5,
		maxLength:255,
		get: function(v){
			return v.toLowerCase();
		},
		trim:true
	},
	author: {
		type: String, 
		required: true
	},
	category:{
		type: String,
		enum: ['web', 'mobile', 'network', 'Database']
	},
	tags: {
		type: Array,
		validate:{
			validator: function(v){
				return v && v.length > 0;
			},
			message: "A course should have atleast one tag."
		}
	},
	price: {
		type:Number, 
		required:function(v){
			return this.isPublished
		},
		min:10,
		max: 200
	},
	date: { type: Date, default: Date.now() },
	isPublished: Boolean
},{
	toObject : {getters: true},
    toJSON : {getters: true}
})
const Course = mongoose.model('Course', courseSchema); 
async function createCourse(){
	const course = new Course({
		name: 'Mongoose db   ',
		category: 'web',
		author: 'Danish',
		tags: ['Angular','frontend'],
		isPublished: false
	});
	try{
		const result = await course.save();
		console.log(result);
	}catch(ex){
		for(field in ex.errors){
			console.log(ex.errors[field].message);
		}

	}
}
async function getCourses(){
	const course = await Course
		// .find({"price": {$gt: 10}})
		.find()
		.sort({name:-1})
		.select('name tags price')
	console.log(course)
}
async function updateCourse(id){
	// const course = await Course.findById({_id: '5f1ab8aaa201cf1150a492a9'});
	// course.author = 'Mosh';
	// const result = await course.save();
	// console.log(result);

	const course = await Course.findByIdAndUpdate(id,{
		$set: {
				author: 'Mosh'
			}
		},{new: true});
	//$result = course.save();
	console.log(course);
}
createCourse();
app.listen(3000,function(){
	console.log('app is running on port 3000')
});