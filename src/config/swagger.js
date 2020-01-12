import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

class Swagger {
    constructor(){
        // Extended: https://swagger.io/specification/#infoObject
        const swaggerOptions = {
            swaggerDefinition: {
                openapi: "3.0.0",
                info: {
                    title: "Time to document that Express API you built",
                    version: "1.0.0",
                    description:
                      "A test project to understand how easy it is to document and Express API",
                    license: {
                      name: "MIT",
                      url: "https://choosealicense.com/licenses/mit/"
                    },
                    contact: {
                      name: "Swagger",
                      url: "https://swagger.io",
                      email: "Info@SmartBear.com"
                    }
                },
                servers: [
                    {
                        url: "http://localhost:3334/"
                    }
                ]
            },
            // ['./src/models/*.js']
            apis: ["./src/app/models/*.js"]
        };

        this.swaggerDocs = swaggerJsDoc(swaggerOptions);        
    } 

    setRoutes(routes){
        routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.swaggerDocs));
    }
};

export default new Swagger();
