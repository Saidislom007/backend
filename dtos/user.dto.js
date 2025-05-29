module.exports = class UserDto {
	email
	id
	isActivated
	skills
	fullname

	constructor(model) {
		this.email = model.email
		this.id = model._id
		this.isActivated = model.isActivated
		this.skills = model.skills
		this.fullname = model.fullname
	}
}