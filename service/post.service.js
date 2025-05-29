const postModel = require('../models/post.model')


class PostService {
	async create(post){
		const newPost = await postModel.create(post)
		return newPost
	}
	async getAll(){
		const allpost = await postModel.find()
		return allpost
	}
	
	async delete(id){
		const post = await postModel.findByIdAndDelete(id)
		return post
	}
	async edit(post,id){
		if(!id){
			throw new Error('Id not Found')
		}else{
			const post = await postModel.findByIdAndUpdate(id,post,{new:true})
			return post
		}

	}
}

module.exports = new PostService()