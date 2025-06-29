import swaggerAutoGen from "swagger-autogen";


const doc = {
    info: {
        title: 'WatchDog API',
        description: 'WatchDog API'
    },
    host: "watchdog-7ja8.onrender.com",
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js'];

swaggerAutoGen()(outputFile, endpointsFiles, doc);
