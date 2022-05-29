const { ApolloError } = require("apollo-server-express");
const Validator = require("./validator");
const yup = require('yup');

class UserValidator extends Validator {
    constructor(dbRepository) {
        super()
        this.dbRepository = dbRepository;
    }

    async validateCreateUser({ user }) {
        try {
            const schema = yup.object().shape({
                name: yup.string().required().min(4).max(100),
                email: yup.string().required().email(),
                birthDay: yup.string().required().test("testDate", "Invalid date.", function (birthDate) {
                    const date = new Date(birthDate);
                    const currentDate = new Date();
                    if (date > currentDate) this.createError({
                        message: "Birth date can not be the future.",
                        path: "birthDay",
                    });
                    return true;
                })
            });
            await this.validateYupSchema(schema, { ...user });
        } catch (error) {
            throw new ApolloError(error, 406);
        }
    }

    async validateGetUsers({ limit, skip }) {
        try {
            const schema = yup.object().shape({
                limit: yup.number().required().min(1).max(100),
                skip: yup.number(),
            });
            await this.validateYupSchema(schema, { limit, skip });
        } catch (error) {
            throw new ApolloError(error, 406);
        }
    }
}

module.exports = UserValidator;