import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

class Swagger {
    constructor(){
        // Extended: https://swagger.io/specification/#infoObject
        const swaggerOptions = {
            swaggerDefinition: {
                openapi: "3.0.0",
                info: {
                    title: "Go Barber Document API",
                    version: "1.0.0",
                    description:
                      "API for system Go Barber",
                    license: {
                      name: "MIT",
                      url: "https://choosealicense.com/licenses/mit/"
                    },
                    contact: {
                      name: "GoBarber",
                      url: "http://localhost:3334/",
                      email: "gobarber@gobarber.com"
                    }
                },
                servers: [
                    {
                        url: "http://localhost:3334/"
                    }
                ],
                //security: {
                //    bearerAuth: [],
                //}
            },
            // ['./src/models/*.js']
            apis: ["./src/app/controllers/*.js"]
        };

        this.swaggerDocs = swaggerJsDoc(swaggerOptions);        
    } 

    setRoutes(routes){
        routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.swaggerDocs));
    }
};

export default new Swagger();
