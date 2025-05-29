module.exports = class AdminDto {
	username
	password

	constructor(model) {
		this.username = model.username
		this.id = model._id
		this.password = model.password
	}
}