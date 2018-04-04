import express from 'express';
import config from './config';
import AWS from 'aws-sdk';
import definitions from './serv/routes/definitions';
import geocode from './serv/routes/geocode';
import dynamodb from './serv/routes/dynamodb';
import bodyParser from 'body-parser'
// import webpackConfig from './webpack.config';
// import webpack from 'webpack';

AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static('src'));

app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render( 'index', { answer: 77 } );
});

app.use('/api/definitions', definitions);
app.use('/api/geocode', geocode);
app.use('/api/dynamodb', dynamodb);



// const compiler = webpack(webpackConfig);

// app.use(require('webpack-hot-middleware')(compiler));
// app.use(require('webpack-dev-middleware')(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath,
// }));



app.listen(config.port, function listenHandler(){
    console.info(`Running on ${config.port}...`);
});
